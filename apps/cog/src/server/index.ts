import express from "express";
import { executeFunction, integratedFunctions } from "./utils/executeFunction";
import { getOperatingContext } from "./utils/context";
import { initializeCogApiBootstrap } from "./utils/initialize";
import { Logger } from "tslog";
import { respondWith } from "./utils/server_utils";
import zodToJsonSchema from "zod-to-json-schema";
import { authToken } from "./middleware/authorize";
import initializeFirebase from "./utils/firebase";
import { redis } from "@yungsten/utils";
import { Ok, Err, Result } from "ts-results";
import { getWorkflowSchedule } from "./utils/workflows";
import { jobIdToUserName } from "./utils/job_utils";

/**
 * Starts an ExpressJS server that exposes an HTTP POST endpoint for executing
 * integrated functions through the Cog framework.
 *
 * The server also includes additional endpoints for interacting with BullJS
 * queues and scheduled workflows.
 *
 * @param commandLineArgs - An array of strings representing command line arguments
 * passed to the entry point when starting the server. Currently, this argument
 * is not used by the server.
 *
 * @returns void - The server function does not return anything. It starts the
 * server and listens for incoming requests until the process is terminated.
 */
export const server = async function (commandLineArgs: string[]) {
  const logger = new Logger();
  const app = express();
  // Set the view engine to EJS so we can render views for the status screen at the root path '/'
  app.set("view engine", "ejs");
  app.use(express.json());

  const serverContext = await getOperatingContext();
  // Sets up all of the IntegratedFunctions and Queues for this Cog service
  await initializeCogApiBootstrap(serverContext);

  /**
   * Homepage.  Shows basic information about Cog and its operating status using EJS to render elementary HTML
   */
  app.get("/", async (_, res) => {
    const redisConnection = await redis.connectToRedis(serverContext.env, {});
    // Create an object with status information to be displayed on the status screen
    const status = {
      host: serverContext.env.API_HOST,
      numberOfIntegratedFunctions: getIntegratedFunctions().length,
      numberOfScheduledWorkflows: Object.keys(await getWorkflowSchedule(serverContext))
        .length,
      redis: {
        host: redisConnection.options.host,
        port: redisConnection.options.port,
        tls: redisConnection.options.sentinelTLS !== undefined,
      },
    };
    // Render the status screen using the "pages/index" view and passing in the status object
    res.render("pages/index", { status });
  });

  // Initialize firebase and Auth middleware if in use.
  // Any routes below here will be secured if configured, otherwise, they will be unrestricted
  const firebaseAdmin = initializeFirebase();
  if (firebaseAdmin) {
    app.use(authToken(firebaseAdmin));
    logger.info(`configured Firebase authentication strategy`);
  } else {
    logger.warn(`no authentication strategy configured, starting cog without security!`);
  }

  /**
   * This route handler listens for POST requests to '/api/:parameter' and invokes the IntegratedFunction specified by the "parameter" in the request params.
   *
   * @param req - The request object, which should contain a "parameter" property in its params and a request body.
   * @param res - The response object, to which the response from the invoked IntegratedFunction will be sent.
   */
  app.post<{ parameter: string }>("/api/:parameter", async (req, res) => {
    // Extract the "parameter" from the request params
    const param = req.params.parameter;
    logger.info(`received request to execute function '${param}'`);
    // Execute the IntegratedFunction specified by the "parameter"
    const response = await executeFunction(serverContext, param, req.body);
    // Send the response from the IntegratedFunction back to the client
    res.send(response);
  });

  /**
   * Removes a scheduled workflow from the system.
   *
   * This route accepts a request with a `workflowName` parameter in the URL path. It retrieves the
   * schedule for all Workflow, searches for the workflow with the specified name, and removes it
   * from the schedule if found. The removed workflow is returned in the response.
   *
   * @returns a response with the removed workflow and a status message
   */
  app.all<{ workflowName: string }>("/api/remove-workflow", async (req, res) => {
    const workflowName = req.query.workflowName ?? req.body.workflowName;
    if (typeof workflowName !== "string") {
      if (workflowName === undefined || workflowName === null) {
        const msg =
          `received '${workflowName}' as the argument to 'workflowName', please specify the 'workflowName'` +
          `argument either as a URL parameter or within a JSON body to this request`;
        logger.warn(msg);
        return res.send(respondWith(400, msg));
      }
      const msg = `received a bad request to remove a workflow where the workflow was not of type string`;
      logger.warn(msg);
      return res.send(respondWith(400, msg));
    }
    // Retrieve the schedule of all Workflow in the system
    const workflowSchedule = await getWorkflowSchedule(serverContext, true);
    if (workflowSchedule.ok) {
      // Retrieve the Workflow definition associated with the specified Workflow name
      const workflowDef = workflowSchedule.val[workflowName];
      logger.info(`received request to remove Workflow '${workflowName}'`);
      // Check if the specified workflow name was not found in the active Cog schedule
      if (!workflowDef) {
        const msg = `Workflow '${workflowName}' not found!`;
        logger.warn(msg);
        return res.send(respondWith(500, msg));
      }
      // Check if the workflowDef does not have a queue name
      if (!workflowDef["queueName"]) {
        const msg = `no queueName found for Workflow ${workflowName}!`;
        logger.warn(msg);
        return res.send(respondWith(500, msg));
      }
      // Retrieve the queue associated with the workflowDef
      const queue = await redis.getQueue(
        serverContext.mqConnection,
        workflowDef["queueName"] || "default"
      );
      try {
        // Remove the workflowDef from the queue
        await queue.removeRepeatableByKey(workflowDef["key"]);
      } catch (e) {
        // error specifically on being unable to remove the workflow
        const error = e as Error;
        const msg = `unable to remove Workflow '${workflowName}', removeRepeatableByKey failed: ${error.message}`;
        logger.error(msg);
        return res.send(respondWith(500, msg));
      }
      // Username of the person who scheduled this Workflow is found positionally within the BullJS Job ID:
      const userWhoScheduled = jobIdToUserName(workflowDef["key"]);
      try {
        let reqBody: unknown;
        try {
          reqBody = JSON.stringify(workflowDef["reqBody"]);
        } catch (e) {
          const msg =
            `successfully removed workflow '${workflowName}' from the system with key ` +
            `'${workflowDef["key"]}', but was not able to JSON serialize the reqBody`;
          logger.error(msg);
          reqBody = `[could not serialize reqBody for Workflow '${workflowName}'!]`;
        }
        const workflow = {
          workflowName,
          cron: workflowDef["cron"],
          user: userWhoScheduled,
          key: workflowDef["key"],
          reqBody: reqBody,
        };
        return res.send(
          res.send(
            respondWith(
              200,
              `successfully removed Workflow '${workflowName}' for user '${userWhoScheduled}'`,
              workflow
            )
          )
        );
      } catch (e) {
        // error specifically on being unable to remove the workflow
        const error = e as Error;
        const msg = `was able to remove workflow '${workflowName}' for user '${userWhoScheduled}', but had trouble assembling the response: ${error.message}`;
        logger.error(msg);
        return res.send(respondWith(500, msg));
      }
    } else {
      // general error catch statement
      const msg = `unable to get system Workflow schedule: ${workflowSchedule.val}`;
      logger.error(msg);
      return res.send(respondWith(500, msg));
    }
  });

  /**
   * GET request handler for the `/api/scheduled-workflows` route.
   * This route retrieves all of the scheduled Workflow in the Cog system.
   * If the `extendedDetails` query parameter is provided, this route will also return
   * detailed information about each workflow (e.g. function name, cron schedule, request body, etc.).
   */
  app.get("/api/scheduled-workflows", async (req, res) => {
    const workflowSchedule = await getWorkflowSchedule(
      serverContext,
      req.body?.extendedDetails
    );
    if (workflowSchedule.ok) {
      return res.send(
        respondWith(
          200,
          `found ${Object.keys(workflowSchedule).length} workflows`,
          workflowSchedule.val
        )
      );
    } else {
      return res.send(
        respondWith(
          500,
          `error retrieving ${Object.keys(workflowSchedule).length} workflows`,
          { error: workflowSchedule.val }
        )
      );
    }
  });

  /**
   * Returns a list of all the IntegratedFunctions that are available to this Cog service.
   *
   * @route GET /api/integrated-functions
   * @returns {IntegratedFunction[]} A list of all the IntegratedFunctions that are available to this Cog service.
   */
  app.get("/api/integrated-functions", async (req, res) => {
    const functions = getIntegratedFunctions();
    return res.send(
      respondWith(200, `found ${Object.keys(functions).length} integrated functions`, {
        functions,
      })
    );
  });

  /**
   * Returns an array of objects containing metadata for all IntegratedFunctions
   * registered in the Cog application.
   *
   * @returns {Array<{functionName: string, description: string, scheduleable: boolean, schema: object}>} An array of objects, with each object representing an IntegratedFunction and containing metadata for that function.
   */
  const getIntegratedFunctions = () => {
    // Map the array of `integratedFunctions` to an array of objects containing the relevant information
    return integratedFunctions.map((fn) => {
      // Return an object with the name, description, scheduleability, and JSON schema of the function
      return {
        functionName: fn.name,
        description: fn.description,
        scheduleable: fn.scheduleable,
        schema: zodToJsonSchema(fn.schema),
      };
    });
  };

  app.listen(serverContext.env.API_PORT, "0.0.0.0", () => {
    logger.info(`cog api listening on port ${serverContext.env.API_PORT}`);
  });
};

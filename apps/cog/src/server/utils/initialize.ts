import { QueueScheduler } from "bullmq";
import { env, redis } from "@yungsten/utils";
import schedule from "../../utils/schedule.json";
import { isValidCron } from "cron-validator";
import { integratedFunctions } from "./executeFunction";
import { jobId } from "../integrated_functions/system/scheduler";
import { z } from "zod";
import { Logger } from "tslog";
import { getWorkflowSchedule } from "./workflows";
import { exit } from "process";
import { IntegratedFunction } from "./types";

const logger = new Logger();

/**
 * Initialize the Cog server and schedule all Workflows.
 *
 * @param context - Redis connection context, containing connection and environment variables
 *
 * Initialization steps:
 * 1. Calls the 'initCogCoreQueues' function to create the necessary Cog Redis queues.
 * 2. Iterate over the 'schedule' object defined at the top of this file, this is the pre-set "hardcoded" Workflow JSON.
 * 3. For each workflow in the 'schedule' object:
 *      3a. check if the cron is valid
 *      3b. find the corresponding IntegratedFunction object in 'integratedFunctions'
 *      3c. create a 'jobIdPayload' object and a 'body' object to be used as arguments in the Redis queue add function.
 *      3d. get the current system Workflow schedule from Redis
 *      3e. if the current workflow is NOT in the system schedule, add to the Redis queue.
 * 4. If the function completes without any errors, log a success message for each scheduled Workflow.
 */
export const initializeCogApiBootstrap = async (
  context: redis.RedisConnectionContext
) => {
  // Check if the server is running in development mode
  if (context.env.ENVIRONMENT !== "development") {
    console.log(`in development mode`);
  }
  // Initialize the Cog Core queues
  await initCogCoreQueues(context);
  // Get the list of workflows to schedule
  const sch = Object.entries(schedule);
  // Iterate over the list of workflows
  for (let i = 0; i < sch.length; i++) {
    const entry = sch[i];
    // Skip invalid entries
    if (!entry) continue;
    // Get the name and details of the current workflow
    const workflowName = entry[0];
    const workflow = entry[1];
    logger.info(`instantiating scheduled Workflow '${workflowName}'`);
    const { functionName, reqBody, cron, calls } = workflow;
    const user = "defaultUser";
    // Check if the cron expression is valid
    if (!isValidCron(cron)) {
      logger.warn(
        `cannot schedule function '${functionName}', cron is invalid: '${cron}'`
      );
      continue;
    }
    // Find the IntegratedFunction object for the current workflow
    const scheduleableFunctions = integratedFunctions.filter((f) => f.scheduleable);
    const fn = scheduleableFunctions.find(
      (f: IntegratedFunction) => f.name === functionName
    );
    if (!fn) {
      logger.warn(`tried to schedule function '${functionName}', but not integrated!`);
      continue;
    }
    // Get the type of the request body for the current function
    type ReqBodyType = z.TypeOf<typeof fn.schema>;
    // Get the queue for the current function
    const foundQueue = await redis.getQueue<ReqBodyType>(
      context.mqConnection,
      fn.queueName
    );
    // Create an object with all the necessary information to create a unique job id within BullJS that Cog uses
    const jobIdPayload = {
      workflowName,
      user,
      cron,
      functionName,
      body: reqBody,
    };
    // Create the body object to be added to the queue, the body object has the request body of the Workflow,
    // and then any subsequent calls which are just nested IntegratedFunction calls
    const body = { reqBody, calls };
    logger.debug(`adding body to queue: ${JSON.stringify(body)}`);
    // Get the current system Workflow schedule that is present in the BullJS Queues
    const preExistingWorkflows = await getWorkflowSchedule(context);
    // If there was an issue getting the system Workflow schedule, the getWorkflowSchedule function
    // will do the standard return type of a Result, so we check if there's an error
    if (!preExistingWorkflows.ok) {
      const msg = `cannot get system Workflow schedule, so must exit..please troubleshoot from the getWorkflowSchedule function`;
      logger.error(msg);
      exit(22);
    }
    // If the current workflow name is already in the system schedule, log a warning and skip scheduling it
    if (Object.keys(preExistingWorkflows.val).indexOf(workflowName) > 0) {
      const msg = `will NOT initialize Workflow '${workflowName}', found in initialization schedule, but this Workflow is already in the Cog Redis server at ${
        env.REDIS_HOST ?? env.REDIS_FQDN
      }, skipping the scheduling of this Workflow...`;
      logger.warn(msg);
    } else {
      // Add the job to the queue with the cron repeat option
      await foundQueue.add(jobId(jobIdPayload), body, { repeat: { cron } });
      logger.info(
        `successfully scheduled Workflow '${workflowName}', function '${functionName}', cron: '${cron}'`
      );
    }
  }
};

/**
 * Initializes the Cog core queues.
 *
 * @param {redis.RedisConnectionContext} context - The Redis connection context.
 * @returns {Promise<QueueScheduler[]>} An array of QueueScheduler instances.
 */
export const initCogCoreQueues = async (
  context: redis.RedisConnectionContext
): Promise<QueueScheduler[]> => {
  // Create an array to store the QueueScheduler instances
  const schedulers: QueueScheduler[] = [];
  // Loop through all the integrated functions
  for (let i = 0; i < integratedFunctions.length; i++) {
    // Create a new QueueScheduler instance for the current function
    // and push it to the schedulers array
    schedulers.push(
      new QueueScheduler(integratedFunctions[i].queueName, {
        connection: context.mqConnection,
      })
    );
  }
  // Return the array of QueueScheduler instances
  return schedulers;
};

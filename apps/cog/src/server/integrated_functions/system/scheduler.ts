import { createIntegratedFunction, respondWith } from "../../utils/server_utils";
import { IntegratedFunction } from "../../utils/types";
import { redis } from "@yungsten/utils";
import { SchedulerBody } from "../../../utils/bodies.model";
import { z } from "zod";
import { integratedFunctions } from "../../utils/executeFunction";
import { isValidCron } from "cron-validator";
import { getWorkflowSchedule } from "../../utils/workflows";
import { getSizeInBytes } from "@yungsten/utils/dist/helper-funcs";

const WORKFLOW_MAX_BODY_SIZE_BYTES = 1000;

const _functionName = "scheduler";
type SchedulerBody = z.TypeOf<typeof SchedulerBody>;
export const jobId = (reqBody: SchedulerBody) =>
  `${reqBody.user ?? "defaultUser"}.${reqBody.workflowName}.${reqBody.functionName}.'${
    reqBody.cron
  }'`;

export const scheduler: IntegratedFunction = createIntegratedFunction(
  _functionName,
  `schedules a function with the API.  Usage: {cron: '* 12 * * *'}`,
  SchedulerBody,
  async (context, reqBody) => {
    const { functionName, body, cron, user, workflowName, calls } = reqBody;
    const sizeOfWorkflowBody = getSizeInBytes(reqBody);
    if (sizeOfWorkflowBody > WORKFLOW_MAX_BODY_SIZE_BYTES) {
      return respondWith(
        400,
        `cannot add workflow '${workflowName}', total request body of ${sizeOfWorkflowBody} bytes ` +
          `is too large for the system's limit of ${WORKFLOW_MAX_BODY_SIZE_BYTES} bytes`
      );
    }
    if (!isValidCron(cron)) {
      return respondWith(
        400,
        `cannot schedule function '${functionName}' for workflow '${workflowName}', cron is invalid: '${cron}'`
      );
    }
    const scheduleableFunctions = integratedFunctions.filter((f) => f.scheduleable);
    const fn = scheduleableFunctions.find(
      (f: IntegratedFunction) => f.name === functionName
    );
    if (!fn) {
      return respondWith(
        404,
        `cannot schedule workflow '${workflowName}', function '${reqBody.functionName}' not found!  See the ${scheduleableFunctions.length} scheduleable functions:`,
        Object.fromEntries(
          scheduleableFunctions.map((f) => {
            return [f.name, f.description];
          })
        )
      );
    }
    type ReqBodyType = z.TypeOf<typeof fn.schema>;
    const foundQueue = await redis.getQueue<ReqBodyType>(
      context.mqConnection,
      fn.queueName
    );

    const systemWorkflowIdentity = jobId(reqBody);
    const preExistingWorkflows = await getWorkflowSchedule(context);
    if (!preExistingWorkflows.ok) {
      return respondWith(
        500,
        `cannot add workflow '${workflowName}', cannot query pre-existing workflows` +
          `in the Cog system: ${preExistingWorkflows.val}`
      );
    }
    if (Object.keys(preExistingWorkflows.val).indexOf(workflowName) > 0) {
      return respondWith(
        400,
        `cannot add workflow '${workflowName}', pre-existing workflow` +
          ` exists with this exact name in the Cog system, please be more original ~.~`
      );
    }

    await foundQueue.add(
      systemWorkflowIdentity,
      { reqBody: body, calls: calls ?? null },
      { repeat: { cron } }
    );
    return respondWith(200, `user '${user}' added workflow '${workflowName}'`, {
      workflowName,
      cron,
      user,
      reqBody: body,
    });
  },
  _functionName,
  false
);

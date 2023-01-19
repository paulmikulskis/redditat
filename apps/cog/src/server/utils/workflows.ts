import { getScheduleableFunctions } from "./server_utils";
import { z } from "zod";
import { Queue } from "bullmq";
import { redis, logging } from "@yungsten/utils";
import { Ok, Err, Result } from "ts-results";
import { WorkflowSchedules, ExtendedWorkflowSchedules } from "./types";
import {
  jobIdToCron,
  jobIdToFunctionName,
  jobIdToWorkflowName,
  repeatJobId,
} from "./job_utils";
import { RedisConnectionContext } from "@yungsten/utils/dist/redis";
import { sentryException } from "../../utils/sentry";

const logger = logging.createLogger();

/**
 * retrieves the schedule of all workflows in the Cog system.
 * It does so by querying the BullJS queues for all scheduleable functions in the system and finding
 * any repeatable jobs within them.
 * @param extendedDetails - If set to true, the returned object will contain additional details about each workflow, such as the queue it is in and its ID.
 * @returns An object where each key is the name of a workflow and its value is an object containing details about the workflow.
 */
export async function getWorkflowSchedule(
  context: RedisConnectionContext,
  extendedDetails?: false
): Promise<Result<WorkflowSchedules, string>>;
export async function getWorkflowSchedule(
  context: RedisConnectionContext,
  extendedDetails?: true
): Promise<Result<ExtendedWorkflowSchedules, string>>;
export async function getWorkflowSchedule(
  context: RedisConnectionContext,
  extendedDetails?: undefined
): Promise<Result<WorkflowSchedules | ExtendedWorkflowSchedules, string>> {
  // make two arrays of the return types so we can pedantically assemble our typed return values
  const infoList: WorkflowSchedules[][] = [];
  const extendedInfoList: ExtendedWorkflowSchedules[][] = [];
  // first, get all the possible functions in the Cog system that are marked as scheduleable (this is the default)
  const funcs = getScheduleableFunctions();
  const queues: Queue<redis.QueueType<any>, unknown, string>[] = [];
  for (let i = 0; i < funcs.length; i++) {
    const fn = funcs[i];
    type ReqBody = z.TypeOf<typeof fn.schema>;
    try {
      queues.push(await redis.getQueue<ReqBody>(context.mqConnection, fn.queueName));
    } catch (e) {
      const error = e as Error;
      sentryException(error);
      const msg = `tried getting queue '${fn.queueName}' for IntegratedFunction '${fn.name}', but redis.getQueue returned an error: ${error.message}`;
      logger.error(msg);
    }
  }
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    const fn = funcs[i];
    if (!queue || !fn) continue;
    try {
      const queuedJobs = await queue.getRepeatableJobs();
      // Initialize lists for storing job summary information
      const infoJobList: WorkflowSchedules[] = [];
      const extendedInfoJobList: ExtendedWorkflowSchedules[] = [];
      for (let i = 0; i < queuedJobs.length; i++) {
        const job = queuedJobs[i];
        // If the job is undefined, log a warning and skip this iteration
        if (!job) {
          const msg = `received a job from queue '${queue.name}', but job was undefined!`;
          logger.warn(msg);
          continue;
        }
        // Try and get the repeat job ID for the current job
        let jobId: string;
        try {
          jobId = repeatJobId(job?.name || "", job?.next || 1, job?.key || "");
        } catch (e) {
          // If there was an error getting the repeat job ID, log a warning and skip this iteration
          const error = e as Error;
          sentryException(error);
          const msg = `unable to get repeatJobId for job '${
            job.name || "[UNKNOWN]"
          }' (job key = '${job?.key || "[UNKNOWN]"}'): ${error.message}`;
          logger.warn(msg);
        }
        // Get the job details for the current job from Redis BullJS
        const jobDetails = await queue.getJob(jobId);
        // If the job details are not defined, skip this iteration
        if (!jobDetails) continue;
        // Extract workflow name, function name, and cron schedule from the job name
        const workflowName = jobIdToWorkflowName(job.name);
        const functionName = jobIdToFunctionName(job.name);
        const cron = jobIdToCron(job.name);
        // Depending on the value of "extendedDetails", add either a detailed
        // or a summary version of the current job to the appropriate list
        if (extendedDetails) {
          extendedInfoJobList.push({
            [workflowName]: {
              queueName: queue.name,
              id: job.id,
              jobName: job.name,
              next: job.next,
              key: job.key,
              functionName,
              cron,
              reqBody: jobDetails?.data,
            },
          });
        } else {
          infoJobList.push({
            [workflowName]: {
              functionName,
              cron,
              reqBody: jobDetails?.data.reqBody,
              calls: jobDetails?.data.calls,
            },
          });
        }
      }
      // Add the lists of job summary information to the list of all job summaries
      infoList.push(infoJobList);
      extendedInfoList.push(extendedInfoJobList);
    } catch (e) {
      const error = e as Error;
      sentryException(error);
      const msg = `tried getting repeatable jobs for queue '${
        queue.name || "[UNKNOWN]"
      }', for IntegratedFunction '${
        fn.name || "[UNKNOWN]"
      }', but getRepeatableJobs() returned an error: ${error.message}`;
      logger.error(msg);
    }
  }
  try {
    if (extendedDetails) {
      return Ok(
        Object.fromEntries(
          extendedInfoList
            .flat()
            .map((e: ExtendedWorkflowSchedules) => [
              Object.keys(e)[0],
              Object.values(e)[0],
            ])
        )
      );
    } else {
      return Ok(
        Object.fromEntries(
          infoList
            .flat()
            .map((e: WorkflowSchedules) => [Object.keys(e)[0], Object.values(e)[0]])
        )
      );
    }
  } catch (error) {
    sentryException(error);
    const msg = `Error while processing workflow schedule: ${error.message}`;
    logger.error(msg);
    Err(msg);
  }
}

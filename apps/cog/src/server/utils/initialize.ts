import { QueueScheduler } from "bullmq";
import { redis } from "@yungsten/utils";
import schedule from "../../utils/schedule.json";
import { isValidCron } from "cron-validator";
import { integratedFunctions } from "./executeFunction";
import { IntegratedFunction } from "./server_utils";
import { jobId } from "../integrated_functions/system/scheduler";
import { z } from "zod";
import { Logger } from "tslog";

const logger = new Logger();

export const initialize = async (context: redis.RedisConnectionContext) => {
  if (context.env.ENVIRONMENT !== "development") {
    console.log(`in development mode`);
  }
  await initCogCoreQueues(context);
  const sch = Object.entries(schedule);
  for (let i = 0; i < sch.length; i++) {
    const entry = sch[i];
    if (!entry) continue;
    const workflowName = entry[0];
    const workflow = entry[1];
    logger.info(`instantiating scheduled workflow '${workflowName}'`);
    const { functionName, reqBody, cron, calls } = workflow;
    const user = "defaultUser";
    if (!isValidCron(cron)) {
      logger.warn(
        `cannot schedule function '${functionName}', cron is invalid: '${cron}'`
      );
      continue;
    }
    const scheduleableFunctions = integratedFunctions.filter((f) => f.scheduleable);
    const fn = scheduleableFunctions.find(
      (f: IntegratedFunction) => f.name === functionName
    );
    if (!fn) {
      logger.warn(`tried to schedule function '${functionName}', but not integrated!`);
      continue;
    }
    type ReqBodyType = z.TypeOf<typeof fn.schema>;
    const foundQueue = await redis.getQueue<ReqBodyType>(
      context.mqConnection,
      fn.queueName
    );
    const jobIdPayload = {
      workflowName,
      user,
      cron,
      functionName,
      body: reqBody,
    };
    const body = { reqBody, calls };
    logger.debug(`adding body to queue: ${JSON.stringify(body)}`);
    await foundQueue.add(jobId(jobIdPayload), body, { repeat: { cron } });
    logger.info(
      `successfully scheduled workflow '${workflowName}', function '${functionName}', cron: '${cron}'`
    );
  }
};

export const initCogCoreQueues = async (
  context: redis.RedisConnectionContext
): Promise<QueueScheduler[]> => {
  const schedulers: QueueScheduler[] = [];
  for (let i = 0; i < integratedFunctions.length; i++) {
    schedulers.push(
      new QueueScheduler(integratedFunctions[i].queueName, {
        connection: context.mqConnection,
      })
    );
  }
  return schedulers;
};

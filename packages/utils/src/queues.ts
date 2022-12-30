import { QueueScheduler, Queue, BaseJobOptions } from "bullmq";
import { Logger } from "tslog";
// import { IntegratedFunction } from "../../server/utils/server_utils"
import { connectToRedisBullmq } from "./redis";
import { validatedEnv as env } from "./validatedEnv";
const logger = new Logger();

export type QueueType<B> = {
  reqBody: B;
  calls: Record<string, any> | null;
};

export type QueueTypeInput = {
  reqBody: Record<string, any> | null;
  calls: Record<string, any> | null;
};

export const getQueue = async <A>(
  queueName: string,
  defaultJobOptions?: BaseJobOptions
): Promise<Queue<any, unknown, string>> => {
  const attempts = 1;
  logger.info(`connecting to queue ${queueName}, QueueConfig: attempts=${attempts}`);
  return new Queue<any>(queueName, {
    connection: await connectToRedisBullmq(env),
    defaultJobOptions: defaultJobOptions ?? {
      attempts: attempts,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
  });
};

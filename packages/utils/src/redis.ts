import { RedisOptions } from "ioredis";
import Redis from "ioredis";
// https://github.com/OptimalBits/bull/issues/503
// import EventEmitter from "events"
import { ValidatedEnv, validatedEnv as env } from "./validatedEnv";
import { Logger } from "tslog";
import { QueueScheduler, Queue, BaseJobOptions } from "bullmq";
const logger = new Logger();

// EventEmitter.defaultMaxListeners = 20
const extraLogging = true;

export const connectToRedis = (
  env: ValidatedEnv,
  options: RedisOptions
): Promise<Redis> => {
  if (extraLogging) {
    env.REDIS_FQDN.length > 1
      ? logger.info(`connecting to redis with TLS on ${env.REDIS_FQDN}`)
      : logger.info(
          ` connecting to redis (no-tls) at ${env.REDIS_HOST}:${env.REDIS_PORT}`
        );
  }
  const redis =
    env.REDIS_FQDN.length > 1
      ? new Redis(env.REDIS_FQDN)
      : new Redis({
          port: env.REDIS_PORT,
          host: env.REDIS_HOST,
          ...options,
        });
  return new Promise((resolve, reject) => {
    redis.on("connect", () => {
      //logger.debug("redis successfully connected");
      resolve(redis);
    });
    redis.on("error", (err: Error) => {
      logger.error("redis connection failed: ", err.message);
      reject(err);
    });
  });
};

export const connectToRedisBullmq = async (env: ValidatedEnv): Promise<Redis> =>
  connectToRedis(env, { maxRetriesPerRequest: null, enableReadyCheck: false });

export type QueueType<B> = {
  reqBody: B;
  calls: Record<string, any> | null;
};

export type QueueTypeInput = {
  reqBody: Record<string, any> | null;
  calls: Record<string, any> | null;
};

export type RedisConnectionContext = {
  env: ValidatedEnv;
  mqConnection: Redis;
};

export const getQueue = async <A>(
  connection: Redis,
  queueName: string,
  defaultJobOptions?: BaseJobOptions
): Promise<Queue<any, unknown, string>> => {
  const attempts = 1;
  logger.info(`connecting to queue ${queueName}, QueueConfig: attempts=${attempts}`);
  return new Queue<any>(queueName, {
    defaultJobOptions: defaultJobOptions ?? {
      attempts: attempts,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
    connection: connection,
  });
};

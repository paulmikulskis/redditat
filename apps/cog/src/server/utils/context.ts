import type IORedis from "ioredis";
import { redis as Yredis } from "@yungsten/utils";
import { env } from "@yungsten/utils";

export const getOperatingContext = async (): Promise<Yredis.RedisConnectionContext> => {
  const mqConnection = await Yredis.connectToRedisBullmq(env);
  return {
    env,
    mqConnection,
  };
};

import type IORedis from "ioredis";
import { connectToRedisBullmq } from "../../utils/redis";
import { ValidatedEnv } from "@yungsten/utils";

export type Context = {
  env: ValidatedEnv;
  mqConnection: IORedis;
};

export const getContext = async (
  rawEnv: Record<string, string | undefined>
): Promise<Context> => {
  const env = ValidatedEnv.parse(rawEnv);
  const mqConnection = await connectToRedisBullmq(env);
  return {
    env,
    mqConnection,
  };
};

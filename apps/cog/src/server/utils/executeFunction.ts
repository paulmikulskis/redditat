import { respondError } from "./server_utils";
import { redis, logging } from "@yungsten/utils";
import { IntegratedFunction, IntegratedCalls } from "./types";
import { allIntegratedFunctions } from "../integrated_functions/index";

const logger = logging.createLogger();

export const integratedFunctions: (IntegratedFunction | IntegratedCalls)[] = [
  ...allIntegratedFunctions,
];

export const executeFunction = (
  context: redis.RedisConnectionContext,
  functionName: string,
  rawBody: unknown
) => {
  const fn = integratedFunctions.find(({ name }) => {
    return name == functionName;
  });
  if (!fn) {
    logger.warn(
      `api tried to execute function '${functionName}', but function not integrated!`
    );
    return respondError(404, "function not found");
  }
  logger.info(`api executing function '${functionName}'`);
  return fn.fn(context, rawBody);
};

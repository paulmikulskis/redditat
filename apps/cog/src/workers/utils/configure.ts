import { env, logging } from "@yungsten/utils";

const logger = logging.createLogger();
export { env };

if (env.ENVIRONMENT !== "development") {
  logger.debug(`environment is NOT "development", '${env.ENVIRONMENT}'`);
} else {
  logger.debug(`environment: '${env.ENVIRONMENT}'`);
}

import { env } from "@yungsten/utils";
import { Logger } from "tslog";

const logger = new Logger();
export { env };

if (env.ENVIRONMENT !== "development") {
  logger.debug(`environment is NOT "development", '${env.ENVIRONMENT}'`);
} else {
  logger.debug(`environment: '${env.ENVIRONMENT}'`);
}

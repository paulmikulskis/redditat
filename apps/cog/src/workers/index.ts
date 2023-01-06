import { exampleFunc } from "./system/example-func";
import { scanEntireChannel } from "./youtube/scanEntireChannel";
import { scanCommunityPost } from "./youtube/scanCommunityPost";
import { scanChosenVideos } from "./youtube/scanChosenVideos";
import { scanRecentVideos } from "./youtube/scanRecentVideos";
import { scanCommentList } from "./youtube/scanCommentList";
import { checkYTAuthToken } from "./youtube/checkYTAuthToken";
import { healthcheck } from "./system/healthcheck";
import { tweetyHandleScrape } from "./datalines/tweetyHandle";
import { Worker } from "bullmq";
import { range } from "lodash";
import { Logger } from "tslog";
import { exit } from "process";
import { config } from "dotenv";
import { env } from "@yungsten/utils";
import { z } from "zod";
import { redis } from "@yungsten/utils";
import { integratedFunctions } from "../server/utils/executeFunction";

const workers = async function (commandLineArgs: string[]) {
  const mqConnection = await redis.connectToRedisBullmq(env);
  const logger = new Logger();
  logger.info(`starting worker stack...`);
  config({ path: "base.env" });
  config({ path: ".env", override: true });
  const integratedWorkers = [
    exampleFunc,
    scanEntireChannel,
    scanCommunityPost,
    scanChosenVideos,
    scanRecentVideos,
    scanCommentList,
    checkYTAuthToken,
    healthcheck,
    tweetyHandleScrape,
  ];

  const workers = integratedWorkers.map((w) => {
    const calledFunc = integratedFunctions.find((f) => f.name === w.name);
    logger.debug(`starting worker: '${w.name}'`);
    return range(0, env.COG_WORKER_COUNT).map(() => {
      return new Worker<z.TypeOf<typeof calledFunc.schema>>(calledFunc.queueName, w(), {
        connection: mqConnection,
        concurrency: env.COG_WORKER_CONCURRENCY,
        limiter: {
          max: 10,
          duration: 1000,
        },
      });
    });
  });

  const workerNames = workers.map((w) => w[0] && w[0].name);
  logger.debug(`registered ${workers.length} workers`);
  logger.debug(
    `worker names: ${workerNames.toString().replace("[", "").replace("]", "")}`
  );
  const allTheWorkers = workers;

  const args = commandLineArgs;
  // will be the name of the service to run via command line argument
  const arg = args[0];
  if (!arg || arg === "all") {
    logger.warn(
      `no worker name specifed to the worker stack!  will attempt to run all workers...`
    );
    await allTheWorkers;
  } else if (workerNames.indexOf(arg) >= 0) {
    const i = workerNames.indexOf(arg);
    const worker = workers[i];
    if (!worker) {
      logger.error(
        `started against worker '${arg}' but no matching worker integration found`
      );
      exit(20);
    }
    logger.info(`starting service: '${worker[0].name}'`);
  } else {
    logger.error(
      `started against worker '${arg}' but no matching worker integration found`
    );
    exit(20);
  }
};

export { workers };

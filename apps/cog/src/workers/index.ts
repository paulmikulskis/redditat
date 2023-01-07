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

/** * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Define the list of integrated workers available to Cog HERE:
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
const INTEGRATED_WORKERS = [healthcheck, tweetyHandleScrape];

/**
 * The Cog worker handler.
 *
 * This function starts the Cog worker stack, which consists of one or more "integrated workers"
 * that listen for jobs on a message queue and execute them.
 *
 * The `commandLineArgs` argument is an array of strings representing the additional command line
 * arguments passed to the script. If the first element of this array is the name of a specific
 * integrated worker, only that worker will be started. Otherwise, all of the integrated workers
 * will be started.
 *
 * Example usage:
 *   node dist/index.js workers
 *   node dist/index.js workers healthcheck
 *   node dist/index.js workers tweetyHandleScrape
 *
 * @param commandLineArgs the command line argument passed to the main index.ts after
 *    the first arg (which was 'worker' to start this script).  This first arg is optionally the worker name
 * @returns an array of Worker instances, one for each integrated worker
 */
const workers = async function (commandLineArgs: string[]) {
  // Connect to the message queue using the Redis BullJS library.
  const mqConnection = await redis.connectToRedisBullmq(env);
  // Create a logger for logging messages.
  const logger = new Logger();
  logger.info(`starting worker stack...`);
  const allWorkerNames = INTEGRATED_WORKERS.map((w) => w[0] && w[0].name);
  /**
   * Start the specified list of integrated workers.
   * creates a new Worker instance for each integrated worker and starts it.
   * @param INTEGRATED_WORKERS the list of integrated workers to start
   * @returns an array of Worker instances, one for each integrated worker
   */
  const startWorkers = (
    INTEGRATED_WORKERS: (() => ({ data }: any) => Promise<boolean>)[]
  ) => {
    const workers = INTEGRATED_WORKERS.map((w) => {
      // Find the corresponding integrated function for the worker
      const calledFunc = integratedFunctions.find((f) => f.name === w.name);
      logger.debug(`starting worker: '${w.name}'`);
      // Create and return the Worker instances
      return range(0, env.COG_WORKER_COUNT).map(() => {
        return new Worker<z.TypeOf<typeof calledFunc.schema>>(calledFunc.queueName, w(), {
          connection: mqConnection,
          // The "concurrency" option specifies the maximum number of jobs that can be processed
          // concurrently by each worker instance.
          concurrency: env.COG_WORKER_CONCURRENCY,
          // The "limiter" option specifies a rate limit for the worker instances.
          // In this case, the worker instances are limited to a maximum of 10 jobs per second.
          limiter: {
            max: 10,
            duration: 1000,
          },
        });
      });
    });
    // Extract the names of the activated workers
    const activatedWorkerNames = workers.map((w) => w[0] && w[0].name);
    logger.debug(`registered ${workers.length} workers`);
    logger.debug(
      `worker names: ${activatedWorkerNames.toString().replace("[", "").replace("]", "")}`
    );
    return workers;
  };

  // Check the first command-line argument (if present).
  const arg = commandLineArgs[0];
  // If no argument is specified, or if the argument is "all", start all workers.
  if (!arg || arg === "all") {
    logger.warn(
      `no worker name specifed to the worker stack!  will attempt to run all workers...`
    );
    return startWorkers(INTEGRATED_WORKERS);
  }
  // If the argument specifies a valid worker name, start only that worker.
  else if (allWorkerNames.indexOf(arg) >= 0) {
    // Find the index of the specified worker in the list of integrated workers.
    const i = allWorkerNames.indexOf(arg);
    // Get the corresponding integrated worker.
    const worker = workers[i];
    // If the integrated worker was not found, log an error and exit.
    if (!worker) {
      logger.error(
        `started against worker '${arg}' but no matching worker integration found`
      );
      exit(20);
    }
    // Log a message indicating that the specified worker is starting.
    logger.info(`starting service: '${worker[0].name}'`);
    // Start the specified worker.
    return startWorkers([worker]);
  }
  // If the argument specifies an invalid worker name, log an error and exit.
  else {
    logger.error(
      `started against worker '${arg}' but no matching worker integration found`
    );
    exit(20);
  }
};

export { workers };

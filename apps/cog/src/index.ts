/********************************************
 *  /|      /|
 * / |     / |
 *  / |    /  |
 * /  |   /   |
 *  /  |  /    |
 * /   | /     |
 *  /   /     /
 * /  /       /
 *  / /      /
 * / /     /
 *  /     /
 * /    /
 *  /   /
 * /  /
 *  /
 *
 * COG - A Robust Workflow Management System
 *
 * This framework is a central platform for managing and scheduling
 * asynchronous processes in your application.  It is built on top of BullJS,
 * and allows for integration of custom functions and workflows that can be
 * scheduled using cron syntax.  COG makes it easy to deploy reliable and
 * scalable background jobs.
 *
 ********************************************/

import { server } from "./server/index";
import { workers } from "./workers/index";
import { testing } from "./testing";
import { conditionallyConfigureSentry, sentryException } from "./utils/sentry";

/**
 * The entry point for the Cog application.
 *
 * This file is used to start the Cog API server, the Cog workers, or the Cog testing playground,
 * depending on the `entryPoint` command line argument passed to the script.
 *
 * The `entryPoint` argument should be one of "api", "workers", or "testing".
 *
 * Additional command line arguments can be passed after the `entryPoint` argument, and will be
 * passed to the corresponding handler.
 *
 * Example usage:
 *   node dist/index.js api
 *   node dist/index.js workers
 *   node dist/index.js testing arg1 arg2
 */

// Parse the `entryPoint` and additional arguments from the command line.
const entryPoint = process.argv[2];
const args = process.argv.slice(3);

/**
 * The main function for the Cog entry point.
 *
 * This function determines which handler to invoke based on the `entryPoint` argument, and then
 * invokes the corresponding handler with the additional arguments.
 *
 * If the `entryPoint` argument is not recognized, an error message is printed to the console.
 */
async function main() {
  conditionallyConfigureSentry();
  if (entryPoint.toLocaleLowerCase() === "api") {
    console.log(`starting cog ${entryPoint.toLocaleLowerCase()}`);
    try {
      await server(args);
    } catch (e) {
      sentryException(e as Error);
    }
  } else if (entryPoint.toLocaleLowerCase() === "workers") {
    console.log(`starting cog ${entryPoint.toLocaleLowerCase()}`);
    try {
      await workers(args);
    } catch (e) {
      sentryException(e as Error);
    }
  } else if (entryPoint.toLocaleLowerCase() === "testing") {
    console.log(`starting cog test playground: "${entryPoint.toLocaleLowerCase()}"`);
    try {
      await testing(args);
    } catch (e) {
      sentryException(e as Error);
    }
  } else {
    console.error(`Invalid entry point: ${entryPoint.toLocaleLowerCase()}`);
  }
}

/**
 * Run the main function.
 */
(async function run() {
  await main();
})();

import { server } from "./server/index";
import { workers } from "./workers/index";
import { testing } from "./testing";

const [entryPoint, ...args] = process.argv.slice(2);

async function main() {
  if (entryPoint.toLocaleLowerCase() === "api") {
    console.log(`starting cog ${entryPoint.toLocaleLowerCase()}`);
    await server(args);
  } else if (entryPoint.toLocaleLowerCase() === "workers") {
    console.log(`starting cog ${entryPoint.toLocaleLowerCase()}`);
    await workers(args);
  } else if (entryPoint.toLocaleLowerCase() === "testing") {
    console.log(`starting cog test playground: "${entryPoint.toLocaleLowerCase()}"`);
    await testing(args);
  } else {
    console.error(`Invalid entry point: ${entryPoint.toLocaleLowerCase()}`);
  }
}

(async function run() {
  await main();
})();

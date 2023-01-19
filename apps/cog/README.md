# Cog-Core

The core of this framework (Cog) is to provide declarative scheduling of functions which can optionally be chained together in as Workflows. The framework exposes interactivity to run these functions via a schedule (JSON), in tandem with a REST API to
inspect, run, stop, and schedule functions as well.

Cog also provides a boilerplate for quickly building out an API with type-checking functionality.

For example, let's say you want to schedule a health check where you reach out to 3-4 services, make a judgement call on the status, then ping a webhook with that OK or ERR status. This can easily be orchestrated with Cog.

The pieces of this service consist of:

- a Redis instance running [BullMQ](<(https://github.com/OptimalBits/bull)>) (implemented with `docker compose`)
- an Express server which presents an API to talk to Redis via a _function call_ interface
  - these functions can be triggered and addressed via the Express+Node API via defining one function with the `createIntegratedFunction` helper function.
- this Express+Node application uses BullMQ w/Redis to orchestrate your functions
  - these functions are defined with a helper func called `createIntegratedWorker`

![Screen Shot 2022-09-07 at 11 14 28 PM](https://user-images.githubusercontent.com/16529164/189026105-71b36177-0935-491f-90c3-8abd71f37a1f.png)

### Example use-cases:

- providing an interface to schedule sending emails every Monday
- call a heavy back-end service without waiting via queueing up the job in Cog
- provide an HTTP endpoint to expose custom on-the-fly scheduling by users
- easily save, view, edit, and delete the functionality for customer service

# API Routes

| Method | Route                      | Description                                                                                                                          |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/`                        | Hello World                                                                                                                          |
| GET    | `/api/scheduled-workflows` | retrieves all the currently scheduled workflows in the system                                                                        |
| POST   | `/api/scheduler`           | schedules the IntegratedFunction specified in the JSON body to be called on a specified cron (see below for example)                 |
| POST   | `/api/[funcName]`          | calls the IntegratedFunction called `funcName` from the path, the JSON body are the named function arguments that get passed through |

# Makefile commands

> run these from the monorepo root!

| Command          | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `make cog`       | starts the API, Redis, and all workers locally, tails logs |
| `make cog-build` | builds the cog containers locally                          |
| `make cog-down`  | brings down the local cog containers                       |
| `make cog-help`  | show more commands to work with the Cog stack locally      |

> ❗ ensure to run `cog-down` once finished, if you `Ctrl`+`c` out, everything will _still be running!_

### Example scheduling a function with the API

```
curl --location --request POST '127.0.0.1:15000/api/scheduler' \
--header 'Content-Type: application/json' \
--data-raw '{   "workflowName": "myHealthcheckingWorkflow",
    "functionName": "healthcheck",
    "user": "doesntMatter",
    "cron": "* * * * *",
    "reqBody": {
      "endpoint": "https://healthchecks.yungstentech.com/ping/c0ca6da6-c0e4-48c4-a711-4386213ac0f9"
    },
}'
```

if everything worked, you should see the file changing in your local directory every minute with a new updated-at time. (the data will likely be the same though 😄 )

### Example scheduling a function with a pre-set schedule:

Create a file (if it does not already exist) called `schedule.json` in `/src/utils/`:

```JSON
{
  "MyFirstWorkflow": {
    "cron": "* * * * *",
    "functionName": "healthcheck",
    "reqBody": {
      "endpoint": "https://healthchecks.yungstentech.com/ping/c0ca6da6-c0e4-48c4-a711-4386213ac0f9"
    },
  }
}
```

when `make cog` and then `make cog-logs` is run, you will notice your Workflow gets scheduled:

```
cog-workers-1 | ...  DEBUG  environment: 'development'
cog-api-1     | ...  INFO   redis successfully connected
cog-api-1     | ...  INFO   instantiating scheduled workflow 'MyFirstWorkflow'
cog-api-1     | ...  INFO   connecting to queue exampleFunc
cog-api-1     | ...  DEBUG  adding body to queue: {"reqBody":{"miles":5}}
cog-api-1     | ...  INFO   successfully scheduled workflow 'MyFirstWorkflow', function 'exampleFunc', cron: '* * * * *'
```

`schedule.json` gets read upon boot and whatever gets defined here gets scheduled! One of the more powerful features of Cog is the ability to chain Workflows, which you can find mode detail for later on.

# Development Example

## Dutchie API Information

Let's say we want to reach out to a public API endpoint to grab some information **every hour of the day**, and dump it to a file.  
There are two main steps...

First we create a custom function:

### 👉 -- Custom Function (Worker) Logic

These functions are pieces of code that are run later at some point by some machine; call these custom functions **workers**.

> the term Workers is a universal concept and the underlying class in [the SDK from BullJS](https://optimalbits.github.io/bull/) is named: `Worker`
>
> You can define a worker by maing a folder for your new stuff in the `src/workers/` directory. Let's name this one `exampleFunc` since we want to dump out all the names of the dispensaries near us. Now we have:

```bash
- src
    server/
    utils/
    workers/
     * system/              # <-- let's throw this in the system folder, why not
       * exampleFunc.ts           #  <-- define worker func inside a new exampleFunc.ts
```

The skeleton of a worker

```Typescript
import { gql } from "graphql-request"; // this worker will use gql and..
import { GraphQLClient } from "graphql-request"; //..graphql-request to query an API
import fs from "fs";
import { createIntegratedWorker } from "../utils/worker"; // function to create your worker
import { StoreInfoDumpBodyType } from "../../server/integrated_functions/exampleFunc"; // importing this schema to simply help with field suggestions and typing

// just defining a query our Worker will use to grab data when invoked
const query = gql`
  query exampleFunc($miles: Float!) {
    filteredDispensaries(filter: { nearLat: 42.3, nearLng: -71.2, distance: $miles }) {
      name
      distance
      address
    }
  }
`;

export const exampleFunc = () => {
  return createIntegratedWorker(
    "exampleFunc", // name of integratedWorker (used for info like `queueName`)

    // core function that defines this worker:
    // all integratedWorkers get called with { reqBody, calls }
    async ({ reqBody, _calls }) => {
      const body: StoreInfoDumpBodyType = reqBody;
      const miles = body.miles;
      try {
        const client = new GraphQLClient("https://dutchie.com/graphql");
        client.request(query, { miles: miles }).then((data: any) => {
          fs.writeFileSync("exampleFunc.json", JSON.stringify(data));
          console.log(`succesfully wrote to exampleFunc.json!`);
        });
      } catch (e) {
        console.log(`ERROR while trying to request (miles=${miles})`);
      }
    }
  );
};

```

To register this worker with the Queue system, import and add it to `src/workers/index.ts`:

```Typescript
import { exampleFunc } from "./system/exampleFunc"
  // ...
  const INTEGRATED_WORKERS = [exampleFunc] // <- add your exported func to this array
```

Now that a worker has been created to perform our business logic, let's define the expected reqBody Type this Worker will expect to receive by tying it to an **IntegratedFunction**.

The IntegratedFunction will provide type-checking when passing in arguments to this Worker (so that other workers can call it), as well as make this Worker callable/schedulable via the REST interface provided by Cog.

Let's make an IntegratedFunction:

### 👉 -- Add this functionality to the API

You can integrate a route by maing a file for your new route in the `src/server/integrations` directory. Let's name this one `exampleFunc` since this is the name we used in the worker. Now we have:

```bash
- src
    server/
      index.ts
      utils/
      integrated_functions/
        * exampleFunc.ts          <-- new file
```

All we really ned to do is have our API route add a job to the queue if called upon:

```Typescript
import { z } from "zod";
import { createIntegratedFunction, respondWith } from "../utils/server_utils";
import { IntegratedFunction } from "../utils/types";
import { redis, logging } from "@yungsten/utils";

// Every IntegratedFunction (POSTs) will look for a specific structure in the HTTP body.
// We define that structure with Zod.  If this IntegratedFunction is the interface for
// a callable Worker (as we just wrote above), this also defines the reqBody form
// for routing/type-checking/control-flow within the Worker stack:
export const StoreInfoDumpBody = z.object({
  miles: z.number(),
});

// we need to convert that 👆 model into a Type so we can grab the Queue functionality
export type StoreInfoDumpBodyType = z.TypeOf<typeof StoreInfoDumpBody>;

// call the createIntegratedFunction() method to bootstrap your API route:
export const exampleFunc: IntegratedFunction = createIntegratedFunction(
  "exampleFunc", // Name of the IntegratedFunction (route for API)
  `finds stores within a certain distance from a given location`, // Help string
  StoreInfoDumpBody, // Body type we defined above
  async (context, body) => {
    // Actual functionality to perform if called upon
    // The context and body get auto-exposed, to provide connection and global vars
    const dispoDumpQueue = await redis.getQueue<StoreInfoDumpBodyType>(
      context.mqConnection,
      "exampleFunc"
    );
    const { miles } = body; // we can expect a field 'miles'
    // queue a job in this queue for our new Worker to pick up:
    const job = await dispoDumpQueue.add(`customId.${miles}`, { reqBody: { miles }, calls: null });
    // since an IntegratedFunction is ultimately a route, make sure to respond HTTP:
    return respondWith(200, `added job to queue 'exampleFunc' for shops within '${miles}' miles`, { job });
  }
);

```

just like when we defined our IntegratedWorker, let's add the new IntegratedFunction to the array where they all get bootstrapped. For IntegratedFunctions, that lies in `src/server/utils/executeFunctions.ts`:

```Typescript
import { IntegratedCalls, IntegratedFunction, respondError } from "./server_utils"
import { scheduler } from "../integrated_functions/scheduler"
import { exampleFunc } from "../integrated_functions/exampleFunc"

export const integratedFunctions: (IntegratedFunction | IntegratedCalls)[] = [
  exampleFunc,
  scheduler // the 'scheduler' function is there by default
]
```

### 👉 -- Run it:

run `make cog` (ensure Docker is running) and issue this `curl` to queue up some work to be done:

```
curl --location --request POST '127.0.0.1:15000/api/exampleFunc' \
--header 'Content-Type: application/json' \
--data-raw '{ "miles": 20 }'
```

You should see a file pop up called `exampleFunc.json` pop up in the root directory (docker-compose maps its working directory here so we can see outputs)

### Build

When Cog gets built into a Docker container, the Dockerfile you will notice has a build argument: `COG_SERVICE_BUILD_NAME`
The one **very important** build argument to pay attention to, as it will set the _service_ type (`api` or `workers`). Example building manually without using the Makefile:

```bash
docker build -f apps/cog/Dockerfile --build-arg COG_SERVICE_BUILD_NAME=api -t cog-api:latest .
```

When the Dockerfile produced the finished container, that container is told to run a script at startup called `startup.sh`. This script will configure Vector if set, and kick off the stack as needed.

The `startup.sh` script has a few environment variables that it will look for on the runtime host when deciding how to boot the application at hand:

| Environment Variable      | Default Value            | Description                                                                                     |
| ------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------- | ----------- |
| `APPLICATION_NAME`        | "cog"                    | The name of the application that this script is booting inside of apps/.                        |
| `VECTOR_SYSTEM_PATH`      | "~/.vector/bin/vector"   | The path to the Vector binary, which serves as the logging agent.                               |
| `VECTOR_CONFIG_FILE_PATH` | "vector/vector-cog.toml" | The location of the Vector configuration file.                                                  |
| `VECTOR_BACKUP_DATA_DIR`  | "vector/data"            | In case the script cannot create /var/lib/vector, where should Vector                           | store data? |
| `DEFAULT_COMMANDS`        | ["api", "workers"]       | The default commands that the script will use if it cannot find package. json. _(not required)_ |             |
| `RUN_WITH_VECTOR`         | "false"                  | Whether or not to run the Vector logging agent.                                                 |

> NOTE: though this startup script was developed for Cog, it is totally malleable in the sense that you can set `APPLICATION_NAME` to be whatever app you want in a typical monorepo setup, and this startup script will play nice with a Docker build using turborepo.

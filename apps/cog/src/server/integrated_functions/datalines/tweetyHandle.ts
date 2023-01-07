import { z } from "zod";
import { createIntegratedFunction, respondWith } from "../../utils/server_utils";
import { IntegratedFunction } from "../../utils/types";
import { redis } from "@yungsten/utils";
import { types } from "@yungsten/reddit-wrap";
import { QueueEvents } from "bullmq";
import { Ok, Err, Result } from "ts-results";
import { Logger } from "tslog";

const logger = new Logger();
export const functionName = "tweetyHandleScrape";

// exported because also use this type value in the Worker, just to KISS
export type TweetyHandleScrapeType = z.TypeOf<typeof types.YTwitterApiHandleScrapeArgs>;

/**
 * Handles an HTTP request to queue up a job for the 'tweetyHandle' integrated worker to scrape tweets from the Yungsten Twitter API proxy for a given twitter user's handle.
 *
 * This function sends a request to a BullJS queue, adding a job with the provided parameters from the request's JSON POST body. The provided handle is cleaned by removing the leading '@' character if it exists. The job is given an ID that is a combination of the current timestamp and the cleaned handle.
 *
 * @param context - the context object provided by the integrated function's middleware
 * @param body - the JSON POST body of the HTTP request, containing the parameters for the 'tweetyHandle' worker
 * @returns an HTTP response containing a message and the added job
 */
export const tweetyHandleScrape: IntegratedFunction =
  createIntegratedFunction<TweetyHandleScrapeType>(
    functionName,
    `scrapes tweets from the Yungsten Twitter API proxy for a given twitter user's handle`,
    types.YTwitterApiHandleScrapeArgs,
    async (context, body) => {
      const scrapeTime = new Date();
      const tweetyHandleScrapeQueue = await redis.getQueue<TweetyHandleScrapeType>(
        context.mqConnection,
        functionName
      );
      const { handle, ntweets, pages, extended, response } = body;
      const cleanedHandle = handle[0] === "@" ? handle.slice(1) : handle;
      const job = await tweetyHandleScrapeQueue.add(
        `${scrapeTime.getTime()}.${cleanedHandle}`,
        {
          reqBody: { handle: cleanedHandle, ntweets, pages, extended },
          calls: null,
        }
      );
      const jobMsg = `job ${job.id} to scrape ${ntweets} tweets from ${pages} pages  for twitter user '@${cleanedHandle}'`;
      const successMsg = `successfully ran ${jobMsg}`;
      const errorMsg = `failed to run ${jobMsg}`;
      if (!response) {
        logger.info(successMsg);
        return respondWith(200, successMsg, {
          job,
        });
      } else {
        const queueEvents = new QueueEvents(functionName, {
          connection: context.mqConnection,
        });
        const resp = (await job.waitUntilFinished(queueEvents)) as Result<
          types.TweetyTweet[],
          string
        >;
        if (resp.ok) {
          logger.info(successMsg);
          return respondWith(200, successMsg, { data: resp.val });
        } else {
          logger.warn(errorMsg);
          return respondWith(500, errorMsg, { error: resp.val });
        }
      }
    }
  );

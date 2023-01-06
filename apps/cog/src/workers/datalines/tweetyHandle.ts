import { createIntegratedWorker } from "../utils/worker"; // function to create your worker
import {
  TweetyHandleScrapeType,
  functionName,
} from "../../server/integrated_functions/datalines/tweetyHandle"; // importing this schema to simply help with field suggestions and typing
import { Logger } from "tslog";
import { ytwitter } from "@yungsten/reddit-wrap";
import { TwitterContentDBDriver } from "@yungsten/redditat-database/dist/twitterContent";
import { PrismaClient } from "@prisma/client";
import { Ok, Err, Result } from "ts-results";
import { TweetyTweet } from "@yungsten/redditat-database";

const logger = new Logger();

/**
 * Creates a Cog Worker function that is responsible for scraping tweets from a specified Twitter handle, and then
 * inserting those tweets into a database.
 *
 * The function utilizes the 'createIntegratedWorker' utility to create a wrapped function that is ready to be called
 * by Cog. When called, the wrapped function will execute the core logic of this worker function.
 *
 * The core logic consists of:
 *  1. Using the YTwitterApi to make a request to the Yungsten Tech backdoor Twitter API, to retrieve the specified
 *     number of tweets from the specified handle.
 *  2. If the API request was successful (i.e. the YTwitterApi returned an 'Ok' Result), then the returned tweets are
 *     passed to the 'insertTweetTree' method of the TwitterContentDBDriver. This method will insert the tweets into
 *     the database, along with any replies, retweets, and quoted tweets that are associated with them.
 *  3. If either the YTwitterApi or the TwitterContentDBDriver returned an 'Err' Result, then this worker function
 *     will return an 'Err' Result with a helpful error message.
 *
 * This function returns a Promise that resolves to a Result. The Result is an 'Ok' Result if the scraping and
 * insertion was successful, or an 'Err' Result if there was any issue. The 'Ok' value is an array of TweetyTweet
 * objects, which represent the inserted tweets. The 'Err' value is a string that contains a helpful error message.
 *
 * We use the ts-results library to wrap our values in a Result object. This allows us to easily communicate success
 * or failure, and to attach helpful metadata (e.g. error messages) to our values.
 *
 * @returns {Promise<Result<TweetyTweet[], string>>} - a Promise that resolves to a Result indicating the success or
 * failure
 **/
export const tweetyHandleScrape = () => {
  return createIntegratedWorker(
    functionName,
    async ({ reqBody, _calls }): Promise<Result<TweetyTweet[], string>> => {
      const body: TweetyHandleScrapeType = reqBody;
      const { handle, ntweets, pages, extended } = body;
      try {
        // instantiate new instances of the required classes
        const db = new PrismaClient();
        const twitterClient = new ytwitter.YTwitterApi();
        const databaseClient = new TwitterContentDBDriver(db);
        // get the tweets from the twitterClient using the passed in handle, ntweets, pages, and extended params
        // handle is a string with the twitter's username (without the @)
        // ntweets is an integer for the number of tweets to return from the base set pulled
        // pages is an integer of twitter "UI" pages that the API will scrape
        // extended params is a boolean that will dictate whether the Comments are pulled or not of a tweet (should be true)
        const tweetsResult = await twitterClient.getTweets(
          handle,
          ntweets,
          pages,
          extended
        );
        // if the tweets we just scraped give us an OK result:
        if (tweetsResult.ok) {
          const tweets = tweetsResult.val;
          logger.info(
            `grabbed ${tweets.length} tweets for twitter user '@${handle}', inserting to DB:`
          );
          let insertedTweetsResult: Result<TweetyTweet[], string>;
          // try inserting the tweet tree into the database
          try {
            insertedTweetsResult = await databaseClient.insertTweetTree(tweets);
            if (insertedTweetsResult.ok) {
              const insertedTweets = insertedTweetsResult.val;
              return Ok(insertedTweets);
            } else {
              const origErrorString = insertedTweetsResult.val;
              const msg = `error inserting ${tweets.length} tweets for twitter user '@${handle}'!! ${origErrorString}`;
              logger.error(msg);
              return Err(msg);
            }
            // database insert failed
          } catch (error) {
            const err = error as Error;
            const msg = `unhandled error while having the databaseClient call 'insertTweetTree' for twitter user '@${handle}', ${err.message}`;
            logger.error(msg);
            return Err(msg);
          }
          // if the tweets we just scraped give us an Err result:
        } else {
          const tweetsError = tweetsResult.val;
          // we expect a string here from the "val" of tweetsResult, but just in case somewhere something
          // went wrong, we do one more pedantic check to make sure we are dealing with an error STRING
          if (typeof tweetsError !== "string")
            throw new Error(
              `got Err Result from twitterClient, but the 'val' was not a string!`
            );
          const msg = `ERROR while trying to scrape twitter user '@${handle}': ${tweetsError}`;
          logger.error(msg);
          return Err(msg);
        }
        // if instantiation of the classes failed, catch the error:
      } catch (error) {
        const err = error as Error;
        const msg = `ERROR while trying to scrape twitter user '@${handle}', ${err.message}`;
        logger.error(msg);
        return Err(msg);
      }
    }
  );
};

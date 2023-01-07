import { ytwitter } from "@yungsten/reddit-wrap";
import { twitterContent } from "@yungsten/redditat-database";
import { PrismaClient } from "@prisma/client";
import { env } from "@yungsten/utils";

console.log(`DATABASE URI: ${env.SUPABASE_PSQL_URI}`);
export const testing = async (args: string[]) => {
  console.log(`instantiating the Yungsten TwitterAPI wrapper...`);
  const yapi = new ytwitter.YTwitterApi();
  console.log(`......done!`);
  console.log(`instantiating the Twitter DB wrapper...`);
  const db = new PrismaClient({ datasources: { db: { url: env.SUPABASE_PSQL_URI } } });
  db.$connect();
  const yapi_db = new twitterContent.TwitterContentDBDriver(db);
  console.log(`......done!`);
  const handle = args.length > 0 ? args[0] : "elonmusk";
  const ntweets = args.length > 1 ? parseInt(args[1]) : 10;
  const pages = args.length > 2 ? parseInt(args[2]) : 20;
  console.log(`about to get twitter posts for user '@${handle}'...`);
  const tweets = await (await yapi.getTweets(handle, ntweets, pages)).unwrap();
  console.log(`got all tweets from '@${handle}' !  About to try and insert into db...`);
  const result = await yapi_db.insertTweetTree(tweets);
  if (result.ok) {
    console.log(`......done!`);
  } else {
    console.log(`error while inserting into db: ${result.toString()}`);
  }
};

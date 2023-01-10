import { Rat, rclient, ytwitter } from "@yungsten/reddit-wrap";
import { twitterContent, redditContent } from "@yungsten/redditat-database";
import { PrismaClient } from "@prisma/client";
import { env } from "@yungsten/utils";
import { exit } from "process";

console.log(`DATABASE URI: ${env.SUPABASE_PSQL_URI}`);
export const testing = async (args: string[]) => {
  const subredditName = args[0] ?? "askreddit";
  console.log(`instantiating the Rat wrapper...`);
  const rat = new Rat(rclient);
  console.log(`connecting to the database...`);
  const db = new PrismaClient({ datasources: { db: { url: env.SUPABASE_PSQL_URI } } });
  await db.$connect();
  const driver = new redditContent.RedditContent();
  console.log(`getting the latest post from ${subredditName}`);
  const latest = await rat.getLatestFrom(subredditName);
  if (!latest.ok) {
    console.log(`error while trying to get the latest subreddit: ${latest.val}`);
    exit(20);
  }
  const posts = latest.val;
  const firstPost = posts[0].submission;
  console.log(`got post: ${firstPost.title}`);
  console.log(`about to insert post '${firstPost.id}' into the database...`);
  const ret = await driver.upsertSnoowrapSubmission(db, firstPost, 1, 2);
  if (ret.ok) {
    console.log(`SCRAPED DATA FROM REDDIT:`);
    console.log(JSON.stringify(ret.val, null, 2));
  }
};

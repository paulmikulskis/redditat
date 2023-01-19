import { TweetyTweet, PrismaClient, RedditResources } from "@prisma/client";
import { Ok, Err, Result } from "ts-results";
import { Media, TaskStatus } from "./types";
import { subHours } from "date-fns";
import { types } from "@yungsten/reddit-wrap";
import { ytwitter } from "@yungsten/reddit-wrap";
import { logging } from "@yungsten/utils";

const logger = logging.createLogger();

export class TwitterContentDBDriver {
  private twitterApi;

  constructor(private db: PrismaClient) {
    this.twitterApi = new ytwitter.YTwitterApi();
  }

  async insertTweetTree(
    tweets: types.TweetyTweet[]
  ): Promise<Result<TweetyTweet[], string>> {
    let insertedTweets: TweetyTweet[] = [];
    for (const tweet of tweets) {
      let fetedAuthor = await this.db.twitterUser.findFirst({
        where: { id: tweet.author.id },
      });
      if (!fetedAuthor || fetedAuthor === null) {
        let fetedAuthorRes = await this.twitterApi.getUser(tweet.author.username);
        if (fetedAuthorRes.ok) {
          let fetedAuthor2;
          try {
            fetedAuthor2 = fetedAuthorRes.unwrap();
          } catch (error) {
            const err = error as Error;
            return Err(
              `error while querying user '${tweet.author.username}' from the twitter API: ${err.message}`
            );
          }
        } else {
          const msg = `error! unable to find twitter user ${tweet.author.username}`;
          console.log(msg);
          return Err(msg);
        }
      }
      try {
        console.log(`about to recurse on ${tweet.comments.length} tweets`);
        let recursedComments: string[] = [];
        if (tweet.comments.length > 0) {
          try {
            recursedComments = (
              await new TwitterContentDBDriver(this.db).insertTweetTree(tweet.comments)
            )
              .unwrap()
              .map((t) => t.id);
          } catch (error) {
            const err = error as Error;
            return Err(`error while recursing on tweet ${tweet.id}: ${err.message}`);
          }
        }

        const newUser = {
          id: tweet.author.id,
          created_on: tweet.author.created_at,
          default_profile: tweet.author.default_profile,
          default_profile_image: tweet.author.default_profile_image,
          description: tweet.author.description,
          fast_followers_count: tweet.author.fast_followers_count,
          favourites_count: tweet.author.favourites_count,
          followers_count: tweet.author.followers_count,
          friends_count: tweet.author.friends_count,
          has_custom_timelines: tweet.author.has_custom_timelines,
          is_translator: tweet.author.is_translator,
          listed_count: tweet.author.listed_count,
          location: tweet.author.location,
          media_count: tweet.author.media_count,
          name: tweet.author.name,
          normal_followers_count: tweet.author.normal_followers_count,
          possibly_sensitive: tweet.author.possibly_sensitive,
          profile_banner_url: tweet.author.profile_banner_url,
          profile_image_url_https: tweet.author.profile_image_url_https,
          profile_interstitial_type: tweet.author.profile_interstitial_type,
          profile_url: tweet.author.profile_url,
          protected: tweet.author.protected,
          rest_id: tweet.author.rest_id,
          screen_name: tweet.author.screen_name,
          statuses_count: tweet.author.statuses_count,
          translator_type: tweet.author.translator_type,
          username: tweet.author.username,
          verified: tweet.author.verified,
          verified_type: tweet.author.verified_type,
        };

        const newTweet = {
          id: tweet.id,
          author: newUser.id,
          card: tweet.card ?? undefined,
          comments: `${recursedComments.length} comments`,
          created_on: tweet.created_on,
          hashtags: tweet.hashtags
            ? tweet.hashtags.map((tag: any) =>
                typeof tag.text === "string" ? tag.text : JSON.stringify(tag.text)
              )
            : [],
          quoted_tweet: JSON.stringify(tweet.quoted_tweet),
          is_possibly_sensitive: tweet.is_possibly_sensitive,
          is_quoted: tweet.is_quoted,
          is_reply: tweet.is_reply,
          is_retweet: tweet.is_retweet,
          language: tweet.language,
          likes: tweet.likes,
          media: JSON.stringify(tweet.media) ?? undefined,
          place: JSON.stringify(tweet.place) ?? undefined,
          quote_counts: tweet.quote_counts,
          reply_counts: tweet.reply_counts,
          reply_to: tweet.reply_to,
          retweet_counts: tweet.retweet_counts,
          source: tweet.source,
          symbols: JSON.stringify(tweet.symbols) ?? undefined,
          text: tweet.text,
          threads: JSON.stringify(tweet.threads) ?? undefined,
          tweet_body: tweet.tweet_body,
          urls: JSON.stringify(tweet.urls) ?? undefined,
          user_mentions: JSON.stringify(tweet.user_mentions) ?? undefined,
          vibe: tweet.vibe,
        };

        const data = {
          ...newTweet,
          author: {
            connectOrCreate: {
              where: {
                id: tweet.author.id,
              },
              create: newUser,
            },
          },
          comments: {
            connect: recursedComments.map((s) => {
              return { id: s };
            }),
          },
        };

        // Create a new ContentGenerationTask in the database
        const tweetyTweet = await this.db.tweetyTweet.upsert({
          create: data,
          update: {},
          where: {
            id: tweet.id,
          },
        });
        insertedTweets.push(tweetyTweet);
      } catch (error: unknown) {
        const err = error as Error;
        return Err(err.message);
      }
    }
    return Ok(insertedTweets);
  }
}

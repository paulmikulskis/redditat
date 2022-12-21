import snoowrap from "snoowrap";
import { Comment, RedditUser, Submission } from "snoowrap";
import { env } from "@yungsten/redditat-utils";
import { writeFileSync } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import { types, requests } from "@yungsten/redditat-utils";
import {
  submissionContainsImage,
  submissionPointsToImageDomains,
  getImgurUrl,
} from "./utils/postUtils";
import { getCommentDetails } from "./utils/commentUtils";
import { CommentDetails } from "./types";

export const rclient = new snoowrap({
  userAgent: env.REDDIT_BOT_USER_AGENT,
  clientId: env.REDDIT_BOT_CLIENT_ID,
  clientSecret: env.REDDIT_BOT_CLIENT_SECRET,
  refreshToken: env.REDDIT_BOT_REFRESH_TOKEN,
});

export class Rat {
  client: snoowrap;

  constructor(snoowrapClient: snoowrap) {
    this.client = snoowrapClient;
  }

  /**
   * Fetches the latest "top" submission from the given subreddit for the day and returns the submission details.
   * If the submission is a text post, returns the body and title. If the submission is an image,
   * returns the body, title, and a link to the image.
   *
   * @param {string} subreddit - The subreddit to fetch the latest submission from.
   * @param {string} topAmount - The amount of top daily posts to download from the given subreddit, defaults to 1
   * @returns {Promise<Result<{ body: string, title: string, link?: string } | undefined, Error>>} A promise that resolves to a `Result` object containing the submission details or an error if the request fails.
   */
  async getLatestFrom(
    subreddit: string,
    topAmount: number = 1
  ): Promise<
    types.Result<
      { id: string; body: string; title: string; link?: string } | undefined,
      undefined | Error
    >
  > {
    try {
      const submissions = await this.client.getSubreddit(subreddit).getTop({
        limit: topAmount,
        time: "day",
      });
      const submission = submissions[0] as Submission;
      if (submission.is_self) {
        console.log("got text post");
        return new types.Result(true, {
          id: submission.id,
          body: submission.selftext,
          title: submission.title,
        });
      } else if (
        submissionContainsImage(submission) ||
        submissionPointsToImageDomains(submission)
      ) {
        console.log("got image post");
        const imageURLs = await getImgurUrl(submission.url);
        const thisImageUrl = imageURLs ? imageURLs[0] : ""; // get first URL available for image
        const mediaResponse = await requests.request({
          url: thisImageUrl,
          method: "GET",
          responseType: "arraybuffer",
          headers: { "Content-Type": "application/octet-stream" },
        });
        const mediaPath = resolve(
          process.cwd(),
          "media",
          `${submission.id}.${
            thisImageUrl.substring(thisImageUrl.lastIndexOf(".") + 1).split("?")[0]
          }`
        );
        // could also try the preview: submission.preview.images[0].source.url
        writeFileSync(mediaPath, mediaResponse.body, "binary");
        return new types.Result(
          true,
          {
            id: submission.id,
            body: submission.selftext,
            title: submission.title,
            link: mediaPath,
          },
          undefined
        );
      } else {
        console.log(`error writing or fetching file ${submission.url}`);
        return new types.Result(
          true,
          {
            id: submission.id,
            body: submission.selftext,
            title: submission.title,
            link: submission.url,
          },
          undefined
        );
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      return new types.Result(
        false,
        undefined,
        new Error("unknown error in getLatestFrom")
      );
    }
  }

  /**
   * Returns a tree of comments for the given submission.
   *
   * @param {string} submissionId - The ID of the submission to get comments for.
   * @returns {Promise<Comment[]>} A promise that resolves to an array of comment objects.
   */
  async getCommentTree(submissionId: string): Promise<CommentDetails[]> {
    const submission = this.client.getSubmission(submissionId);
    return submission.comments.map(getCommentDetails);
  }
}

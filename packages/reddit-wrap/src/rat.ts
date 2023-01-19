import snoowrap from "snoowrap";
import { Comment, RedditUser, Submission } from "snoowrap";
import { env } from "@yungsten/utils";
import { writeFileSync } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import { types, requests } from "@yungsten/utils";
import {
  submissionContainsImage,
  submissionPointsToImageDomains,
  getImgurUrl,
} from "./utils/postUtils";
import { getCommentDetails } from "./utils/commentUtils";
import { CommentDetails } from "./types";
import { Ok, Err, Result } from "ts-results";
import { logging } from "@yungsten/utils";

const logger = logging.createLogger();

export const rclient = new snoowrap({
  userAgent: env.REDDIT_BOT_USER_AGENT || "",
  clientId: env.REDDIT_BOT_CLIENT_ID || "",
  clientSecret: env.REDDIT_BOT_CLIENT_SECRET || "",
  refreshToken: env.REDDIT_BOT_REFRESH_TOKEN || "",
});

/**
 * The `Rat` class is a utility class for interacting with the Reddit API using the snoowrap library.
 * The class provides methods for fetching Reddit submissions and storing them as media files.
 *
 * @example
 * ```
 * const rat = new Rat(snoowrapClient);
 * const submissionSummary = await rat.getSubmissionSummary("abc123");
 * if (submissionSummary.isOk()) {
 *   logger.debug(submissionSummary.value.title);
 * } else {
 *   console.error(submissionSummary.error);
 * }
 * ```
 */
export class Rat {
  client: snoowrap;

  constructor(snoowrapClient: snoowrap) {
    this.client = snoowrapClient;
  }

  /**
   * Fetch a summary of a Reddit submission based on the given submission ID.
   *
   * @param {string} submissionId - The submission ID of the Reddit post.
   * @param {snoowrap} client - The snoowrap client to use to make the request.
   * @returns {Promise<Result<{ id: string, body: string, title: string, link?: string }, String>>} A promise that resolves to a `Result` object containing the submission summary or an error if the request fails.
   */
  async getSubmissionSummary(
    submissionId: string
  ): Promise<Result<{ id: string; body: string; title: string; link?: string }, String>> {
    try {
      // Fetch the submission from Reddit
      const submission: Submission = this.client.getSubmission(submissionId);
      // Return the submission summary as a JSON object
      return Ok({
        id: submission.id,
        body: submission.selftext,
        title: submission.title,
        link: submission.url,
      });
    } catch (error: unknown) {
      const err = error as Error;
      // Return the error in the result if the request fails
      return Err(err.message);
    }
  }

  async getSubredditObject(subreddit: string) {
    const sub = this.client.getSubreddit(subreddit).then((s) => {
      return s;
    });
    //@ts-ignore
    return await sub;
  }

  /**
   * Fetches the latest "top" submission summary from the given subreddit for the day and returns the submission details.
   * If the submission is a text post, returns the body and title. If the submission is an image,
   * returns the body, title, and a link to the image.
   *
   * @param {string} subreddit - The subreddit to fetch the latest submission from.
   * @param {string} topAmount - The amount of top daily posts to download from the given subreddit, defaults to 1
   * @returns {Promise<Result<{ id: string, body: string, title: string, submission: Submission, link?: string } | undefined, Error>>} A promise that resolves to a `Result` object containing the submission details or an error if the request fails.
   */
  async getLatestFrom(
    subreddit: string,
    topAmount: number = 1,
    over18: boolean = false,
    saveObjects: boolean = true
  ): Promise<
    Result<
      {
        id: string;
        body: string;
        title: string;
        link?: string;
        submission: Submission;
      }[],
      Error
    >
  > {
    const filteredSubmissions = [];
    try {
      const submissions = await this.client.getSubreddit(subreddit).getTop({
        limit: topAmount + 15,
        time: "day",
      });
      for (const submission of submissions) {
        if (submission.over_18 !== over18) continue;
        logger.debug(
          `found submission ${submission.id} with ${submission.comments.length} comments`
        );
        if (submission.is_self) {
          logger.debug("got reddit text-only post");
          filteredSubmissions.push({
            id: submission.id,
            body: submission.selftext,
            title: submission.title,
            submission: Object.create(submission),
          });
        } else if (
          submissionContainsImage(submission) ||
          submissionPointsToImageDomains(submission)
        ) {
          let mediaPath;
          if (saveObjects) mediaPath = await this.storePostImage(submission.url);
          filteredSubmissions.push({
            id: submission.id,
            body: submission.selftext,
            title: submission.title,
            link: mediaPath,
            submission: Object.create(submission),
          });
        } else {
          logger.error(`error writing or fetching file ${submission.url}`);
          filteredSubmissions.push({
            id: submission.id,
            body: submission.selftext,
            title: submission.title,
            link: submission.url,
            submission: Object.create(submission),
          });
        }
      }
      return Ok(filteredSubmissions.slice(0, topAmount));
    } catch (error) {
      logger.error(JSON.stringify(error));
      return Err(new Error("unknown error in getLatestFrom"));
    }
  }

  /**
   * Returns a tree of comments for the given submission.
   *
   * @param {string} submissionId - The ID of the submission to get comments for.
   * @param {number} maxLen - Max length in characters of comments that will end up in the commentTree
   * @returns {Promise<Comment[]>} A promise that resolves to an array of comment objects.
   */
  async getCommentTree(
    submissionId: string,
    maxLen: number = 80
  ): Promise<CommentDetails[]> {
    const submission = this.client.getSubmission(submissionId);
    return submission.comments
      .map(getCommentDetails)
      .filter((commentDetails) => commentDetails.text.length < maxLen);
  }

  /**
   * Downloads and stores an image from the provided url to local disk
   *
   * @param url - The url of the page that contains the image.
   * @returns The path to the stored image on the filesystem, or an empty string if the image could not be stored.
   */
  async storePostImage(url: string): Promise<string | undefined> {
    try {
      const imageURLs = await getImgurUrl(url);
      // If there are no image URLs, return undefined
      if (!imageURLs || imageURLs.length === 0) return undefined;
      // Get the first image URL available
      const thisImageUrl = imageURLs[0];
      // Make a GET request to the image URL to download the image
      const mediaResponse = await requests.request({
        url: thisImageUrl,
        method: "GET",
        responseType: "arraybuffer",
        headers: { "Content-Type": "application/octet-stream" },
      });
      // Generate a file name for the image based on the url
      const fileName = `${url}.${
        thisImageUrl.substring(thisImageUrl.lastIndexOf(".") + 1).split("?")[0]
      }`;
      const mediaPath = resolve(process.cwd(), "media", fileName);
      // Write the image to the filesystem
      writeFileSync(mediaPath, mediaResponse.body, "binary");
      // Return the file path of the stored image
      return mediaPath;
    } catch (error) {
      // An error occurred while trying to download and store the image
      logger.error(error);
      return undefined;
    }
  }
}

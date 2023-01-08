import {
  RedditContentGenerationTask,
  PrismaClient,
  RedditSubmission,
  RedditComment,
  RedditUser,
  Subreddit,
  Prisma,
} from "@prisma/client";
import { Comment, RedditUser as SnoowrapRedditUser, Submission } from "snoowrap";
import { Ok, Err, Result } from "ts-results";
import { Media, TaskStatus } from "./types";
import { subHours, formatDistanceToNow } from "date-fns";
import { Logger } from "tslog";

const logger = new Logger();

/**
 * Create a new ContentGenerationTask in the database.
 *
 * @param submissionId - The submission ID of the Reddit post.
 * @param subredditUrl - The subreddit URL of the Reddit post.
 * @param resources - The resources required to generate content for the Reddit post.
 * @param program - The content generation program that this task pertains to, default is "AI_DALL-E_REDDIT_READER"
 *
 * @returns Ok(ContentGenerationTask) if the ContentGenerationTask was created successfully,
 *          Err(string) with an error message if there was a problem creating the ContentGenerationTask.
 */
export class RedditContent {
  constructor(private db: PrismaClient) {}

  async createContentGenerationRequest(
    submissionId: string,
    subredditUrl: string,
    resources: Media[],
    program: string = "AI_DALL-E_REDDIT_READER"
  ): Promise<Result<RedditContentGenerationTask, string>> {
    try {
      // Create a new ContentGenerationTask in the database
      const createdContentGenerationTask =
        await this.db.redditContentGenerationTask.create({
          data: {
            program,
            submissionId,
            subredditUrl,
            resources: {
              create: resources,
            },
          },
        });
      return Ok(createdContentGenerationTask);
    } catch (error: unknown) {
      const err = error as Error;
      return Err(err.message);
    }
  }

  /**
   * Update the status of a ContentGenerationTask in the database.
   *
   * @param id - The ID of the ContentGenerationTask to update.
   * @param status - The new status of the ContentGenerationTask.
   *
   * @returns Ok(ContentGenerationTask) if the ContentGenerationTask was updated successfully,
   *          Err(string) with an error message if there was a problem updating the ContentGenerationTask.
   */
  async updateContentRequestStatus(
    id: number,
    status: TaskStatus
  ): Promise<Result<RedditContentGenerationTask, string>> {
    try {
      // Update the status of the ContentGenerationTask in the database
      const updatedContentGenerationTask =
        await this.db.redditContentGenerationTask.update({
          where: { id },
          data: { status },
        });
      return Ok(updatedContentGenerationTask);
    } catch (error: unknown) {
      const err = error as Error;
      return Err(err.message);
    }
  }

  /**
   * Get all ContentGenerationTask entries from the database that fall within a certain time range.
   *
   * @param db - The Prisma client instance.
   * @param range - The time range to filter ContentGenerationTask entries by in hours.
   * @param userId - Optional user ID to filter ContentGenerationTask entries by. (TODO)
   *
   * @returns Ok(ContentGenerationTask[]) if the ContentGenerationTask entries were retrieved successfully,
   *          Err(string) with an error message if there was a problem retrieving the ContentGenerationTask entries.
   */
  async getAllContentRequestsWithin(
    db: PrismaClient,
    range: number = 24 * 365 * 20,
    userId: string = "defaultUser"
  ): Promise<Result<RedditContentGenerationTask[], string>> {
    try {
      // Query the database for ContentGenerationTask entries
      const now = new Date();
      const rangeInPast = subHours(now, range);
      let contentGenerationTasks: RedditContentGenerationTask[];
      if (userId) {
        contentGenerationTasks = await db.redditContentGenerationTask.findMany({
          where: {
            startTime: {
              gte: rangeInPast,
            },
            user: userId,
          },
        });
      } else {
        contentGenerationTasks = await db.redditContentGenerationTask.findMany({
          where: {
            startTime: {
              gte: rangeInPast,
            },
          },
        });
      }
      return Ok(contentGenerationTasks);
    } catch (error: unknown) {
      const err = error as Error;
      return Err(err.message);
    }
  }

  /**
   * Insert or update a Snoowrap Submission in the database.
   * @param db - The Prisma client instance.
   * @param submission - The Submission object from the Snoowrap library.
   *
   * @returns Ok(RedditSubmission) if the Submission was inserted or updated successfully,
   *          Err(string) with an error message if there was a problem inserting or updating the Submission.
   */
  async upsertSnoowrapSubmission(
    db: PrismaClient,
    submission: Submission
  ): Promise<Result<RedditSubmission, string>> {
    const formattedSnoowrapSubmission = formatSnoowrapRedditSubmission(submission);
    // we need to link this submission to a user who inserted it, so we need
    // to find that user, or create and return that user so we have the ID to link to this post:
    let storedRedditUser: RedditUser;
    try {
      // user already exists, get ID
      storedRedditUser = await db.redditUser.findFirstOrThrow({
        where: { id: submission.author.id },
      });
      const usrScrapeTi = storedRedditUser.scrapeTime;
      logger.debug(
        `post author '${submission.author.name}' with id` +
          ` '${
            storedRedditUser.id
          }' already exists in the database as of ${formatDistanceToNow(
            usrScrapeTi
          )} ago, time:${usrScrapeTi.getTime()}`
      );
    } catch (e) {
      // user does not exists, attempt to create
      logger.info(
        `user '${submission.author.name}' with id` +
          ` '${submission.author.id}' does not exist in the database, creating...`
      );
      const newUserResult = await this.upsertSnoowrapRedditor(this.db, submission.author);
      if (!newUserResult.ok) {
        const msg =
          `unable to insert new reddit user '${submission.author.name}' with id` +
          ` '${submission.author.id}' into the database: ${newUserResult.val}`;
        logger.error(msg);
        // return with Err Result if there was a problem creating the user
        return Err(msg);
      }
      storedRedditUser = newUserResult.val;
    }
    const updatedFormattedSubmission = {
      ...formattedSnoowrapSubmission,
      redditUserId: storedRedditUser.id,
    };
    // actually insert the data:
    try {
      const redditSubmission = await db.redditSubmission.upsert({
        create: updatedFormattedSubmission,
        update: updatedFormattedSubmission,
        where: {
          id: formattedSnoowrapSubmission.id,
        },
      });
      return Ok(redditSubmission);
    } catch (e) {
      // something went wrong that we did not catch while trying to insert the submission
      const msg =
        `could not insert submission '${submission.id}' by user ` +
        `'${submission.author.name}' insto the database: ${(e as Error).message}`;
      logger.error(msg);
      return Err(msg);
    }
  }

  /**
   * Upsert a Reddit user in the database.
   *
   * @param db - The Prisma client instance.
   * @param redditUser - The Reddit user to upsert in the database.
   *
   * @returns Ok(RedditUser) if the Reddit user was upserted successfully,
   *          Err(string) with an error message if there was a problem upserting the Reddit user.
   */
  async upsertSnoowrapRedditor(
    db: PrismaClient,
    redditUser: SnoowrapRedditUser
  ): Promise<Result<RedditUser, string>> {
    let formattedSnoowrapRedditor;
    try {
      formattedSnoowrapRedditor = formatSnoowrapRedditor(redditUser);
    } catch (e) {
      const msg =
        `error formattinSnoowrapRedditor '${redditUser.name}' with id` +
        `'${redditUser.id}': ${(e as Error).message}`;
      logger.error(msg);
      return Err(msg);
    }
    try {
      const insertedRedditUser = await db.redditUser.upsert({
        create: formattedSnoowrapRedditor,
        update: formattedSnoowrapRedditor,
        where: {
          id: formattedSnoowrapRedditor.id,
        },
      });
      logger.info(
        `successfully upserted Redditor '${redditUser.name}' with id` +
          `'${redditUser.id}'`
      );
      return Ok(insertedRedditUser);
    } catch (error: unknown) {
      const err = error as Error;
      const msg =
        `could not upsertSnoowrapRedditor '${redditUser.name}' with id` +
        `'${redditUser.id}': ${err.message}`;
      logger.error(msg);
      return Err(msg);
    }
  }
}

/**
 * Formats a Reddit user object from the snoowrap library into a RedditUser object
 * that can be used with the Prisma library.
 *
 * @param redditUser - The Reddit user object from the snoowrap library.
 *
 * @returns A RedditUser object that can be used with the Prisma library.
 */
export const formatSnoowrapRedditor = (redditUser: SnoowrapRedditUser) => {
  let newDateParse;
  try {
    newDateParse = new Date(redditUser.gold_expiration ?? "");
  } catch (e) {
    newDateParse = null;
  }
  const newRedditUser = {
    id: redditUser.id,
    coins: redditUser.coins ?? 0,
    comment_karma: redditUser.comment_karma,
    force_password_reset: redditUser.force_password_reset ?? false,
    gold_creddits: redditUser.gold_creddits ?? 0,
    gold_expiration: newDateParse,
    has_android_subscription: redditUser.has_android_subscription ?? false,
    has_external_account: redditUser.has_external_account ?? false,
    has_ios_subscription: redditUser.has_ios_subscription ?? false,
    has_mail: redditUser.has_mail ?? false,
    has_mod_mail: redditUser.has_mod_mail,
    has_paypal_subscription: redditUser.has_paypal_subscription ?? false,
    has_stripe_subscription: redditUser.has_stripe_subscription ?? false,
    has_subscribed: redditUser.has_subscribed,
    has_subscribed_to_premium: redditUser.has_subscribed_to_premium ?? false,
    has_verified_mail: redditUser.has_verified_mail,
    has_visited_new_profile: redditUser.has_visited_new_profile ?? false,
    hide_from_robots: redditUser.hide_from_robots,
    icon_img: redditUser.icon_img,
    in_beta: redditUser.in_beta ?? false,
    in_chat: redditUser.in_chat ?? false,
    in_redesign_beta: redditUser.in_redesign_beta ?? false,
    inbox_count: redditUser.inbox_count ?? 0,
    is_employee: redditUser.is_employee,
    is_friend: redditUser.is_friend ?? false,
    is_gold: redditUser.is_gold,
    is_mod: redditUser.is_mod,
    is_sponsor: redditUser.is_sponsor ?? false,
    is_suspended: redditUser.is_suspended ?? false,
    link_karma: redditUser.link_karma,
  };
  return newRedditUser;
};

/**
 * Converts a Snoowrap `Submission` object to a RedditSubmission object that can be stored in the database.
 *
 * @param submission - The Snoowrap `Submission` object to be converted.
 *
 * @returns The converted RedditSubmission object.
 */
export const formatSnoowrapRedditSubmission = (submission: Submission) => {
  const formatted = {
    redditUserId: "", // TODO upsert user here
    id: submission.id,
    archived: submission.archived,
    clicked: submission.clicked,
    content_categories: submission.content_categories ?? [],
    contest_mode: submission.contest_mode,
    domain: submission.domain,
    hidden: submission.hidden,
    hide_score: submission.hide_score,
    is_crosspostable: submission.is_crosspostable,
    is_meta: submission.is_meta,
    is_original_content: submission.is_original_content,
    is_reddit_media_domain: submission.is_reddit_media_domain,
    is_robot_indexable: submission.is_robot_indexable,
    is_self: submission.is_self,
    is_video: submission.is_video,
    link_flair_background_color: submission.link_flair_background_color,
    link_flair_css_class: submission.link_flair_css_class,
    link_flair_richtext: JSON.stringify(submission.link_flair_richtext),
    link_flair_template_id: submission.link_flair_template_id,
    link_flair_text: submission.link_flair_text,
    link_flair_text_color: submission.link_flair_text_color,
    link_flair_type: submission.link_flair_type,
    locked: submission.locked,
    media: JSON.stringify(submission.media),
    media_embed: JSON.stringify(submission.media_embed),
    media_only: submission.media_only,
    num_comments: submission.num_comments,
    num_crossposts: submission.num_crossposts,
    over_18: submission.over_18,
    parent_whitelist_status: submission.parent_whitelist_status,
    pinned: submission.pinned,
    previous_visits: [],
    post_hint: submission.post_hint,
    preview: JSON.stringify(submission.preview),
    removal_reason: submission.removal_reason,
    removed_by_category: submission.removed_by_category,
    selftext: submission.selftext,
    selftext_html: submission.selftext_html,
    spam: submission.spam ?? false,
    spoiler: submission.spoiler,
    subreddit_subscribers: submission.subreddit_subscribers,
    thumbnail: submission.thumbnail,
    thumbnail_height: submission.thumbnail_height ?? null,
    thumbnail_width: submission.thumbnail_width ?? null,
    title: submission.title,
    upvote_ratio: submission.upvote_ratio,
    url: submission.url,
    view_count: submission.view_count,
    visited: submission.visited,
    whitelist_status: submission.whitelist_status,
    ups: submission.ups,
    downs: submission.downs,
    score: submission.score,
  };
  return formatted;
};

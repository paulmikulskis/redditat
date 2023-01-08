import {
  RedditContentGenerationTask,
  PrismaClient,
  RedditSubmission,
  RedditComment,
  RedditUser,
  Subreddit,
  Prisma,
} from "@prisma/client";
import {
  Comment,
  RedditUser as SnoowrapRedditUser,
  Submission,
  Subreddit as SnoowrapSubreddit,
} from "snoowrap";
import { Ok, Err, Result } from "ts-results";
import { Media, TaskStatus } from "./types";
import { subHours, formatDistanceToNow } from "date-fns";
import { Logger } from "tslog";

const logger = new Logger();

/**
 * Create a new ContentGenerationTask in the database.
 *
 * @param submissionId - The submission ID of the Reddit post.
 * @param subredditId - The subreddit URL of the Reddit post.
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
    subredditId: string,
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
            subredditId,
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
    // first, let's make sure we have this subreddit indexed and stored in our database
    let storedSubreddit: Subreddit;
    try {
      // user already exists, get ID
      storedSubreddit = await db.subreddit.findFirstOrThrow({
        where: { id: submission.subreddit.id },
      });
      const subredScrapTi = storedSubreddit.scrapeTime;
      logger.debug(
        `subreddit '${storedSubreddit.name}' with id` +
          ` '${
            storedSubreddit.id
          }' already exists in the database as of ${formatDistanceToNow(
            subredScrapTi
          )} ago, time:${subredScrapTi.getTime()}`
      );
    } catch (e) {
      // user does not exists, attempt to create
      logger.info(
        `subreddit '${submission.subreddit.name}' with id` +
          ` '${submission.subreddit.id}' does not exist in the database, creating...`
      );
      const newSubredditResult = await this.upsertSnoowrapSubreddit(
        this.db,
        submission.subreddit
      );
      if (!newSubredditResult.ok) {
        const msg =
          `unable to insert new subreddit '${submission.subreddit.name}' with id` +
          ` '${submission.subreddit.id}' into the database: ${newSubredditResult.val}`;
        logger.error(msg);
        // return with Err Result if there was a problem creating the user
        return Err(msg);
      }
      storedSubreddit = newSubredditResult.val;
    }
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
    // now that we are sure there is a Subreddit for this Submission the database, along with a RedditUser,
    // we can start inserting the comments since they have parents to link to
    // Upserting many comments means we need an array of objects where we have a field of type "id" specified
    // This "id" field will link the soon-to-be-inserted Comment's ID to this Submission
    let toUpsertComments: { id: string }[] = [];
    for (let i = 0; i < submission.comments.length; i++) {
      const com = submission.comments[i];
      // this call is going to recurse on all of the Comment.replies, and once again call this.upsertRedditComment
      // for each one of its children
      const newCom = await this.upsertRedditComment(
        this.db,
        com,
        submission.id,
        storedSubreddit.id
      );
      // if top-level Submission Comments fail to make it in, we fail the entire insert
      // (not the default with nested ones)
      if (!newCom.ok) {
        const msg = `error inserting comment '${com.id}' into database on submission '${submission.id}'`;
        logger.error(msg);
        return Err(msg);
      }
      toUpsertComments.push({
        id: newCom.val.id,
      });
    }
    const updatedFormattedSubmission = {
      ...formattedSnoowrapSubmission,
      comments: {
        connect: toUpsertComments,
      },
      redditUserId: storedRedditUser.id,
      subredditId: storedSubreddit.id,
    };
    // We have a Subreddit, Redditor, and Comments all in our DB, let's now enter this submission:
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

  async upsertRedditComment(
    db: PrismaClient,
    comment: Comment,
    submissionId: string,
    subredditId: string
  ): Promise<Result<RedditComment, string>> {
    const formattedComment = formatSnoowrapRedditComment(comment);
    if (!formattedComment) {
      const msg =
        `could not format the scraped comment '${comment.id}' by user` +
        ` '${comment.author.name}', skipping...`;
      logger.error(msg);
      return Err(msg);
    }
    // we need to link this comment to a user who inserted it, so we need
    // to find that user, or create and return that user so we have the ID to link to this comment:
    let storedRedditUser: RedditUser;
    try {
      // user already exists, get ID
      storedRedditUser = await db.redditUser.findFirstOrThrow({
        where: { id: comment.author.id },
      });
      const usrScrapeTi = storedRedditUser.scrapeTime;
      logger.debug(
        `comment author '${comment.author.name}' with id` +
          ` '${
            storedRedditUser.id
          }' already exists in the database as of ${formatDistanceToNow(
            usrScrapeTi
          )} ago, time:${usrScrapeTi.getTime()}`
      );
    } catch (e) {
      // user does not exists, attempt to create
      const newUserResult = await this.upsertSnoowrapRedditor(this.db, comment.author);
      if (!newUserResult.ok) {
        const msg =
          `unable to insert new reddit user '${comment.author.name}' with id` +
          ` '${comment.author.id}' into the database: ${newUserResult.val}`;
        return Err(msg);
      }
      storedRedditUser = newUserResult.val;
    }
    // we need to link this comment to the original post as well
    let storedRedditPost;
    try {
      // user already exists, get ID
      storedRedditPost = await db.redditSubmission.findFirstOrThrow({
        where: { id: submissionId },
      });
      const postScrapeTi = storedRedditUser.scrapeTime;
      logger.debug(
        `comment parent submission '${comment.author.name}' with id` +
          ` '${
            storedRedditUser.id
          }' already exists in the database as of ${formatDistanceToNow(
            postScrapeTi
          )} ago, time:${postScrapeTi.getTime()}`
      );
    } catch (e) {
      // post does not exists, attempt to create
      const newUserResult = await this.upsertSnoowrapRedditor(this.db, comment.author);
      if (!newUserResult.ok) {
        const msg =
          `unable to insert new reddit submission '${comment.author.name}' with id` +
          ` '${comment.author.id}' into the database: ${newUserResult.val}`;
        return Err(msg);
      }
      storedRedditPost = newUserResult.val;
    }
    let storedSubreddit;
    try {
      // Subreddit already exists, get ID
      storedSubreddit = await db.subreddit.findFirstOrThrow({
        where: { id: subredditId },
      });
      const subrScrapeTi = storedSubreddit.scrapeTime;
      logger.debug(
        `Subreddit '${storedSubreddit.name}' with id` +
          ` '${
            storedSubreddit.url
          }' already exists in the database as of ${formatDistanceToNow(
            subrScrapeTi
          )} ago, time:${subrScrapeTi.getTime()}`
      );
    } catch (e) {
      const msg =
        `unable to insert new reddit comment '${comment.id}'` +
        ` by user '${comment.author.id}', subreddit at '${subredditId}' does not exist in the database yet!`;
      return Err(msg);
    }

    // recursively upsert all the children comments to this comment
    const newCommentDBRes = await Promise.all(
      comment.replies.map(async (com) => {
        return await this.upsertRedditComment(this.db, com, submissionId, subredditId);
      })
    );
    if (newCommentDBRes.map((ret) => ret.ok).indexOf(false) > 0) {
      const msg = `could not recursively insert new comments...`;
      logger.error(msg);
      return Err(msg);
    }
    const newCommentDBIds = newCommentDBRes
      .map((ret, i) => {
        let newId;
        try {
          newId = ret.unwrap().id;
          return newId;
        } catch (e) {
          const msg = `was not able to insert comment '${
            comment.replies[i].id
          }' into database: ${(e as Error).message}`;
          logger.error(msg);
          return undefined;
        }
      })
      .filter((el) => {
        return el !== undefined;
      }) as string[];
    const updatedFormattedComment = {
      ...formattedComment,

      redditUserId: storedRedditUser.id, // link the Reddit user who made this submission
      reddit_submission_id: storedRedditPost.id, // link the original Reddit post submission ID
      redditCommentId: comment.parent_id, // store the Reddit comment's parent ID in the comment tree
      subredditId: storedSubreddit.id,
      children: {
        connect: newCommentDBIds.map((id) => {
          return { id };
        }),
      },
    };
    try {
      const insertedComment = await db.redditComment.upsert({
        create: updatedFormattedComment,
        update: updatedFormattedComment,
        where: { id: updatedFormattedComment.id },
      });
      return Ok(insertedComment);
    } catch (error: unknown) {
      const err = error as Error;
      return Err(err.message);
    }
  }

  async upsertSnoowrapSubreddit(
    db: PrismaClient,
    subreddit: SnoowrapSubreddit
  ): Promise<Result<Subreddit, string>> {
    const formattedSnoowrapSubreddit = formatSnoowrapRedditSubreddit(subreddit);
    try {
      const insertedSubreddit = await db.subreddit.upsert({
        create: formattedSnoowrapSubreddit,
        update: formattedSnoowrapSubreddit,
        where: {
          id: formattedSnoowrapSubreddit.id,
        },
      });
      logger.info(
        `successfully upserted Subreddit '${formattedSnoowrapSubreddit.name}' with id` +
          `'${formattedSnoowrapSubreddit.id}'`
      );
      return Ok(insertedSubreddit);
    } catch (error: unknown) {
      const err = error as Error;
      const msg =
        `could not upsertSnoowrapSubreddit '${formattedSnoowrapSubreddit.name}' with id` +
        `'${formattedSnoowrapSubreddit.id}': ${err.message}`;
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

export const formatSnoowrapRedditComment = (comment: Comment) => {
  let commentReplies: Comment[];
  let commentReplyIds: string[];
  try {
    commentReplies = flattenCommentTree(comment);
  } catch (e) {
    const msg =
      `tried to flattenCommentTree for comment '${comment.id}' with ${comment.replies.length}` +
      ` replies, but failed: ${(e as Error).message}`;
    logger.error(msg);
    return undefined;
  }
  try {
    commentReplyIds = comment.replies
      .map((com) => commentReplies.map((c) => c.id))
      .flat();
  } catch (e) {
    const msg =
      `tried to map and flatted comment reply IDs for comment '${comment.id}' ` +
      `with ${comment.replies.length} replies, but failed: ${(e as Error).message}`;
    logger.error(msg);
    return undefined;
  }
  if (!comment.id) {
    const msg =
      `tried to store comment comment '${comment.id}' at '${comment.link_id}'` +
      `but this comment had no id!`;
    logger.error(msg);
    return undefined;
  }
  const formatted = {
    id: comment.id ?? "",
    scrapeTime: new Date(),
    approved: comment.approved,
    body_html: comment.body_html,
    body: comment.body,
    collapsed_reason: comment.collapsed_reason,
    collapsed: comment.collapsed,
    controversiality: comment.controversiality,
    depth: comment.depth,
    ignore_reports: comment.ignore_reports,
    is_submitter: comment.is_submitter,
    link_id: comment.link_id,
    parent_id: comment.parent_id,
    removed: comment.removed,
    score_hidden: comment.score_hidden,
    spam: comment.spam,
    archived: comment.archived,
    can_gild: comment.can_gild,
    can_mod_post: comment.can_mod_post,
    distinguished: comment.distinguished,
    downs: comment.downs,
    gilded: comment.gilded,
    mod_note: comment.mod_note,
    mod_reason_by: comment.mod_reason_by,
    mod_reason_title: comment.mod_reason_title,
    mod_reports: comment.mod_reports,
    no_follow: comment.no_follow,
    num_reports: comment.num_reports,
    permalink: comment.permalink,
    replyIds: commentReplyIds ?? [],
    report_reasons: comment.report_reasons,
    saved: comment.saved,
    score: comment.score,
    send_replies: comment.send_replies,
    stickied: comment.stickied,
    ups: comment.ups,
    user_reports: comment.user_reports,
    commentId: comment.id,
  };
  return formatted;
};

export const flattenCommentTree = (comment: Comment): Comment[] => {
  return comment.replies
    .map((com) => {
      const reps = com.replies.map((r) => flattenCommentTree(r)).flat();
      return [com, ...reps];
    })
    .flat();
};

export const formatSnoowrapRedditSubreddit = (subreddit: SnoowrapSubreddit) => {
  const formatted = {
    url: subreddit.url,
    accounts_active_is_fuzzed: subreddit.accounts_active_is_fuzzed,
    accounts_active: subreddit.accounts_active,
    active_user_count: subreddit.active_user_count,
    advertiser_category: subreddit.advertiser_category ?? "",
    all_original_content: subreddit.all_original_content,
    allow_discovery: subreddit.allow_discovery,
    allow_images: subreddit.allow_images,
    allow_videogifs: subreddit.allow_videogifs,
    allow_videos: subreddit.allow_videos,
    banner_background_color: subreddit.banner_background_color,
    banner_background_image: subreddit.banner_background_image,
    banner_img: subreddit.banner_img,
    banner_size: subreddit.banner_size ?? [],
    can_assign_link_flair: subreddit.can_assign_link_flair,
    can_assign_user_flair: subreddit.can_assign_user_flair,
    collapse_deleted_comments: subreddit.collapse_deleted_comments,
    comment_score_hide_mins: subreddit.comment_score_hide_mins,
    community_icon: subreddit.community_icon,
    created: subreddit.created,
    created_utc: subreddit.created_utc,
    description: subreddit.description,
    description_html: subreddit.description_html,
    display_name: subreddit.display_name,
    display_name_prefixed: subreddit.display_name_prefixed,
    emojis_custom_size: subreddit.emojis_custom_size ?? [],
    emojis_enabled: subreddit.emojis_enabled,
    has_menu_widget: subreddit.has_menu_widget,
    header_img: subreddit.header_img,
    header_size: subreddit.header_size ?? [],
    header_title: subreddit.header_title,
    hide_ads: subreddit.hide_ads,
    id: subreddit.id,
    icon_img: subreddit.icon_img,
    icon_size: subreddit.icon_size ?? [],
    is_enrolled_in_new_modmail: subreddit.is_enrolled_in_new_modmail,
    key_color: subreddit.key_color,
    lang: subreddit.lang,
    link_flair_enabled: subreddit.link_flair_enabled,
    link_flair_position: subreddit.link_flair_position,
    name: subreddit.name,
    notification_level: subreddit.notification_level,
    over18: subreddit.over18,
    primary_color: subreddit.primary_color,
    public_description: subreddit.public_description,
    public_description_html: subreddit.public_description_html,
    public_traffic: subreddit.public_traffic,
    quarantine: subreddit.quarantine,
    show_media: subreddit.show_media,
    show_media_preview: subreddit.show_media_preview,
    spoilers_enabled: subreddit.spoilers_enabled,
    submission_type: subreddit.submission_type,
    submit_link_label: subreddit.submit_link_label,
    submit_text: subreddit.submit_text,
    submit_text_html: subreddit.submit_text_html,
    submit_text_label: subreddit.submit_text_label,
    subreddit_type: subreddit.subreddit_type,
    subscribers: subreddit.subscribers,
    suggested_comment_sort: subreddit.suggested_comment_sort,
    title: subreddit.title,
    user_can_flair_in_sr: subreddit.user_can_flair_in_sr,
    user_flair_background_color: subreddit.user_flair_background_color,
    user_flair_css_class: subreddit.user_flair_css_class,
    user_flair_enabled_in_sr: subreddit.user_flair_enabled_in_sr,
    user_flair_position: subreddit.user_flair_position,
    user_flair_template_id: subreddit.user_flair_template_id,
    user_flair_text: subreddit.user_flair_text,
    user_flair_text_color: subreddit.user_flair_text_color,
    user_has_favorited: subreddit.user_has_favorited,
    user_is_banned: subreddit.user_is_banned,
    user_is_contributor: subreddit.user_is_contributor,
    user_is_moderator: subreddit.user_is_moderator,
    user_is_muted: subreddit.user_is_muted,
    user_is_subscriber: subreddit.user_is_subscriber,
    user_sr_flair_enabled: subreddit.user_sr_flair_enabled,
    user_sr_theme_enabled: subreddit.user_sr_theme_enabled,
    whitelist_status: subreddit.whitelist_status,
    wiki_enabled: subreddit.wiki_enabled,
    wls: subreddit.wls,
  };
  return formatted;
};

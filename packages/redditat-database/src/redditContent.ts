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
  Listing,
} from "snoowrap";
import { Ok, Err, Result } from "ts-results";
import { Media, TaskStatus, RedditDriverSubmission, RedditDriverComment } from "./types";
import { subHours, formatDistanceToNow, sub } from "date-fns";
import { Rat, rclient } from "@yungsten/reddit-wrap";
import { logging } from "@yungsten/utils";

const logger = logging.createLogger();

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
  public fetchMorePageSize: number;
  constructor(fetchMorePageSize = 100000) {
    this.fetchMorePageSize = fetchMorePageSize;
  }

  async createContentGenerationRequest(
    submissionId: string,
    subredditId: string,
    resources: Media[],
    program: string = "AI_DALL-E_REDDIT_READER",
    db: PrismaClient
  ): Promise<Result<RedditContentGenerationTask, string>> {
    try {
      // Create a new ContentGenerationTask in the database
      const createdContentGenerationTask = await db.redditContentGenerationTask.create({
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
    status: TaskStatus,
    db: PrismaClient
  ): Promise<Result<RedditContentGenerationTask, string>> {
    try {
      // Update the status of the ContentGenerationTask in the database
      const updatedContentGenerationTask = await db.redditContentGenerationTask.update({
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
    submission: Submission,
    replyTreeDepth = 1,
    maxComments = 10,
    _exists = false // to optimize recursive checking of DB if this submission exists
  ): Promise<Result<RedditDriverSubmission, string>> {
    const formattedSnoowrapSubmission = formatSnoowrapRedditSubmission(submission);
    // first, let's make sure we have this subreddit indexed and stored in our database
    let storedSubreddit: Subreddit;
    try {
      logger.debug(`checking if database has subreddit id '${submission.subreddit_id}'`);
      // subreddit already exists, get ID
      storedSubreddit = await db.subreddit.findFirstOrThrow({
        where: { name: submission.subreddit_id },
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
      let subreddit: SnoowrapSubreddit;
      try {
        //@ts-ignore
        subreddit = await submission.subreddit.fetch();
      } catch (e) {
        const msg = `unable to fetch subreddit '${submission.subreddit_id}': ${
          (e as Error).message
        }`;
        logger.error(msg);
        return Err(msg);
      }
      // user does not exists, attempt to create
      logger.info(
        `subreddit '${subreddit.name}' with id` +
          ` '${subreddit.id}' does not exist in the database, creating...`
      );
      const newSubredditResult = await this.upsertSnoowrapSubreddit(db, subreddit);
      if (!newSubredditResult.ok) {
        const msg =
          `unable to insert new subreddit '${subreddit.name}' with id` +
          ` '${subreddit.id}' into the database: ${newSubredditResult.val}`;
        logger.error(msg);
        // return with Err Result if there was a problem creating the user
        return Err(msg);
      }
      storedSubreddit = newSubredditResult.val;
    }
    // we need to link this submission to a user who inserted it, so we need
    // to find that user, or create and return that user so we have the ID to link to this post:
    let author: SnoowrapRedditUser;
    try {
      // @ts-ignore
      author = await submission.author.fetch();
    } catch (e) {
      const msg = `unable to fetch author for of post '${submission.id}': ${
        (e as Error).message
      }`;
      logger.error(msg);
      return Err(msg);
    }
    let storedRedditUser: RedditUser;
    try {
      // user already exists, get ID
      storedRedditUser = await db.redditUser.findFirstOrThrow({
        where: { id: author.id },
      });
      const usrScrapeTi = storedRedditUser.scrapeTime;
      logger.debug(
        `post author '${author.name}' with id` +
          ` '${author.id}' already exists in the database as of ${formatDistanceToNow(
            usrScrapeTi
          )} ago, time:${usrScrapeTi.getTime()}`
      );
    } catch (e) {
      // user does not exists, attempt to create
      logger.info(
        `user '${author.name}' with id` +
          ` '${author.id}' does not exist in the database, creating...`
      );
      const newUserResult = await this.upsertSnoowrapRedditor(db, author);
      if (!newUserResult.ok) {
        const msg =
          `unable to insert new reddit user '${author.name}' with id` +
          ` '${author.id}' into the database: ${newUserResult.val}`;
        logger.error(msg);
        // return with Err Result if there was a problem creating the user
        return Err(msg);
      }
      storedRedditUser = newUserResult.val;
    }

    let storedSubmission;
    if (!_exists) {
      try {
        logger.debug(`checking if database has RedditSubmission id '${submission.id}'`);
        // subreddit already exists, get ID
        storedSubmission = await db.redditSubmission.findFirstOrThrow({
          where: { id: submission.id },
        });
        const subredScrapTi = storedSubmission.scrapeTime;
        logger.debug(
          `RedditSubmission '${
            storedSubmission.id
          }' already exists in the database as of ${formatDistanceToNow(
            subredScrapTi
          )} ago, time:${subredScrapTi.getTime()}`
        );
      } catch (e) {
        // user does not exists, attempt to create
        logger.info(
          `RedditSubmission '${submission.id}' with id does not exist in the database, creating...`
        );
        const preCommitSubmission = {
          ...formattedSnoowrapSubmission,
          comments: {
            connect: [],
          },
          redditUserId: storedRedditUser.id,
          subredditId: storedSubreddit.name,
        };
        // We have a Subreddit, Redditor, and Comments all in our DB, let's now enter this submission:
        try {
          const redditSubmission = await db.redditSubmission.upsert({
            create: preCommitSubmission,
            update: preCommitSubmission,
            where: {
              id: formattedSnoowrapSubmission.id,
            },
          });
          storedSubmission = redditSubmission;
        } catch (e) {
          // something went wrong that we did not catch while trying to insert the submission
          const msg =
            `could not pre-insert submission '${submission.id}' by user ` +
            `'${storedRedditUser.id}' insto the database: ${(e as Error).message}`;
          logger.error(msg);
          return Err(msg);
        }
      }
    }

    // now that we are sure there is a Subreddit for this Submission the database, along with a RedditUser,
    // we can start inserting the comments since they have parents to link to
    // Upserting many comments means we need an array of objects where we have a field of type "id" specified
    // This "id" field will link the soon-to-be-inserted Comment's ID to this Submission
    // @ts-ignore
    logger.debug(
      `fetching all comments for post '${submission.id}' (max ${this.fetchMorePageSize})...`
    );
    let allComments: Comment[];
    try {
      allComments = await submission.comments
        .fetchMore({
          skip_replies: true,
          skipReplies: true,
          amount: this.fetchMorePageSize,
        })
        .slice(0, maxComments);
    } catch (e) {
      const msg = `unable to fetchMore comments for submission '${submission.id}': ${
        (e as Error).message
      }`;
      logger.error(msg);
      return Err(msg);
    }
    logger.debug(
      `received ${allComments.length} top-level comments for post '${submission.id}', attempting to insert...`
    );
    let toUpsertComments: RedditComment[] = [];
    let toUpsertChildren: any[] = [];
    for (let i = 0; i < allComments.length; i++) {
      const com = allComments[i];
      // this call is going to recurse on all of the Comment.replies, and once again call this.upsertRedditComment
      // for each one of its children
      const newCom = await this.upsertRedditComment(
        db,
        com,
        submission,
        storedSubreddit,
        replyTreeDepth
      );
      if (!newCom.ok) {
        const msg = `error inserting comment '${com.id}' into database on submission '${submission.id}': ${newCom.val}`;
        logger.error(msg);
        // return Err(msg);
      } else {
        const toPush = newCom.val.comment;
        if (toPush === null || toPush === undefined) {
          const msg = `unknown bug, toPush was marked as an "ok" result, but turned out null!`;
          logger.error(msg);
          continue;
        }
        toUpsertComments.push(toPush);
        toUpsertChildren.push(newCom.val.children);
      }
    }
    const updatedFormattedSubmission = {
      ...formattedSnoowrapSubmission,
      comments: {
        connect: toUpsertComments.map((com) => {
          return {
            id: com.id,
          };
        }),
      },
      redditUserId: storedRedditUser.id,
      subredditId: storedSubreddit.name,
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
      const ret: RedditDriverSubmission = {
        submission: redditSubmission,
        comments: toUpsertComments.map((com, i) => {
          return { ...com, children: toUpsertChildren[i] };
        }),
        author: storedRedditUser,
      };
      return Ok(ret);
    } catch (e) {
      // something went wrong that we did not catch while trying to insert the submission
      const msg =
        `could not insert submission '${submission.id}' by user ` +
        `'${storedRedditUser.id}' insto the database: ${(e as Error).message}`;
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
    logger.debug(`inserting Reddit user '${redditUser.id}' into the database`);
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
    submission: Submission,
    subreddit: Subreddit | string,
    replyTreeDepth = 1,
    recurseDepth = 0
  ): Promise<Result<RedditDriverComment, string>> {
    let replies: Listing<Comment>;
    try {
      replies = await comment.replies.fetchMore({
        skip_replies: true,
        skipReplies: true,
        amount: this.fetchMorePageSize,
      });
    } catch (e) {
      const msg = `unable to fetch replies for of comment '${comment.id}' on post '${
        submission.id
      }': ${(e as Error).message}`;
      logger.error(msg);
      return Err(msg);
    }

    const formattedComment = await formatSnoowrapRedditComment(comment, replies);
    logger.debug(
      `inserting comment '${comment.id}' from post '${submission.id}', comment parent_id is '${comment.parent_id}'`
    );
    let commentAuthor: SnoowrapRedditUser;
    try {
      // @ts-ignore
      commentAuthor = await comment.author.fetch();
    } catch (e) {
      const msg = `unable to fetch author for of post '${submission.id}': ${
        (e as Error).message
      }`;
      logger.error(msg);
      return Err(msg);
    }
    if (!formattedComment) {
      const msg =
        `could not format the scraped comment '${comment.id}' by user` +
        ` '${commentAuthor.name}', skipping...`;
      logger.error(msg);
      return Err(msg);
    }
    // we need to link this comment to a user who inserted it, so we need
    // to find that user, or create and return that user so we have the ID to link to this comment:
    let storedRedditUser: RedditUser;
    try {
      // user already exists, get ID
      storedRedditUser = await db.redditUser.findFirstOrThrow({
        where: { id: commentAuthor.id },
      });
      const usrScrapeTi = storedRedditUser.scrapeTime;
      logger.debug(
        `comment author '${commentAuthor.name}' with id` +
          ` '${
            storedRedditUser.id
          }' already exists in the database as of ${formatDistanceToNow(
            usrScrapeTi
          )} ago, time:${usrScrapeTi.getTime()}`
      );
    } catch (e) {
      // user does not exists, attempt to create
      const newUserResult = await this.upsertSnoowrapRedditor(db, commentAuthor);
      if (!newUserResult.ok) {
        const msg =
          `unable to insert new reddit user '${commentAuthor.name}' with id` +
          ` '${commentAuthor.id}' into the database: ${newUserResult.val}`;
        return Err(msg);
      }
      storedRedditUser = newUserResult.val;
    }
    // we need to link this comment to the original post as well
    let storedRedditPost;
    try {
      // user already exists, get ID
      storedRedditPost = await db.redditSubmission.findFirstOrThrow({
        where: { id: submission.id },
      });
      const postScrapeTi = storedRedditPost.scrapeTime;
      logger.debug(
        `comment parent submission '${
          submission.id
        }' already exists in the database as of ${formatDistanceToNow(
          postScrapeTi
        )} ago, time:${postScrapeTi.getTime()}`
      );
    } catch (e) {
      // post does not exists, attempt to create
      const newRedditSubmission = await this.upsertSnoowrapSubmission(db, submission);
      if (!newRedditSubmission.ok) {
        const msg =
          `unable to insert new reddit submission '${storedRedditUser.name}' with id` +
          ` '${storedRedditUser.id}' into the database: ${newRedditSubmission.val}`;
        return Err(msg);
      }
      storedRedditPost = newRedditSubmission.val.submission;
    }
    let storedSubreddit: Subreddit;
    if (typeof subreddit === "string") {
      try {
        // Subreddit already exists, get ID
        storedSubreddit = await db.subreddit.findFirstOrThrow({
          where: { name: subreddit },
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
          ` by user '${storedRedditUser.id}', subreddit id '${subreddit}' does not exist in the database yet!`;
        return Err(msg);
      }
    } else {
      storedSubreddit = subreddit;
    }
    logger.info(`comment was made on subreddit '${storedSubreddit.name}'`);
    // pre-insert, so that children can ref-back to the parent:
    const preInsertComment = {
      ...formattedComment,
      author: {
        connect: {
          id: storedRedditUser.id,
        },
      },
      subreddit: {
        connect: {
          name: storedSubreddit.name,
        },
      },
      RedditSubmission: {
        connect: {
          id: storedRedditPost.id,
        },
      },
      children: {
        connect: [], // insert the root comment, which at this time has no children rendered out yet
      },
    };
    try {
      const preInsertCommentDB = await db.redditComment.upsert({
        create: preInsertComment,
        update: preInsertComment,
        where: { id: preInsertComment.id },
      });
      logger.debug(`primed and pre-inserted comment '${preInsertCommentDB.id}'`);
    } catch (error: unknown) {
      const err = error as Error;
      return Err(
        `could not preInsertCommentDB for comment ${preInsertComment.id}: ${err.message}`
      );
    }

    // recursively upsert all the children comments to this comment;
    const newCommentDBRes =
      replyTreeDepth > 0
        ? await Promise.all(
            replies.map(async (com) => {
              com.parent_id = comment.id;
              return await this.upsertRedditComment(
                db,
                com,
                submission,
                storedSubreddit,
                replyTreeDepth - 1,
                recurseDepth + 1
              );
            })
          )
        : [];
    if (newCommentDBRes.map((ret) => ret.ok).indexOf(false) > 0) {
      const msg = `could not recursively insert new comments...`;
      logger.error(msg);
      return Err(msg);
    }
    const newCommentDBs = newCommentDBRes
      .map((ret, i) => {
        let newCom;
        try {
          newCom = ret.unwrap().comment;
          return newCom;
        } catch (e) {
          const msg = `was not able to insert comment '${replies[i].id}' into database: ${
            (e as Error).message
          }`;
          logger.error(msg);
          return undefined;
        }
      })
      .filter((el) => {
        return el !== undefined;
      }) as RedditComment[];
    const newCommentDBIds = newCommentDBs.map((com) => com.id);
    if (recurseDepth === 0) {
      logger.info(
        `updating root-level comment '${comment.id}' with ${newCommentDBIds.length} linked replies`
      );
    }
    let updatedFormattedComment =
      recurseDepth > 0
        ? {
            ...formattedComment,
            parent: {
              connect: {
                id: comment.parent_id,
              },
            },
            author: {
              connect: {
                id: storedRedditUser.id,
              },
            },
            subreddit: {
              connect: {
                name: storedSubreddit.name,
              },
            },
            children: {
              connect: newCommentDBIds.map((id) => {
                return { id };
              }),
            },
            RedditSubmission: {
              connect: {
                id: storedRedditPost.id,
              },
            },
          }
        : {
            ...formattedComment,
            author: {
              connect: {
                id: storedRedditUser.id,
              },
            },
            subreddit: {
              connect: {
                name: storedSubreddit.name,
              },
            },
            children: {
              connect: newCommentDBIds.map((id) => {
                return { id };
              }),
            },
            RedditSubmission: {
              connect: {
                id: storedRedditPost.id,
              },
            },
          };
    try {
      const insertedComment = await db.redditComment.upsert({
        create: updatedFormattedComment,
        update: updatedFormattedComment,
        where: { id: updatedFormattedComment.id },
      });
      return Ok({
        comment: insertedComment,
        children: newCommentDBRes.map((com) => {
          if (com.ok) {
            const comval = com.val;
            return {
              comment: comval.comment,
              children: comval.children,
            };
          } else {
            return {
              comment: null,
              children: [],
            };
          }
        }),
      });
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
          name: formattedSnoowrapSubreddit.name,
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
        ` '${formattedSnoowrapSubreddit.id}': ${err.message}`;
      logger.error(msg);
      return Err(msg);
    }
  }

  flattenCommentTree = async (
    comment: Comment,
    replyTreeDepth = 0
  ): Promise<Comment[]> => {
    if (replyTreeDepth === 0) return [];
    // @ts-ignore
    const replies = await comment.replies.fetchMore({
      skip_replies: true,
      skipReplies: true,
      amount: this.fetchMorePageSize,
    });
    return (
      await Promise.all(
        replies.map(async (com) => {
          // @ts-ignore
          const comReps = await com.replies.fetchMore({
            skip_replies: true,
            skipReplies: true,
            amount: this.fetchMorePageSize,
          });
          const reps = (
            await Promise.all(
              comReps.map(
                async (r) => await this.flattenCommentTree(r, replyTreeDepth - 1)
              )
            )
          ).flat();
          return [com, ...reps];
        })
      )
    ).flat();
  };
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
    name: redditUser.name,
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
 * @param replyTreeDepth - How deep into the tree of comment replies the wrapper should seek
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

export const formatSnoowrapRedditComment = async (
  comment: Comment,
  replies: Comment[]
) => {
  const commentReplyIds = replies.map((r) => r.id);
  // let commentReplies: Comment[];
  // try {
  //   commentReplies = await flattenCommentTree(comment, 1);
  // } catch (e) {
  //   const msg =
  //     `tried to flattenCommentTree for comment '${comment.id}' with ${comment.replies.length}` +
  //     ` replies, but failed: ${(e as Error).message}`;
  //   logger.error(msg);
  //   return undefined;
  // }
  // try {
  //   commentReplyIds = comment.replies
  //     .map((com) => commentReplies.map((c) => c.id))
  //     .flat();
  // } catch (e) {
  //   const msg =
  //     `tried to map and flatted comment reply IDs for comment '${comment.id}' ` +
  //     `with ${comment.replies.length} replies, but failed: ${(e as Error).message}`;
  //   logger.error(msg);
  //   return undefined;
  // }
  if (!comment.id) {
    const msg =
      `tried to store comment comment '${comment.id}' at '${comment.link_id}'` +
      `but this comment had no id!`;
    logger.error(msg);
    return undefined;
  }
  const formatted = {
    id: comment.id,
    scrapeTime: new Date(),
    approved: comment.approved,
    body: comment.body,
    collapsed_reason: comment.collapsed_reason,
    collapsed: comment.collapsed,
    controversiality: comment.controversiality,
    depth: comment.depth,
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
    num_reports: comment.num_reports ?? undefined,
    permalink: comment.permalink,
    replyIds: commentReplyIds ?? [],
    report_reasons: comment.report_reasons ?? undefined,
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

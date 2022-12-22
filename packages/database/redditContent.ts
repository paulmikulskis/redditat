import { ContentGenerationTask, PrismaClient, Resources } from "@prisma/client";
import { Ok, Err, Result } from "ts-results";
import { Media, TaskStatus } from "./types";
import { subHours } from "date-fns";

/**
 * Create a new ContentGenerationTask in the database.
 *
 * @param submissionId - The submission ID of the Reddit post.
 * @param subredditUrl - The subreddit URL of the Reddit post.
 * @param resources - The resources required to generate content for the Reddit post.
 * @param program - The content generation program that this task pertains to, default is "AI_DALL-E_REDDIT_READER"
 *
 * @returns Ok(ContentGenerationTask) if the ContentGenerationTask was created successfully,
 * Err(string) with an error message if there was a problem creating the ContentGenerationTask.
 */
export class RedditContent {
  constructor(private db: PrismaClient) {}

  async createContentGenerationRequest(
    submissionId: string,
    subredditUrl: string,
    resources: Media[],
    program: string = "AI_DALL-E_REDDIT_READER"
  ): Promise<Result<ContentGenerationTask, string>> {
    try {
      // Create a new ContentGenerationTask in the database
      const createdContentGenerationTask = await this.db.contentGenerationTask.create({
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
   * Err(string) with an error message if there was a problem updating the ContentGenerationTask.
   */
  async updateContentRequestStatus(id: string, status: TaskStatus): Promise<Result<ContentGenerationTask, string>> {
    try {
      // Update the status of the ContentGenerationTask in the database
      const updatedContentGenerationTask = await this.db.contentGenerationTask.update({
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
   * Err(string) with an error message if there was a problem retrieving the ContentGenerationTask entries.
   */
  async getAllContentRequestsWithin(
    db: PrismaClient,
    range: number = 24 * 365 * 20,
    userId?: string
  ): Promise<Result<ContentGenerationTask[], string>> {
    try {
      // Query the database for ContentGenerationTask entries
      const now = new Date();
      const rangeInPast = subHours(now, range);
      let contentGenerationTasks: ContentGenerationTask[];
      if (userId) {
        contentGenerationTasks = await db.contentGenerationTask.findMany({
          where: {
            startTime: {
              gte: rangeInPast,
            },
            user: userId,
          },
        });
      } else {
        contentGenerationTasks = await db.contentGenerationTask.findMany({
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
}

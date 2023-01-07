/*
  Warnings:

  - You are about to drop the column `approved_at_utc` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `banned_at_utc` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `edited` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `subreddit_id` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `subreddit_name_prefixed` on the `RedditComment` table. All the data in the column will be lost.
  - You are about to drop the column `subreddit_type` on the `RedditComment` table. All the data in the column will be lost.
  - Added the required column `redditUserId` to the `RedditComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reddit_submission_id` to the `RedditComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RedditComment" DROP COLUMN "approved_at_utc",
DROP COLUMN "author",
DROP COLUMN "banned_at_utc",
DROP COLUMN "edited",
DROP COLUMN "likes",
DROP COLUMN "subreddit_id",
DROP COLUMN "subreddit_name_prefixed",
DROP COLUMN "subreddit_type",
ADD COLUMN     "redditUserId" TEXT NOT NULL,
ADD COLUMN     "reddit_submission_id" INTEGER NOT NULL,
ALTER COLUMN "approved" SET DEFAULT false,
ALTER COLUMN "collapsed_reason" DROP NOT NULL,
ALTER COLUMN "collapsed" SET DEFAULT false,
ALTER COLUMN "controversiality" DROP NOT NULL,
ALTER COLUMN "depth" DROP NOT NULL,
ALTER COLUMN "ignore_reports" SET DEFAULT false,
ALTER COLUMN "is_submitter" SET DEFAULT false,
ALTER COLUMN "link_id" DROP NOT NULL,
ALTER COLUMN "parent_id" DROP NOT NULL,
ALTER COLUMN "removed" SET DEFAULT false,
ALTER COLUMN "score_hidden" SET DEFAULT false,
ALTER COLUMN "spam" SET DEFAULT false,
ALTER COLUMN "archived" SET DEFAULT false,
ALTER COLUMN "author_flair_background_color" DROP NOT NULL,
ALTER COLUMN "author_flair_css_class" DROP NOT NULL,
ALTER COLUMN "author_flair_template_id" DROP NOT NULL,
ALTER COLUMN "author_flair_text" DROP NOT NULL,
ALTER COLUMN "author_flair_text_color" DROP NOT NULL,
ALTER COLUMN "author_flair_type" DROP NOT NULL,
ALTER COLUMN "author_fullname" DROP NOT NULL,
ALTER COLUMN "author_patreon_flair" SET DEFAULT false,
ALTER COLUMN "can_gild" SET DEFAULT false,
ALTER COLUMN "can_mod_post" SET DEFAULT true,
ALTER COLUMN "distinguished" DROP NOT NULL,
ALTER COLUMN "mod_note" DROP NOT NULL,
ALTER COLUMN "mod_reason_by" DROP NOT NULL,
ALTER COLUMN "mod_reason_title" DROP NOT NULL,
ALTER COLUMN "mod_reports" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "no_follow" SET DEFAULT false,
ALTER COLUMN "num_reports" SET DEFAULT 0,
ALTER COLUMN "saved" SET DEFAULT false,
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "send_replies" SET DEFAULT false,
ALTER COLUMN "stickied" SET DEFAULT false;

-- AlterTable
ALTER TABLE "RedditUser" ALTER COLUMN "coins" SET DEFAULT 0,
ALTER COLUMN "comment_karma" SET DEFAULT 0,
ALTER COLUMN "force_password_reset" SET DEFAULT false,
ALTER COLUMN "has_android_subscription" SET DEFAULT false,
ALTER COLUMN "has_external_account" SET DEFAULT false,
ALTER COLUMN "has_ios_subscription" SET DEFAULT false,
ALTER COLUMN "has_mail" SET DEFAULT false,
ALTER COLUMN "has_mod_mail" SET DEFAULT false,
ALTER COLUMN "has_paypal_subscription" SET DEFAULT false,
ALTER COLUMN "has_stripe_subscription" SET DEFAULT false,
ALTER COLUMN "has_subscribed" SET DEFAULT false,
ALTER COLUMN "has_subscribed_to_premium" SET DEFAULT false,
ALTER COLUMN "has_verified_mail" SET DEFAULT false,
ALTER COLUMN "has_visited_new_profile" SET DEFAULT false,
ALTER COLUMN "hide_from_robots" SET DEFAULT false,
ALTER COLUMN "in_beta" SET DEFAULT false,
ALTER COLUMN "in_chat" SET DEFAULT false,
ALTER COLUMN "in_redesign_beta" SET DEFAULT false,
ALTER COLUMN "inbox_count" SET DEFAULT 0,
ALTER COLUMN "is_employee" SET DEFAULT false,
ALTER COLUMN "is_friend" SET DEFAULT false,
ALTER COLUMN "is_gold" SET DEFAULT false,
ALTER COLUMN "is_mod" SET DEFAULT false,
ALTER COLUMN "is_sponsor" SET DEFAULT false,
ALTER COLUMN "is_suspended" SET DEFAULT false;

-- CreateTable
CREATE TABLE "RedditSubmission" (
    "archived" BOOLEAN,
    "id" SERIAL NOT NULL,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "content_categories" TEXT,
    "contest_mode" BOOLEAN NOT NULL DEFAULT false,
    "domain" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "hide_score" BOOLEAN NOT NULL DEFAULT false,
    "is_crosspostable" BOOLEAN NOT NULL DEFAULT false,
    "is_meta" BOOLEAN NOT NULL DEFAULT false,
    "is_original_content" BOOLEAN NOT NULL DEFAULT false,
    "is_reddit_media_domain" BOOLEAN NOT NULL DEFAULT false,
    "is_robot_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_self" BOOLEAN NOT NULL DEFAULT false,
    "is_video" BOOLEAN NOT NULL DEFAULT false,
    "link_flair_background_color" TEXT,
    "link_flair_css_class" TEXT,
    "link_flair_richtext" JSONB,
    "link_flair_template_id" TEXT,
    "link_flair_text" TEXT,
    "link_flair_text_color" TEXT,
    "link_flair_type" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "media" JSONB,
    "media_embed" JSONB,
    "media_only" BOOLEAN NOT NULL DEFAULT false,
    "num_comments" INTEGER NOT NULL DEFAULT 0,
    "num_crossposts" INTEGER NOT NULL DEFAULT 0,
    "over_18" BOOLEAN NOT NULL DEFAULT false,
    "parent_whitelist_status" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "previous_visits" INTEGER[],
    "post_hint" TEXT,
    "preview" JSONB,
    "removal_reason" TEXT,
    "removed_by_category" TEXT,
    "selftext" TEXT,
    "selftext_html" TEXT,
    "spam" BOOLEAN NOT NULL DEFAULT false,
    "spoiler" BOOLEAN NOT NULL DEFAULT false,
    "subreddit_subscribers" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT,
    "thumbnail_height" INTEGER,
    "thumbnail_width" INTEGER,
    "title" TEXT NOT NULL,
    "upvote_ratio" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "view_count" INTEGER DEFAULT 0,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "whitelist_status" TEXT,
    "redditUserId" TEXT NOT NULL,
    "ups" INTEGER NOT NULL DEFAULT 0,
    "downs" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RedditSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_redditUserId_fkey" FOREIGN KEY ("redditUserId") REFERENCES "RedditUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_reddit_submission_id_fkey" FOREIGN KEY ("reddit_submission_id") REFERENCES "RedditSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditSubmission" ADD CONSTRAINT "RedditSubmission_redditUserId_fkey" FOREIGN KEY ("redditUserId") REFERENCES "RedditUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "RedditTaskStatus" AS ENUM ('IN_PROGRESS', 'SUCCESS', 'ERROR', 'CREATED');

-- CreateTable
CREATE TABLE "RedditComment" (
    "id" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "body_html" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "collapsed_reason" TEXT NOT NULL,
    "collapsed" BOOLEAN NOT NULL,
    "controversiality" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "ignore_reports" BOOLEAN NOT NULL,
    "is_submitter" BOOLEAN NOT NULL,
    "link_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "removed" BOOLEAN NOT NULL,
    "score_hidden" BOOLEAN NOT NULL,
    "spam" BOOLEAN NOT NULL,
    "approved_at_utc" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "author" TEXT NOT NULL,
    "author_flair_background_color" TEXT NOT NULL,
    "author_flair_css_class" TEXT NOT NULL,
    "author_flair_template_id" TEXT NOT NULL,
    "author_flair_text" TEXT NOT NULL,
    "author_flair_text_color" TEXT NOT NULL,
    "author_flair_type" TEXT NOT NULL,
    "author_fullname" TEXT NOT NULL,
    "author_patreon_flair" BOOLEAN NOT NULL,
    "banned_at_utc" INTEGER NOT NULL,
    "can_gild" BOOLEAN NOT NULL,
    "can_mod_post" BOOLEAN NOT NULL,
    "distinguished" TEXT NOT NULL,
    "downs" INTEGER NOT NULL,
    "edited" DOUBLE PRECISION NOT NULL,
    "gilded" INTEGER NOT NULL,
    "likes" BOOLEAN NOT NULL,
    "mod_note" TEXT NOT NULL,
    "mod_reason_by" TEXT NOT NULL,
    "mod_reason_title" TEXT NOT NULL,
    "mod_reports" TEXT[],
    "no_follow" BOOLEAN NOT NULL,
    "num_reports" INTEGER NOT NULL,
    "permalink" TEXT NOT NULL,
    "replyIds" TEXT[],
    "report_reasons" TEXT[],
    "subredditUrl" TEXT NOT NULL,
    "subreddit_id" TEXT NOT NULL,
    "subreddit_name_prefixed" TEXT NOT NULL,
    "subreddit_type" TEXT NOT NULL,
    "saved" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "send_replies" BOOLEAN NOT NULL,
    "stickied" BOOLEAN NOT NULL,
    "ups" INTEGER NOT NULL,
    "user_reports" TEXT[],
    "commentId" TEXT,

    CONSTRAINT "RedditComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditUser" (
    "id" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "comment_karma" INTEGER NOT NULL,
    "force_password_reset" BOOLEAN NOT NULL,
    "gold_creddits" INTEGER NOT NULL,
    "gold_expiration" TIMESTAMP(3) NOT NULL,
    "has_android_subscription" BOOLEAN NOT NULL,
    "has_external_account" BOOLEAN NOT NULL,
    "has_ios_subscription" BOOLEAN NOT NULL,
    "has_mail" BOOLEAN NOT NULL,
    "has_mod_mail" BOOLEAN NOT NULL,
    "has_paypal_subscription" BOOLEAN NOT NULL,
    "has_stripe_subscription" BOOLEAN NOT NULL,
    "has_subscribed" BOOLEAN NOT NULL,
    "has_subscribed_to_premium" BOOLEAN NOT NULL,
    "has_verified_mail" BOOLEAN NOT NULL,
    "has_visited_new_profile" BOOLEAN NOT NULL,
    "hide_from_robots" BOOLEAN NOT NULL,
    "icon_img" TEXT NOT NULL,
    "in_beta" BOOLEAN NOT NULL,
    "in_chat" BOOLEAN NOT NULL,
    "in_redesign_beta" BOOLEAN NOT NULL,
    "inbox_count" INTEGER NOT NULL,
    "is_employee" BOOLEAN NOT NULL,
    "is_friend" BOOLEAN NOT NULL,
    "is_gold" BOOLEAN NOT NULL,
    "is_mod" BOOLEAN NOT NULL,
    "is_sponsor" BOOLEAN NOT NULL,
    "is_suspended" BOOLEAN NOT NULL,
    "link_karma" INTEGER NOT NULL,

    CONSTRAINT "RedditUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subreddit" (
    "url" TEXT NOT NULL,
    "accounts_active_is_fuzzed" BOOLEAN NOT NULL,
    "accounts_active" INTEGER NOT NULL,
    "active_user_count" INTEGER NOT NULL,
    "advertiser_category" TEXT NOT NULL,
    "all_original_content" BOOLEAN NOT NULL,
    "allow_discovery" BOOLEAN NOT NULL,
    "allow_images" BOOLEAN NOT NULL,
    "allow_videogifs" BOOLEAN NOT NULL,
    "allow_videos" BOOLEAN NOT NULL,
    "banner_background_color" TEXT NOT NULL,
    "banner_background_image" TEXT NOT NULL,
    "banner_img" TEXT NOT NULL,
    "banner_size" INTEGER[],
    "can_assign_link_flair" BOOLEAN NOT NULL,
    "can_assign_user_flair" BOOLEAN NOT NULL,
    "collapse_deleted_comments" BOOLEAN NOT NULL,
    "comment_score_hide_mins" INTEGER NOT NULL,
    "community_icon" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "created_utc" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "description_html" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "display_name_prefixed" TEXT NOT NULL,
    "emojis_custom_size" INTEGER[],
    "emojis_enabled" BOOLEAN NOT NULL,
    "has_menu_widget" BOOLEAN NOT NULL,
    "header_img" TEXT NOT NULL,
    "header_size" INTEGER[],
    "header_title" TEXT NOT NULL,
    "hide_ads" BOOLEAN NOT NULL,
    "id" TEXT NOT NULL,
    "icon_img" TEXT NOT NULL,
    "icon_size" INTEGER[],
    "is_enrolled_in_new_modmail" BOOLEAN NOT NULL,
    "key_color" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "link_flair_enabled" BOOLEAN NOT NULL,
    "link_flair_position" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notification_level" TEXT NOT NULL,
    "over18" BOOLEAN NOT NULL,
    "primary_color" TEXT NOT NULL,
    "public_description" TEXT NOT NULL,
    "public_description_html" TEXT NOT NULL,
    "public_traffic" BOOLEAN NOT NULL,
    "quarantine" BOOLEAN NOT NULL,
    "show_media" BOOLEAN NOT NULL,
    "show_media_preview" BOOLEAN NOT NULL,
    "spoilers_enabled" BOOLEAN NOT NULL,
    "submission_type" TEXT NOT NULL,
    "submit_link_label" TEXT NOT NULL,
    "submit_text" TEXT NOT NULL,
    "submit_text_html" TEXT NOT NULL,
    "submit_text_label" TEXT NOT NULL,
    "subreddit_type" TEXT NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "suggested_comment_sort" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "user_can_flair_in_sr" BOOLEAN NOT NULL,
    "user_flair_background_color" TEXT NOT NULL,
    "user_flair_css_class" TEXT NOT NULL,
    "user_flair_enabled_in_sr" BOOLEAN NOT NULL,
    "user_flair_position" TEXT NOT NULL,
    "user_flair_template_id" TEXT NOT NULL,
    "user_flair_text" TEXT NOT NULL,
    "user_flair_text_color" TEXT NOT NULL,
    "user_has_favorited" BOOLEAN NOT NULL,
    "user_is_banned" BOOLEAN NOT NULL,
    "user_is_contributor" BOOLEAN NOT NULL,
    "user_is_moderator" BOOLEAN NOT NULL,
    "user_is_muted" BOOLEAN NOT NULL,
    "user_is_subscriber" BOOLEAN NOT NULL,
    "user_sr_flair_enabled" BOOLEAN NOT NULL,
    "user_sr_theme_enabled" BOOLEAN NOT NULL,
    "whitelist_status" TEXT NOT NULL,
    "wiki_enabled" BOOLEAN NOT NULL,
    "wls" INTEGER NOT NULL,

    CONSTRAINT "Subreddit_pkey" PRIMARY KEY ("url")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT 'defaultUser',
    "status" TEXT NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditContentGenerationTask" (
    "id" SERIAL NOT NULL,
    "status" "RedditTaskStatus" NOT NULL DEFAULT 'CREATED',
    "submissionId" TEXT NOT NULL,
    "subredditUrl" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "errorMessage" TEXT,
    "errorStackTrace" TEXT,
    "program" TEXT NOT NULL,
    "user" TEXT NOT NULL DEFAULT 'defaultUser',

    CONSTRAINT "RedditContentGenerationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditResources" (
    "id" SERIAL NOT NULL,
    "videoUri" TEXT,
    "script" TEXT,

    CONSTRAINT "RedditResources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditGenerationMedia" (
    "uri" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'bytes',
    "sizeBytes" DECIMAL(65,30) NOT NULL DEFAULT -1,
    "resourcesId" TEXT,

    CONSTRAINT "RedditGenerationMedia_pkey" PRIMARY KEY ("uri")
);

-- CreateTable
CREATE TABLE "RedditVideo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uri" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "RedditVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditVideoMetadata" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "videoId" INTEGER,

    CONSTRAINT "RedditVideoMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RedditContentGenerationTaskToRedditResources" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RedditGenerationMediaToRedditResources" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RedditComment_id_key" ON "RedditComment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subreddit_url_key" ON "Subreddit"("url");

-- CreateIndex
CREATE INDEX "audit_logs_uuid_idx" ON "audit_logs"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RedditContentGenerationTask_submissionId_key" ON "RedditContentGenerationTask"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "_RedditContentGenerationTaskToRedditResources_AB_unique" ON "_RedditContentGenerationTaskToRedditResources"("A", "B");

-- CreateIndex
CREATE INDEX "_RedditContentGenerationTaskToRedditResources_B_index" ON "_RedditContentGenerationTaskToRedditResources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RedditGenerationMediaToRedditResources_AB_unique" ON "_RedditGenerationMediaToRedditResources"("A", "B");

-- CreateIndex
CREATE INDEX "_RedditGenerationMediaToRedditResources_B_index" ON "_RedditGenerationMediaToRedditResources"("B");

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_subredditUrl_fkey" FOREIGN KEY ("subredditUrl") REFERENCES "Subreddit"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditContentGenerationTask" ADD CONSTRAINT "RedditContentGenerationTask_subredditUrl_fkey" FOREIGN KEY ("subredditUrl") REFERENCES "Subreddit"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditVideoMetadata" ADD CONSTRAINT "RedditVideoMetadata_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "RedditVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditContentGenerationTaskToRedditResources" ADD CONSTRAINT "_RedditContentGenerationTaskToRedditResources_A_fkey" FOREIGN KEY ("A") REFERENCES "RedditContentGenerationTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditContentGenerationTaskToRedditResources" ADD CONSTRAINT "_RedditContentGenerationTaskToRedditResources_B_fkey" FOREIGN KEY ("B") REFERENCES "RedditResources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditGenerationMediaToRedditResources" ADD CONSTRAINT "_RedditGenerationMediaToRedditResources_A_fkey" FOREIGN KEY ("A") REFERENCES "RedditGenerationMedia"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditGenerationMediaToRedditResources" ADD CONSTRAINT "_RedditGenerationMediaToRedditResources_B_fkey" FOREIGN KEY ("B") REFERENCES "RedditResources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

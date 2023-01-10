-- CreateEnum
CREATE TYPE "RedditTaskStatus" AS ENUM ('IN_PROGRESS', 'SUCCESS', 'ERROR', 'CREATED');

-- CreateTable
CREATE TABLE "RedditComment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "ups" INTEGER NOT NULL,
    "downs" INTEGER NOT NULL,
    "scrapeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "depth" INTEGER,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "collapsed_reason" TEXT,
    "collapsed" BOOLEAN NOT NULL DEFAULT false,
    "controversiality" INTEGER,
    "ignore_reports" BOOLEAN NOT NULL DEFAULT false,
    "link_id" TEXT,
    "parent_id" TEXT,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "score_hidden" BOOLEAN NOT NULL DEFAULT false,
    "spam" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "is_submitter" BOOLEAN NOT NULL DEFAULT false,
    "can_gild" BOOLEAN NOT NULL DEFAULT false,
    "can_mod_post" BOOLEAN NOT NULL DEFAULT true,
    "distinguished" TEXT,
    "gilded" INTEGER NOT NULL,
    "mod_note" TEXT,
    "mod_reason_by" TEXT,
    "mod_reason_title" TEXT,
    "mod_reports" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "no_follow" BOOLEAN NOT NULL DEFAULT false,
    "num_reports" INTEGER NOT NULL DEFAULT 0,
    "permalink" TEXT NOT NULL,
    "replyIds" TEXT[],
    "report_reasons" TEXT[],
    "subredditId" TEXT NOT NULL,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "send_replies" BOOLEAN NOT NULL DEFAULT false,
    "stickied" BOOLEAN NOT NULL DEFAULT false,
    "user_reports" TEXT[],
    "commentId" TEXT,
    "redditUserId" TEXT NOT NULL,
    "parentId" TEXT,
    "redditSubmissionId" TEXT,
    "childrenIds" TEXT,

    CONSTRAINT "RedditComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scrapeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "comment_karma" INTEGER NOT NULL DEFAULT 0,
    "force_password_reset" BOOLEAN NOT NULL DEFAULT false,
    "gold_creddits" INTEGER NOT NULL,
    "gold_expiration" TIMESTAMP(3),
    "has_android_subscription" BOOLEAN NOT NULL DEFAULT false,
    "has_external_account" BOOLEAN NOT NULL DEFAULT false,
    "has_ios_subscription" BOOLEAN NOT NULL DEFAULT false,
    "has_mail" BOOLEAN NOT NULL DEFAULT false,
    "has_mod_mail" BOOLEAN NOT NULL DEFAULT false,
    "has_paypal_subscription" BOOLEAN NOT NULL DEFAULT false,
    "has_stripe_subscription" BOOLEAN NOT NULL DEFAULT false,
    "has_subscribed" BOOLEAN NOT NULL DEFAULT false,
    "has_subscribed_to_premium" BOOLEAN NOT NULL DEFAULT false,
    "has_verified_mail" BOOLEAN NOT NULL DEFAULT false,
    "has_visited_new_profile" BOOLEAN NOT NULL DEFAULT false,
    "hide_from_robots" BOOLEAN NOT NULL DEFAULT false,
    "icon_img" TEXT NOT NULL,
    "in_beta" BOOLEAN NOT NULL DEFAULT false,
    "in_chat" BOOLEAN NOT NULL DEFAULT false,
    "in_redesign_beta" BOOLEAN NOT NULL DEFAULT false,
    "inbox_count" INTEGER NOT NULL DEFAULT 0,
    "is_employee" BOOLEAN NOT NULL DEFAULT false,
    "is_friend" BOOLEAN NOT NULL DEFAULT false,
    "is_gold" BOOLEAN NOT NULL DEFAULT false,
    "is_mod" BOOLEAN NOT NULL DEFAULT false,
    "is_sponsor" BOOLEAN NOT NULL DEFAULT false,
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "link_karma" INTEGER NOT NULL,

    CONSTRAINT "RedditUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subreddit" (
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "over18" BOOLEAN NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "scrapeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accounts_active" INTEGER NOT NULL,
    "created" INTEGER,
    "primary_color" TEXT,
    "active_user_count" INTEGER NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "advertiser_category" TEXT,
    "all_original_content" BOOLEAN,
    "allow_discovery" BOOLEAN,
    "allow_images" BOOLEAN,
    "allow_videogifs" BOOLEAN,
    "allow_videos" BOOLEAN,
    "banner_background_color" TEXT,
    "banner_background_image" TEXT,
    "banner_img" TEXT,
    "banner_size" INTEGER[],
    "can_assign_link_flair" BOOLEAN,
    "can_assign_user_flair" BOOLEAN,
    "collapse_deleted_comments" BOOLEAN,
    "comment_score_hide_mins" INTEGER,
    "community_icon" TEXT,
    "accounts_active_is_fuzzed" BOOLEAN NOT NULL,
    "created_utc" INTEGER,
    "description_html" TEXT,
    "display_name" TEXT,
    "display_name_prefixed" TEXT,
    "emojis_custom_size" INTEGER[],
    "emojis_enabled" BOOLEAN,
    "has_menu_widget" BOOLEAN,
    "header_img" TEXT,
    "header_size" INTEGER[],
    "header_title" TEXT,
    "hide_ads" BOOLEAN,
    "icon_img" TEXT,
    "icon_size" INTEGER[],
    "is_enrolled_in_new_modmail" BOOLEAN,
    "key_color" TEXT,
    "lang" TEXT,
    "link_flair_enabled" BOOLEAN NOT NULL,
    "link_flair_position" TEXT,
    "notification_level" TEXT,
    "public_description" TEXT,
    "public_description_html" TEXT,
    "public_traffic" BOOLEAN,
    "quarantine" BOOLEAN,
    "show_media" BOOLEAN,
    "show_media_preview" BOOLEAN,
    "spoilers_enabled" BOOLEAN,
    "submission_type" TEXT,
    "submit_link_label" TEXT,
    "submit_text" TEXT,
    "submit_text_html" TEXT,
    "submit_text_label" TEXT,
    "subreddit_type" TEXT NOT NULL,
    "suggested_comment_sort" TEXT,
    "user_can_flair_in_sr" BOOLEAN,
    "user_flair_background_color" TEXT,
    "user_flair_css_class" TEXT,
    "user_flair_enabled_in_sr" BOOLEAN,
    "user_flair_position" TEXT,
    "user_flair_template_id" TEXT,
    "user_flair_text" TEXT,
    "user_flair_text_color" TEXT,
    "user_has_favorited" BOOLEAN,
    "user_is_banned" BOOLEAN,
    "user_is_contributor" BOOLEAN,
    "user_is_moderator" BOOLEAN,
    "user_is_muted" BOOLEAN,
    "user_is_subscriber" BOOLEAN,
    "user_sr_flair_enabled" BOOLEAN,
    "user_sr_theme_enabled" BOOLEAN,
    "whitelist_status" TEXT,
    "wiki_enabled" BOOLEAN,
    "wls" INTEGER,
    "id" TEXT NOT NULL,

    CONSTRAINT "Subreddit_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "RedditSubmission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ups" INTEGER NOT NULL DEFAULT 0,
    "downs" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "scrapeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "over_18" BOOLEAN NOT NULL DEFAULT false,
    "upvote_ratio" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "content_categories" TEXT[],
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
    "subredditId" TEXT NOT NULL,
    "archived" BOOLEAN,
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
    "parent_whitelist_status" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "previous_visits" INTEGER[],
    "post_hint" TEXT,
    "preview" JSONB,
    "removal_reason" TEXT,
    "removed_by_category" TEXT,
    "selftext" TEXT,
    "spam" BOOLEAN NOT NULL DEFAULT false,
    "spoiler" BOOLEAN NOT NULL DEFAULT false,
    "subreddit_subscribers" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT,
    "thumbnail_height" INTEGER,
    "thumbnail_width" INTEGER,
    "url" TEXT NOT NULL,
    "view_count" INTEGER DEFAULT 0,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "whitelist_status" TEXT,
    "redditUserId" TEXT NOT NULL,

    CONSTRAINT "RedditSubmission_pkey" PRIMARY KEY ("id")
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
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "errorMessage" TEXT,
    "errorStackTrace" TEXT,
    "subredditId" TEXT NOT NULL,
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
CREATE TABLE "TweetyTweet" (
    "id" TEXT NOT NULL,
    "scrapeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "card" JSONB,
    "created_on" TEXT NOT NULL,
    "hashtags" TEXT[],
    "quoted_tweet" JSONB,
    "is_possibly_sensitive" BOOLEAN NOT NULL,
    "is_quoted" BOOLEAN NOT NULL,
    "is_reply" BOOLEAN NOT NULL,
    "is_retweet" BOOLEAN NOT NULL,
    "language" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "media" JSONB[],
    "place" JSONB NOT NULL,
    "quote_counts" INTEGER NOT NULL,
    "reply_counts" INTEGER NOT NULL,
    "reply_to" TEXT,
    "retweet_counts" INTEGER NOT NULL,
    "source" TEXT,
    "symbols" JSONB[],
    "text" TEXT NOT NULL,
    "threads" JSONB[],
    "tweet_body" TEXT,
    "urls" JSONB[],
    "user_mentions" TEXT[],
    "vibe" TEXT,
    "tweetyTweetId" TEXT,

    CONSTRAINT "TweetyTweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwitterUser" (
    "id" TEXT NOT NULL,
    "scrapeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_on" TEXT,
    "default_profile" BOOLEAN,
    "default_profile_image" BOOLEAN,
    "description" TEXT NOT NULL,
    "fast_followers_count" INTEGER NOT NULL,
    "favourites_count" INTEGER,
    "followers_count" INTEGER NOT NULL,
    "friends_count" INTEGER,
    "has_custom_timelines" BOOLEAN,
    "is_translator" BOOLEAN,
    "listed_count" INTEGER,
    "location" TEXT,
    "media_count" INTEGER,
    "name" TEXT NOT NULL,
    "normal_followers_count" INTEGER NOT NULL,
    "possibly_sensitive" BOOLEAN,
    "profile_banner_url" TEXT,
    "profile_image_url_https" TEXT,
    "profile_interstitial_type" TEXT,
    "profile_url" TEXT,
    "protected" BOOLEAN,
    "rest_id" TEXT,
    "screen_name" TEXT NOT NULL,
    "statuses_count" INTEGER,
    "translator_type" TEXT,
    "username" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "verified_type" TEXT,

    CONSTRAINT "TwitterUser_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Subreddit_name_key" ON "Subreddit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RedditSubmission_id_key" ON "RedditSubmission"("id");

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
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_redditUserId_fkey" FOREIGN KEY ("redditUserId") REFERENCES "RedditUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "RedditComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_redditSubmissionId_fkey" FOREIGN KEY ("redditSubmissionId") REFERENCES "RedditSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditComment" ADD CONSTRAINT "RedditComment_childrenIds_fkey" FOREIGN KEY ("childrenIds") REFERENCES "RedditComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditSubmission" ADD CONSTRAINT "RedditSubmission_redditUserId_fkey" FOREIGN KEY ("redditUserId") REFERENCES "RedditUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditSubmission" ADD CONSTRAINT "RedditSubmission_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditVideoMetadata" ADD CONSTRAINT "RedditVideoMetadata_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "RedditVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetyTweet" ADD CONSTRAINT "TweetyTweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TwitterUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetyTweet" ADD CONSTRAINT "TweetyTweet_tweetyTweetId_fkey" FOREIGN KEY ("tweetyTweetId") REFERENCES "TweetyTweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditContentGenerationTaskToRedditResources" ADD CONSTRAINT "_RedditContentGenerationTaskToRedditResources_A_fkey" FOREIGN KEY ("A") REFERENCES "RedditContentGenerationTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditContentGenerationTaskToRedditResources" ADD CONSTRAINT "_RedditContentGenerationTaskToRedditResources_B_fkey" FOREIGN KEY ("B") REFERENCES "RedditResources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditGenerationMediaToRedditResources" ADD CONSTRAINT "_RedditGenerationMediaToRedditResources_A_fkey" FOREIGN KEY ("A") REFERENCES "RedditGenerationMedia"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RedditGenerationMediaToRedditResources" ADD CONSTRAINT "_RedditGenerationMediaToRedditResources_B_fkey" FOREIGN KEY ("B") REFERENCES "RedditResources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

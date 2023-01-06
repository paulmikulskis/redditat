import { z } from "zod";

export interface CommentDetails {
  author: string;
  authorKarma: number;
  commentKarma: number;
  numReplies: number;
  text: string;
  replies: CommentDetails[];
}

// types

export const YTwitterApiHandleScrapeArgs = z.object({
  handle: z.string().min(1),
  ntweets: z.number().default(1),
  pages: z.number().default(1),
  extended: z.boolean().default(true),
});

export interface TweetyTweet {
  author: TwitterUser;
  created_on: string;
  is_quoted: boolean;
  quoted_tweet?: TweetyTweet;
  quote_counts: number;
  is_retweet: boolean;
  is_reply: boolean;
  vibe: string;
  reply_counts: number;
  is_possibly_sensitive: boolean;
  id: string;
  tweet_body: string;
  text: string;
  language: string;
  likes: number;
  card?: any;
  place: JSON;
  retweet_counts: number;
  source: string;
  media: TwitterPostMedia[];
  user_mentions: TwitterUserMention[];
  urls: TwitterPostUrl[];
  hashtags: string[];
  symbols: any[];
  reply_to: any;
  threads: any[];
  comments: TweetyTweet[];
}

export interface TwitterUser {
  id: string;
  rest_id: string;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: any;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  location: string;
  media_count: number;
  name: string;
  normal_followers_count: number;
  profile_banner_url: string;
  profile_image_url_https: string;
  profile_interstitial_type: string;
  protected: boolean;
  screen_name: string;
  username: string;
  statuses_count: number;
  translator_type: string;
  verified: boolean;
  verified_type: any;
  possibly_sensitive: boolean;
  pinned_tweets: string[];
  profile_url: string;
}

export interface TwitterUserMention {
  id: string;
  name: string;
  screen_name: string;
  username: string;
}

export interface TwitterPostUrl {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface TwitterPostMedia {
  display_url: string;
  expanded_url: string;
  id: string;
  indices: number[];
  media_url_https: string;
  type: string;
  url: string;
  features: TwitterPostFeatures;
  media_key: string;
  mediaStats: any;
  sizes: any;
  original_info: any;
  file_format: string;
  streams: any[];
}

export interface TwitterPostFeatures {
  large: any;
  medium: any;
  small: any;
  orig: any;
}

export interface TwitterPostPlace {
  id: string;
  country: string;
  country_code: string;
  full_name: string;
  name: string;
  url: string;
  coordinates: TwitterPostCoordinate[];
}

export interface TwitterPostCoordinate {
  latitude: number;
  longitude: number;
}

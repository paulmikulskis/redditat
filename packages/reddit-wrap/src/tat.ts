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
import { TwitterApiv2, TwitterApi, UserV2 } from "twitter-api-v2";
import { env } from "@yungsten/utils";

/**
 * The `Tat` class is a utility class for interacting with the Twitter API using the node-twitter-api-v2 library.
 */
export class Tat {
  clientv1: TwitterApi;
  clientv2: TwitterApiv2;
  me: UserV2;
  followers: UserV2[];

  constructor() {
    this.clientv1 = new TwitterApi(env.TWITTER_API_KEY_BEARER_TOKEN);
    this.clientv2 = new TwitterApiv2(this.clientv1);
  }

  async _hydrate() {
    this.me = (await this.clientv2.me()).data;
    this.followers = (await this.clientv2.followers(this.me.id)).data;
  }

  async commentRecent(handle: string, recentN: number, comment: string) {}
}

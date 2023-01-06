import axios from "axios";
import { Ok, Err, Result } from "ts-results";
import { TweetyTweet, TwitterUser, YTwitterApiHandleScrapeArgs } from "./types";
import { z } from "zod";

/**
 * YTwitterApi is a class for interacting with the Yungsten Tech Twitter API, a web-based API for accessing Twitter data.
 *
 * This class provides an easy-to-use interface for making requests to the API and retrieving tweet data. It allows users
 * to retrieve a specified number of tweets for a given Twitter handle, as well as user information for a given handle.
 *
 * @class YTwitterApi
 */
export class YTwitterApi {
  private host: string;
  private token: string;

  constructor(host: string = "https://twitterapi.yungstentech.com", token?: string) {
    this.host = host;
    this.token = token ?? "";
  }

  /**
   * Retrieves tweet data for a given Twitter handle.
   *
   * @param {string} handle - The Twitter handle for which to retrieve tweet data.
   * @param {number} [ntweets=1] - The number of tweets to retrieve.
   * @param {number} [pages=1] - The number of pages of tweets to retrieve.
   * @param {boolean} [extended=true] - Whether to include extended comment tree data in the response.
   * @returns {Promise<Result<Tweet[], string>>} A promise that resolves to a `Result` object containing an array of tweet
   *   objects, or an error string in case of failure.
   */
  async getTweets(
    handle: string,
    ntweets: number = 1,
    pages: number = 1,
    extended: boolean = true
  ): Promise<Result<TweetyTweet[], string>> {
    try {
      const params: z.TypeOf<typeof YTwitterApiHandleScrapeArgs> = {
        handle,
        ntweets,
        pages,
        extended,
      };
      const options = {
        params,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.get(`${this.host}/tweets`, options);
      return Ok(response.data);
    } catch (error) {
      const err = error as Error;
      return Err(err.message);
    }
  }

  /**
   * Retrieves user information for a given Twitter handle.
   *
   * @param {string} handle - The Twitter handle for which to retrieve user information.
   * @returns {Promise<Result<TwitterUser, string>>} A promise that resolves to a `Result` object containing a Twitter user
   *   object, or an error string in case of failure.
   */
  async getUser(handle: string): Promise<Result<TwitterUser, string>> {
    try {
      const params = { handle };
      const options = {
        params,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.get(`${this.host}/user`, options);
      return Ok(response.data);
    } catch (error) {
      const err = error as Error;
      return Err(err.message);
    }
  }
}

export default YTwitterApi;

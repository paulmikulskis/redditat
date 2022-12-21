import { tokenRequestor, traw as RedditClient, userAgent, credentialedRequestor, basic_authentication, bearer_authentication, authCodeGrantRequestor, axiosCreate } from 'traw/src';
import snoowrap from 'snoowrap'
import axios from 'axios'
import { env } from '@yungsten/redditat-utils'
const agent = new userAgent(
  'OSX',
  'scrape_2',
  '1.0',
  'theburritoeater'
)

const rclient = new snoowrap({
  userAgent: env.REDDIT_BOT_USER_AGENT,
  clientId: env.REDDIT_BOT_CLIENT_ID,
  clientSecret: env.REDDIT_BOT_CLIENT_SECRET,
  refreshToken: env.REDDIT_BOT_REFRESH_TOKEN
});

console.log(`created reddit client`)


export async function getLatest(subreddit: string): Promise<any> {
  const a = await rclient.getHot()
  a.map(post => post.title)
    // Make a GET request to the /r/{subreddit}/new endpoint
    const options = { 
      url: `/r/${subreddit}/new`,
      params: {
        sort: 'new',
        limit: 1,
      }, 
    };
    console.log(`requesting for this user...`)

    // Return the first item in the response data
    console.log(JSON.stringify(a))
    return a;
    
}

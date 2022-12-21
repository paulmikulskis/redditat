import { tokenRequestor, traw as RedditClient, userAgent, credentialedRequestor, basic_authentication, bearer_authentication, authCodeGrantRequestor, axiosCreate } from 'traw/src';
import snoowrap from 'snoowrap'
import axios from 'axios'
const agent = new userAgent(
  'OSX',
  'scrape_2',
  '1.0',
  'theburritoeater'
)

const rclient = new snoowrap({
  userAgent: 'tingletee',
  clientId: 'oYg4AiaFbdn2D9ybVVghvQ',
  clientSecret: 'xIB-AKImki-ebWFCJA7w_dcWIdcoZQ',
  refreshToken: '26326736-cH0gfD9_xQgltnCJH3G4WEhQe8VPaA'
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
    return a;
    
}

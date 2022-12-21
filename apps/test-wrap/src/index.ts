
import { Rat, rclient } from '@yungsten/reddit-wrap'

async function test(): Promise<void> {
  const subredditName = 'AskReddit'
  const a = new Rat(rclient)
  const value = await a.getLatestFrom(subredditName)
  if (value.ok) {
    console.log(`subreddit is: ${JSON.stringify(value.result)}`)
  } else {
    console.log(`unable to fetch from ${subredditName}`)
  }
}

test()
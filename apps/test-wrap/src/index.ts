
import { getLatest } from '@yungsten/reddit-wrap'

async function test(): Promise<void> {
  const a = await getLatest('AskReddit')
  console.log(`subreddit is: ${JSON.stringify(a)}`)
}

test()
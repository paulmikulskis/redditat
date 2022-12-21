import { Rat, rclient, commentUtils } from "@yungsten/reddit-wrap";

async function test(): Promise<void> {
  const subredditName = "AskReddit";
  const a = new Rat(rclient);
  const value = await a.getLatestFrom(subredditName);
  if (value.ok && value.result) {
    console.log(`post from ${subredditName} is: ${JSON.stringify(value.result)}`);
    console.log("some comments from this post:");
    const comTree = commentUtils.topKarma(await a.getCommentTree(value.result?.id), 5);
    comTree.forEach((com) => console.log(`  -> ${com.author}: ${com.text}`));
  } else {
    console.log(`unable to fetch from ${subredditName}`);
  }
}

test();

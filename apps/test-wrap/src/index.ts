import { Rat, rclient, commentUtils } from "@yungsten/reddit-wrap";
import { tikTokTts } from "@yungsten/utils";

async function test(): Promise<void> {
  const subredditName = "AskReddit";
  const a = new Rat(rclient);
  const value = await a.getLatestFrom(subredditName);
  if (value.ok) {
    const val = value.val;
    if (val) {
      await tikTokTts.tts(val.title);
      console.log(`post from ${subredditName} is: ${JSON.stringify(val)}`);
      console.log("some comments from this post:");
      const comTree = commentUtils.topKarma(await a.getCommentTree(val.id), 5);
      comTree.forEach((com) => console.log(`  -> ${com.author}: ${com.text}`));
    }
  } else {
    console.log(
      `unable to fetch from ${subredditName}, ${value.val?.message || value.val}`
    );
  }
}

test();

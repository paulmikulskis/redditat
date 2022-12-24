import { Rat, rclient, commentUtils, parsing } from "@yungsten/reddit-wrap";
import {
  tikTokTts,
  supabaseExporter,
  ffmpegHelper,
  files,
  helperFuncs,
} from "@yungsten/utils";
import { images } from "@yungsten/openai";
import { getSizeInBytes } from "@yungsten/utils/src/helper-funcs";
import * as fs from "fs";

async function test(): Promise<void> {
  const SUBREDDIT_NAME = "AskReddit";
  const AUDIO_BUCKET_NAME = "audio";
  const PHOTO_BUCKET_NAME = "photo";
  const PHOTO_FILETYPE = "png";
  const VERSION = 53;
  const COMMENTS_TO_GET = 4;
  const render = new ffmpegHelper.FfmpegMachine();

  const a = new Rat(rclient);
  const value = await a.getLatestFrom(SUBREDDIT_NAME);
  if (value.ok) {
    const val = value.val[0];
    if (val) {
      const textPosting = val;
      const scriptObjects: ffmpegHelper.ScriptItem[] = [];
      const prompt = textPosting.title;
      let { speechDuration, photoUrl, audioUrl } = await requestAndUploadTtsScriptMedia(
        prompt,
        prompt,
        textPosting.id,
        0,
        VERSION,
        PHOTO_BUCKET_NAME,
        AUDIO_BUCKET_NAME,
        PHOTO_FILETYPE
      );
      console.log(
        `-------\n  * about to create script item with:\n  *   photoUrl: "${photoUrl}"\n *   audioUrl: "${audioUrl}"\n *   duration: "${
          typeof speechDuration === "string"
            ? speechDuration
            : JSON.stringify(speechDuration)
        }"`
      );
      scriptObjects.push({
        text: prompt,
        imageUrl: photoUrl,
        audioUrl: audioUrl,
        duration: speechDuration,
      });
      const comTree = commentUtils.topKarma(
        await a.getCommentTree(textPosting.id),
        COMMENTS_TO_GET
      );
      comTree.forEach((com) => console.log(`  -> ${com.author}: ${com.text}`));
      for (let i = 0; i < comTree.length; i++) {
        const comment = comTree[i];
        let { speechDuration, photoUrl, audioUrl } = await requestAndUploadTtsScriptMedia(
          prompt,
          comment.text,
          textPosting.id,
          i + 1,
          VERSION
        );
        console.log(
          `-------\n  * about to create script item with:\n  *   photoUrl: "${photoUrl}"\n  *   audioUrl: "${audioUrl}"\n  *   duration: "${
            typeof speechDuration === "string"
              ? speechDuration
              : JSON.stringify(speechDuration)
          }"`
        );
        scriptObjects.push({
          text: comment.text,
          imageUrl: photoUrl,
          audioUrl: audioUrl,
          duration: speechDuration,
        });
      }
      render.renderSimpleTtsImageScript(scriptObjects, callbackHandler);
    }
  } else {
    console.log(
      `unable to fetch from ${SUBREDDIT_NAME}, ${value.val?.message || value.val}`
    );
  }
}

const callbackHandler = async (filePath: string) => {
  supabaseExporter.uploadObject(
    "outputs",
    `tts/${new Date().getTime()}.mp4`,
    fs.readFileSync(filePath)
  );
};

export const requestAndUploadTtsScriptMedia = async (
  postPrompt: string,
  text: string,
  submissionId: string,
  index: number,
  version: number = 0,
  photoBucketName: string = "photo",
  audioBucketName: string = "audio",
  photoFiletype: string = "png"
) => {
  let speechDuration;
  const photoUrl = `${submissionId}/${index}.${photoFiletype}-v${version}`;
  const audioUrl = `${submissionId}/${index}-v${version}`;
  if (
    !(await supabaseExporter.folderExists("photo", `${submissionId}${index}-v${version}`))
  ) {
    console.log(
      `folder '${submissionId}' does not exist in supabase object storage!  requesting media generation...`
    );
    const ttsPrompt = parsing.swapInternetSlang(text);
    console.log(`getting tts for '${ttsPrompt}'`);
    const speech = await tikTokTts.tts(ttsPrompt);
    console.log(`speech duration: ${speech.duration}`);
    let photo;
    if (index === 0) {
      photo = await images.generateRedditPromptImage(text);
    } else {
      photo = await images.generateRedditPromptResponseImage(text, postPrompt);
    }
    await supabaseExporter.uploadObject(audioBucketName, audioUrl, speech.data);
    await supabaseExporter.uploadObject(photoBucketName, photoUrl, photo);
    speechDuration = await files.getAudioDuration(speech.data);
  } else {
    console.log(`folder '${submissionId} exists, so querying audio file: '${audioUrl}'`);
    const speech = await supabaseExporter.queryObjectsByKey("audio", audioUrl);
    if (speech) {
      const buffer = await helperFuncs.blobToBuffer(speech);
      console.log(`buffer from audio blob is ${getSizeInBytes(buffer)} bytes`);
      speechDuration = await files.getAudioDuration(buffer);
      console.log(
        `successfully downloaded audio file, speechDuration = ${speechDuration}`
      );
    } else {
      console.log(
        `WARNING!!! Was not able to download audio file from supabase, setting speechDuration to 0 !!!`
      );
      speechDuration = 0;
    }
  }

  return { speechDuration, photoUrl, audioUrl };
};

test();

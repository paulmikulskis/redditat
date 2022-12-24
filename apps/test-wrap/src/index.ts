import { Rat, rclient, commentUtils, parsing } from "@yungsten/reddit-wrap";
import { supabaseExporter, helperFuncs } from "@yungsten/utils";
import { images } from "@yungsten/openai";
import { ffmpegHelper, tikTokTts, files } from "@yungsten/prom";
import { Result, Err, Ok } from "ts-results";

import * as fs from "fs";

async function test(): Promise<void> {
  const SUBREDDIT_NAME = "AskReddit";
  const AUDIO_BUCKET_NAME = "audio";
  const PHOTO_BUCKET_NAME = "photo";
  const PHOTO_FILETYPE = "png";
  const VERSION = 0;
  const TOP_POST_NUMBER = 3;
  const COMMENTS_TO_GET = 4;
  const render = new ffmpegHelper.FfmpegMachine();

  const a = new Rat(rclient);
  const value = await a.getLatestFrom(SUBREDDIT_NAME, TOP_POST_NUMBER);
  if (value.ok) {
    const val = value.val[0];
    if (val) {
      const textPosting = val;
      const scriptObjects: ffmpegHelper.ScriptItem[] = [];
      const prompt = textPosting.title;
      let { speechDuration, photoFilePath, audioFilePath } =
        await requestAndUploadTtsScriptMedia(
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
        `-------\n  * about to create script item with:\n  *   photoFilePath: "${photoFilePath}"\n *   audioFilePath: "${audioFilePath}"\n *   duration: "${
          typeof speechDuration === "string"
            ? speechDuration
            : JSON.stringify(speechDuration)
        }"`
      );
      scriptObjects.push({
        text: prompt,
        imageUrl: photoFilePath,
        audioUrl: audioFilePath,
        duration: speechDuration,
      });
      const comTree = commentUtils.topKarma(
        await a.getCommentTree(textPosting.id),
        COMMENTS_TO_GET
      );
      comTree.forEach((com) => console.log(`  -> ${com.author}: ${com.text}`));
      for (let i = 0; i < comTree.length; i++) {
        const comment = comTree[i];
        let { speechDuration, photoFilePath, audioFilePath } =
          await requestAndUploadTtsScriptMedia(
            prompt,
            comment.text,
            textPosting.id,
            i + 1,
            VERSION
          );
        console.log(
          `-------\n  * about to create script item with:\n  *   photoFilePath: "${photoFilePath}"\n  *   audioFilePath: "${audioFilePath}"\n  *   duration: "${
            typeof speechDuration === "string"
              ? speechDuration
              : JSON.stringify(speechDuration)
          }"`
        );
        scriptObjects.push({
          text: comment.text,
          imageUrl: photoFilePath,
          audioUrl: audioFilePath,
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

export const requestAndUploadTtsScriptMedia2 = async (
  postPrompt: string,
  text: string,
  submissionId: string,
  index: number,
  version: number = 0,
  photoBucketName: string = "photo",
  audioBucketName: string = "audio",
  photoFiletype: string = "png",
  audioFiletype: string = "mp3"
) => {
  let speechDuration;
  const photoFileName = `${index}-v${version}.${photoFiletype}`;
  const photoFilePath = `${submissionId}/${index}-v${version}.${photoFiletype}`;
  const audioFilePath = `${submissionId}/${index}-v${version}.${audioFiletype}`;
  if (!(await supabaseExporter.fileExists("photo", photoFileName, submissionId))) {
    console.log(
      `file '${photoFileName}' does not exist bucket '${photoBucketName}/${submissionId}' requesting media generation...`
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
    await supabaseExporter.uploadObject(audioBucketName, audioFilePath, speech.data);
    await supabaseExporter.uploadObject(photoBucketName, photoFilePath, photo);
    speechDuration = await files.getAudioDuration(speech.data);
  } else {
    console.log(
      `folder '${submissionId} exists, so checking audio file for duration: '${audioFilePath}'`
    );
    const speech = await supabaseExporter.queryObjectsByKey("audio", audioFilePath);
    if (speech) {
      const buffer = await helperFuncs.blobToBuffer(speech);
      console.log(
        `buffer from audio blob is ${helperFuncs.getSizeInBytes(buffer)} bytes`
      );
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

  return { speechDuration, photoFilePath, audioFilePath };
};

/**
 * Requests and uploads media (audio and image) files based on the provided text.
 *
 * @param {string} postPrompt The original prompt that caused the text to be answered or produced below, used for context.
 * @param {string} text The text to generate media files for.  If generating for the original prompt, put the original prompt here as well!
 * @param {string} submissionId The submission ID to use as a folder name.
 * @param {number} index The index of the text within the array of script objects.
 * @param {number} [version=0] The version of the media files, often used to distinguish between generations of the same submissionId
 * @param {string} [photoBucketName='photo'] The name of the bucket to upload the image file to.
 * @param {string} [audioBucketName='audio'] The name of the bucket to upload the audio file to.
 * @param {string} [photoFiletype='png'] The file type of the image file.
 * @param {string} [audioFiletype='mp3'] The file type of the audio file.
 * @returns {Result<{ speechDuration: number, photoFilePath: string, audioFilePath: string }, Error>} A result object that contains the speech duration, photo file path, and audio file path if successful, or an error if unsuccessful.
 *
 * @example
 * const result = await requestAndUploadTtsScriptMedia(
 *   'What would you do with a million dollars?',
 *   'Fly to your anus',
 *   'ztf1av',
 *   1
 * );
 * if (result.isOk()) {
 *   console.log(result.value); // { speechDuration: 123, photoFilePath: 'ztf1av/1-v0.png', audioFilePath: 'ztf1av/1-v0.mp3' }
 * } else {
 *   console.error(result.error);
 * }
 *
 * @throws {Error} If there is an error while requesting the TTS audio or generating the image.
 */

export const requestAndUploadTtsScriptMedia = async (
  postPrompt: string,
  text: string,
  submissionId: string,
  index: number,
  version: number = 0,
  photoBucketName: string = "photo",
  audioBucketName: string = "audio",
  photoFiletype: string = "png",
  audioFiletype: string = "mp3"
): Promise<
  Result<{ speechDuration: number; photoFilePath: string; audioFilePath: string }, Error>
> => {
  let speechDuration;
  const photoFileName = `${index}-v${version}.${photoFiletype}`;
  const photoFilePath = `${submissionId}/${index}-v${version}.${photoFiletype}`;
  const audioFilePath = `${submissionId}/${index}-v${version}.${audioFiletype}`;
  if (!(await supabaseExporter.fileExists("photo", photoFileName, submissionId))) {
    console.log(
      `file '${photoFileName}' does not exist bucket '${photoBucketName}/${submissionId}' requesting media generation...`
    );
    const ttsPrompt = parsing.swapInternetSlang(text);
    console.log(`getting tts for '${ttsPrompt}'`);
    const speech = await tikTokTts.tts(ttsPrompt);
    console.log(`speech duration: ${speech.duration}`);
    let photo;
    try {
      if (index === 0) {
        photo = await images.generateRedditPromptImage(text);
      } else {
        photo = await images.generateRedditPromptResponseImage(text, postPrompt);
      }
    } catch (error) {
      const err = error as Error;
      return Err(err);
    }
    await supabaseExporter.uploadObject(audioBucketName, audioFilePath, speech.data);
    await supabaseExporter.uploadObject(photoBucketName, photoFilePath, photo);
    speechDuration = await files.getAudioDuration(speech.data);
  } else {
    console.log(
      `folder '${submissionId} exists, so checking audio file for duration: '${audioFilePath}'`
    );
    const speech = await supabaseExporter.queryObjectsByKey("audio", audioFilePath);
    if (speech) {
      const buffer = await helperFuncs.blobToBuffer(speech);
      console.log(
        `buffer from audio blob is ${helperFuncs.getSizeInBytes(buffer)} bytes`
      );
    } else {
      console.log(
        `WARNING!!! Was not able to download audio file from supabase, setting speechDuration to 0 !!!`
      );
      speechDuration = 0;
    }
  }
  if (speechDuration === undefined) {
    return Err(new Error("Error: speechDuration is undefined"));
  }
  return Ok({ speechDuration, photoFilePath, audioFilePath });
};

test();

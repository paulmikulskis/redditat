// @ts-ignore
import mmdb from "mmdb-reader";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { Readable } from "stream";
import * as fs from "fs";

/**
 * Returns the duration of the given audio file buffer in seconds.
 *
 * @param {Buffer} audioBuffer - The buffer representing the audio file.
 * @returns {Promise<number>} - A promise that resolves with the duration of the audio file in milliseconds.
 */
export const getAudioDuration = async (
  audioBuffer: Buffer | undefined
): Promise<number> => {
  if (!audioBuffer) return 0;
  fs.writeFileSync("./TEST.mp3", audioBuffer);
  const duration = await getAudioDurationInSeconds("./TEST.mp3");
  fs.unlinkSync("./TEST.mp3");
  return Math.floor(duration * 1000);
};

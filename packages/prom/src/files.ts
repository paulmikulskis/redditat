// @ts-ignore
import { getAudioDurationInSeconds } from "get-audio-duration";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
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

/**
 * Returns an instance of the `ffmpeg` command with the `ffprobe` path set.
 *
 * @returns {FfmpegCommand} An instance of the `ffmpeg` command.
 *
 * @example
 * const editor = getFfmpeg();
 * editor.input('test.mp4').duration(10).saveFile('test-edited.mp4')
 *
 * @throws {Error} If the `ffmpeg` library or the `@ffprobe-installer/ffprobe` package are not available.
 */

export const getFfmpeg = (): FfmpegCommand => {
  const command = ffmpeg().setFfprobePath(require("@ffprobe-installer/ffprobe").path);
  return command;
};

import * as fs from "fs";
import * as mm from "music-metadata";
import { IAudioMetadata } from "music-metadata/lib/type";
import { parseBuffer } from "music-metadata";
import { AudioBufferTypes } from "./types";

/**
 * Returns the duration of the given audio file buffer in seconds.
 *
 * @param {Buffer} audioBuffer - The buffer representing the audio file.
 * @param {string} [audioBufferType="audio/mp3"] - The type of the audio file buffer.
 * @returns {Promise<number>} - A promise that resolves with the duration of the audio file in seconds.
 */
export const getAudioDuration = async (
  audioBuffer: Buffer,
  audioBufferType: AudioBufferTypes = "audio/mp3"
): Promise<number> => {
  try {
    const audioMetadata: IAudioMetadata = await parseBuffer(audioBuffer, audioBufferType);
    const duration = audioMetadata.format.duration; // convert seconds to seconds
    return duration;
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    throw new Error(`Error getting duration of audio file: ${err.message}`);
  }
};

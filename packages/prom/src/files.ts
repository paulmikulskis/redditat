// @ts-ignore
import { getAudioDurationInSeconds } from "get-audio-duration";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import * as fs from "fs";
import sharp from "sharp";
//import * as heic2any from "heic2any";
import { helperFuncs } from "@yungsten/utils";
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

/**
 * Generates a preview image for a given file.
 *
 * @param {string} filePath - The file path of the file for which to generate a preview.
 * @returns {Promise<Buffer>} A promise that resolves with a Buffer object containing the preview image data.
 * @throws {Error} If there is an error generating the preview.
 *
 * @example
 * const previewBuffer = await generatePreview("/path/to/my/file.jpg");
 */

export async function generatePreview(filePath: string): Promise<Buffer> {
  const fileType = filePath.split(".").pop();
  switch (fileType) {
    // case "heic": {
    //   try {
    //     // Read the HEIC file from the given file path and convert it to a Blob object
    //     const heicBlob = (await new Promise((resolve, reject) => {
    //       fs.readFile(filePath, (err, data) => {
    //         if (err) reject(err);
    //         // Create a Blob object with the file data and the correct MIME type
    //         resolve(new Blob([data], { type: "image/heic" }));
    //       });
    //     })) as Blob;

    //     // Convert the HEIC Blob to a JPEG Blob using the heic2any library
    //     const jpegBlob = await heic2any.default({ blob: heicBlob, toType: "image/jpeg" });

    //     // Convert the JPEG Blob to a Buffer using a FileReader
    //     const jpegBuffer = await new Promise((resolve, reject) => {
    //       const fileReader = new FileReader();
    //       fileReader.onloadend = () =>
    //         // Create a Buffer from the ArrayBuffer returned by the FileReader
    //         resolve(Buffer.from(fileReader.result as ArrayBuffer));
    //       fileReader.onerror = reject;
    //       fileReader.readAsArrayBuffer(jpegBlob as Blob);
    //     });

    //     // Use the Sharp library to resize the JPEG image and generate the preview Buffer
    //     const previewBuffer = await sharp(jpegBuffer).resize(128).png().toBuffer();
    //     return previewBuffer;
    //   } catch (error) {
    //     // Throw an error if there was a problem generating the preview
    //     throw new Error(`Error generating JPEG preview for HEIC file: ${error}`);
    //   }
    // }
    case "jpeg":
    case "JPEG":
    case "jpg":
    case "JPG":
    case "png":
    case "PNG":
    case "gif":
    case "GIF":
    case "bmp":
    case "BMP":
    case "webp":
    case "WEBP": {
      try {
        // use sharp library to generate a resized jpeg preview of the image
        const buffer = await fs.promises.readFile(filePath);
        return await sharp(buffer).resize(128, 128, { fit: "contain" }).png().toBuffer();
      } catch (error) {
        throw new Error(`Error generating preview for image file: ${error}`);
      }
    }
    case "avi":
    case "AVI":
    case "mov":
    case "MOV":
    case "mp4":
    case "MP4": {
      try {
        // Use ffmpeg to generate a screenshot of the video at the 20% mark
        // and save it to a file called "preview.jpeg" in the same directory as the video file.
        await new Promise<void>((resolve, reject) => {
          ffmpeg(filePath)
            .on("error", (error) => reject(error))
            .on("end", () => resolve())
            .screenshots({
              timestamps: ["20%"],
              size: "128x?",
              filename: "preview.jpeg",
            });
        });
        // Read the preview image file into a buffer
        const imageDataBuffer = await fs.promises.readFile(`${filePath}/preview.jpeg`);
        // Delete the preview image file now that we have the data within a buffer in memory
        fs.unlinkSync(`${filePath}/preview.jpeg`);
        // Use the Sharp library to resize the JPEG image and generate the preview Buffer
        const previewBuffer = await sharp(imageDataBuffer)
          .resize(128, 128, { fit: "contain" })
          .png()
          .toBuffer();
        // Return the preview image buffer
        return previewBuffer;
      } catch (error) {
        throw new Error(`Error generating preview for video file: ${error}`);
      }
    }
    default:
      throw new Error(`Cannot generate preview for file type ${fileType}`);
  }
}

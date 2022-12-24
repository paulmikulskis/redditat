import ffmpeg, { AudioVideoFilter } from "fluent-ffmpeg";
import { queryObjectsByKey } from "./exporter-supabase";
import { helperFuncs } from ".";
import { blobToBuffer, getSizeInBytes } from "./helper-funcs";
import * as fs from "fs";
import { maxCharsPerLine } from "./parsing";

// https://gist.github.com/Saccarab/c8e0540e8a9ba26c771c2808c804e066
export type ScriptItem = {
  text: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  config?: Record<string, any>;
};

export type FfmpegMachineConfig = {
  saveToDisk: boolean;
  saveToSupabase: boolean;
  storageBackend: string;
};

export const defaultConfig = {
  saveToDisk: true,
  saveToSupabase: true,
  storageBackend: "supabase",
};

const VIDEO_FORMAT = "mp4";
const AUDIO_FORMAT = "mp3";
const AUDIO_SPEED = 1.3;

export class FfmpegMachine {
  config: FfmpegMachineConfig;

  constructor(config: FfmpegMachineConfig = defaultConfig) {
    this.config = config;
  }

  renderSimpleTtsImageScript = async (
    script: ScriptItem[],
    callbackHandler: (outputFilePath: string) => {}
  ) => {
    let totalTime = 0;
    script.forEach((item) => {
      item.duration = item.duration / AUDIO_SPEED;
      totalTime += item.duration;
    });
    console.log(
      `calling FFMPEG render for ${script.length} clips, totalling ${totalTime}ms`
    );
    const combinedTts = await this.combineAudio(script, "audioCombined");
    const combinedImages = await this.combineImages(
      script,
      callbackHandler,
      "imagesCombined"
    );
  };

  combineAudio = async (
    script: ScriptItem[],
    outputFileName: string = "combinedAudio",
    outputFormat: string = "mp3",
    outputFolderName: string = "media"
  ) => {
    const outputFilePath = `${outputFolderName}/${outputFileName}.${outputFormat}`;

    let command;
    // Iterate through each script item and add the text, image, and audio to the video
    for (let i = 0; i < script.length; i++) {
      const item = script[i];
      console.log(`processing script item ${i}`);
      console.log(`audio key: ${item.audioUrl}`);
      const audio = await queryObjectsByKey("audio", item.audioUrl);
      if (!audio || audio === null) {
        console.log(
          `audio ${item.audioUrl} is null or undefined!  skipping audio generation`
        );
        continue;
      }
      fs.writeFileSync(
        `${outputFolderName}/audio${i}.${outputFormat}`,
        await helperFuncs.blobToBuffer(audio)
      );
      const audioReadable = await helperFuncs.toReadable(audio);
      console.log(`FFMEG audio data contains ${getSizeInBytes(audioReadable)} bytes`);
      if (audio != null && audio) {
        console.log(
          `about to add ${getSizeInBytes(
            audioReadable
          )} readable bytes to the FFMPEG stream from the audio`
        );
        if (!command) {
          command = ffmpeg();
          command
            .setFfprobePath(require("@ffprobe-installer/ffprobe").path)
            .mergeAdd(`${outputFolderName}/audio${i}.${outputFormat}`);
        } else {
          command
            .mergeAdd(`${outputFolderName}/audio${i}.${outputFormat}`)
            .inputFormat(outputFormat);
        }
      }
    }
    if (command) {
      await command
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
        })
        .on("end", function () {
          console.log("Merging audio finished !");
          const command2 = ffmpeg();
          command2.setFfprobePath(require("@ffprobe-installer/ffprobe").path);
          command2
            .input(`${outputFolderName}/${outputFileName}.${AUDIO_FORMAT}`)
            .audioFilters(`atempo=${AUDIO_SPEED}`)
            .on("error", function (err) {
              console.log("An error occurred: " + err.message);
            })
            .on("end", function () {
              console.log("Merging all images finished!");
              return outputFilePath;
            })
            .saveToFile(`${outputFolderName}/${outputFileName}-sped.${AUDIO_FORMAT}`);
        })
        .mergeToFile(outputFilePath);
    }
  };

  combineImages = async (
    script: ScriptItem[],
    callbackHandler: (outputFilePath: string) => {},
    videoOutputFileName: string = "combinedImages",
    imageFormat: string = "png",
    outputFolderName: string = "media"
  ) => {
    // FIX:
    const audioOutputFileName = "audioCombined";
    const finalOutputFileName = "final";
    const outputFilePath = `${outputFolderName}/${videoOutputFileName}.${VIDEO_FORMAT}`;

    let totalTime = 0;
    script.forEach((item) => {
      totalTime += item.duration;
    });
    // Iterate through each script item and add the text, image, and audio to the video
    for (let i = 0; i < script.length; i++) {
      const command = ffmpeg();
      command.setFfprobePath(require("@ffprobe-installer/ffprobe").path);
      const item = script[i];
      console.log(`processing script item ${i}`);
      console.log(`image key: ${item.imageUrl}`);
      const image = await queryObjectsByKey("photo", item.imageUrl);
      if (!image || image === null) {
        console.log(
          `image ${item.imageUrl} is null or undefined!  skipping image generation`
        );
        continue;
      }
      fs.writeFileSync(
        `${outputFolderName}/image${i}.${imageFormat}`,
        await helperFuncs.blobToBuffer(image)
      );
      const imageReadable = await helperFuncs.toReadable(image);
      console.log(`FFMEG image data contains ${getSizeInBytes(imageReadable)} bytes`);
      if (image != null && image) {
        console.log(
          `about to add ${getSizeInBytes(
            imageReadable
          )} readable bytes to the FFMPEG stream from the image`
        );
        const titleText = maxCharsPerLine(item.text, 22)
          .replace("[", "\\\\\\[")
          .replace("]", "\\\\\\]");
        command
          .input(`${outputFolderName}/image${i}.${imageFormat}`)
          .loop(item.duration / 1000)
          .videoFilters([
            {
              filter: "drawtext",
              options: {
                fontfile: "resources/LucidaGrande.ttf",
                text: titleText || "",
                fontsize: 70,
                fontcolor: "white",
                x: "(main_w/2-text_w/2)",
                y: "(main_h/2-text_h/2)",
                shadowcolor: "black",
                shadowx: 4,
                shadowy: 4,
              },
            },
          ] as AudioVideoFilter[]);

        command
          .outputOptions("-pix_fmt yuv420p")
          .outputOptions("-movflags frag_keyframe+empty_moov")
          .videoCodec("libx264")
          .on("error", function (err) {
            console.log("An error occurred: " + err.message);
          })
          .on("end", function () {
            console.log("Merging image finished!");
            if (i === script.length - 1) {
              // combine all extruded video files just created:
              const command2 = ffmpeg();
              command2.setFfprobePath(require("@ffprobe-installer/ffprobe").path);
              script.forEach((item, index) =>
                command2.input(
                  `${outputFolderName}/${videoOutputFileName}${index}.${VIDEO_FORMAT}`
                )
              );
              command2
                .outputOptions("-pix_fmt yuv420p")
                .outputOptions("-movflags frag_keyframe+empty_moov")
                .videoCodec("libx264")
                .on("error", function (err) {
                  console.log("An error occurred: " + err.message);
                })
                .on("end", function () {
                  console.log("Merging all images finished!");
                  // combine all extruded video files just created:
                  const command3 = ffmpeg();
                  command3.setFfprobePath(require("@ffprobe-installer/ffprobe").path);
                  command3
                    .input(
                      `${outputFolderName}/${audioOutputFileName}-sped.${AUDIO_FORMAT}`
                    )
                    .input("resources/rhapsodyInBlueStart60.mp3")
                    .input(`${outputFolderName}/${videoOutputFileName}.${VIDEO_FORMAT}`)
                    // .complexFilter([
                    //   {
                    //      filter : 'amix', options: { inputs : 2, duration : 'shortes' }
                    //   }
                    // ])
                    .complexFilter([
                      {
                        filter: "volume",
                        options: ["0.8"],
                        inputs: "0:0",
                        outputs: "[s1]",
                      },
                      {
                        filter: "volume",
                        options: ["0.7"],
                        inputs: "1:0",
                        outputs: "[s2]",
                      },
                      {
                        filter: "amix",
                        inputs: ["[s1]", "[s2]"],
                        options: [
                          "duration=longest",
                          "dropout_transition=0",
                          "normalize=0",
                        ],
                        outputs: "[fa1]",
                      },
                      {
                        filter: "afade",
                        inputs: "[fa1]",
                        options: ["type=out", `st=${totalTime / 1000}`, "d=1.1"],
                      },
                    ])
                    .outputOptions("-pix_fmt yuv420p")
                    .outputOptions("-movflags frag_keyframe+empty_moov")
                    .videoCodec("libx264")
                    .size("1080x1920")
                    .autopad()
                    .setDuration(totalTime / 1000 + 1)
                    .on("error", function (err) {
                      console.log("An error occurred: " + err.message);
                    })
                    .on("end", function () {
                      console.log("Merging all images finished!");
                      callbackHandler(
                        `${outputFolderName}/${finalOutputFileName}.${VIDEO_FORMAT}`
                      );
                    })
                    .saveToFile(
                      `${outputFolderName}/${finalOutputFileName}.${VIDEO_FORMAT}`
                    );
                })
                .mergeToFile(
                  `${outputFolderName}/${videoOutputFileName}.${VIDEO_FORMAT}`
                );
              return outputFilePath;
            }
          })
          .output(`${outputFolderName}/${videoOutputFileName}${i}.${VIDEO_FORMAT}`)
          .run();
      }
    }
  };
}

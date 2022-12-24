combineImages = async (
  script: ScriptItem[],
  outputFileName: string = "combinedImages",
  imageFormat: string = "png",
  outputFolderName: string = "media"
) => {
  // FIX:
  const audioOutputFileName = "audioCombined";
  const finalOutputFileName = "final";
  const VIDEO_FORMAT = "mp4";
  const IMAGE_FORMAT = "png";
  const outputFilePath = `${outputFolderName}/${outputFileName}.${VIDEO_FORMAT}`;
  let totalTime = 0;
  script.forEach((item) => (totalTime += item.duration));
  console.log(
    `calling FFMPEG render combineImages for ${script.length} image clips, totalling ${totalTime}ms`
  );
  let finished = false;
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
      command
        .input(`${outputFolderName}/image${i}.${imageFormat}`)
        .loop(item.duration / 1000);
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
                `${outputFolderName}/${outputFileName}${index}.${VIDEO_FORMAT}`
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
                command3.input(`${outputFolderName}/${outputFileName}.${VIDEO_FORMAT}`);
                command3.input(
                  `${outputFolderName}/${audioOutputFileName}.${IMAGE_FORMAT}`
                );
                command3
                  .outputOptions("-pix_fmt yuv420p")
                  .outputOptions("-movflags frag_keyframe+empty_moov")
                  .videoCodec("libx264")
                  .on("error", function (err) {
                    console.log("An error occurred: " + err.message);
                  })
                  .on("end", function () {
                    console.log("Merging all images finished!");
                  })
                  .mergeToFile(
                    `${outputFolderName}/${finalOutputFileName}.${VIDEO_FORMAT}`
                  );
                return outputFilePath;
              })
              .mergeToFile(`${outputFolderName}/${outputFileName}.${VIDEO_FORMAT}`);
            return outputFilePath;
          }
        })
        .output(`${outputFolderName}/${outputFileName}${i}.${VIDEO_FORMAT}`)
        .run();
    }
  }
};

/**
 * Helper functions for writing data to S3
 */
import * as AWS from "aws-sdk";
import { createLogger } from "./logging";
import { getSizeInBytes } from "./helper-funcs";
import { validatedEnv as env } from "./validatedEnv";

const logger = createLogger();

const IAM_USER_KEY = env.IAM_USER_KEY;
const IAM_USER_SECRET = env.IAM_USER_SECRET;

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadToS3 = (
  data: any,
  key: string,
  bucketName = "dutchiedata"
): Promise<any> => {
  let parsedData;
  try {
    parsedData = JSON.stringify(data);
  } catch (e) {
    logger.error(
      `ERROR: cannot upload file '${key}' to S3, data passed is not JSON-serializable!`
    );
    parsedData = undefined;
  }
  logger.info(
    `attempting to upload ${getSizeInBytes(
      parsedData
    )} bytes as filename '${key}' to S3 bucket '${bucketName}'`
  );
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: parsedData,
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        logger.warn(`error uploading to S3 bucket '${bucketName}', ${err.message}`);
        return reject(err);
      }
      logger.info(`successfully uploaded to S3 bucket '${bucketName}'!`);
      return resolve(data);
    });
  });
};

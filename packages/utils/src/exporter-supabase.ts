import { createClient } from "@supabase/supabase-js";
import { env } from "./index";

//supabase storage API docs: https://supabase.github.io/storage-api/#/
const supabase = createClient(env.SUPABSE_API_KEY, env.SUPABSE_API_KEY);

/**
 * Queries for objects in the specified bucket by object key.
 *
 * @param bucketName The name of the bucket to query.
 * @param objectKey The key of the object to retrieve.
 * @returns An object with the specified key, if it exists in the specified bucket.
 * @throws An error if the object could not be retrieved or if the bucket does not exist.
 */
export const queryObjectsByKey = async (bucketName: string, objectKey: string) => {
  // Check if bucketName is valid
  if (!bucketName || typeof bucketName !== "string") {
    throw new Error(`Invalid bucketName: ${bucketName}`);
  }
  // Check if objectKey is valid
  if (!objectKey || typeof objectKey !== "string") {
    throw new Error(`Invalid objectKey: ${objectKey}`);
  }

  try {
    const bucket = supabase.storage.from(bucketName);
    const result = await bucket.download(objectKey);
    return result;
  } catch (error) {
    console.error(
      `Error querying object with key "${objectKey}" in bucket "${bucketName}":`,
      error
    );
    return undefined;
  }
};

/**
 * Uploads an object to the Supabase storage API.
 *
 * @param bucketName The name of the bucket to upload the object to.
 * @param key The key or path of the object within the bucket.
 * @param object The object to be stored in the bucket.
 * @returns A promise that resolves to an object with the following shape:
 *          { data: { path: string }, error: null } if the object was successfully uploaded,
 *          or { data: null, error: StorageError } if there was an error.
 */

export const uploadObject = async (
  bucketName: string,
  key: string,
  object: any
): Promise<boolean> => {
  // Create a Blob from the object being uploaded
  const objectBlob = new Blob([JSON.stringify(object)], { type: "application/json" });

  // Get the bucket to upload the object to
  const bucket = supabase.storage.from(bucketName);

  // Attempt to upload the object to the bucket
  try {
    // Use the .upload method from the bucket to upload the object
    // Set the upsert option to false to prevent overwriting existing objects with the same key
    // Set the cacheControl option to 3600 seconds (1 hour) to set the object's cache expiration time
    const { data, error } = await bucket.upload(key, objectBlob, {
      cacheControl: "3600",
      upsert: false,
    });

    // If the upload was successful, log the object's key
    if (data) {
      console.log(`Successfully uploaded object with key ${key}`);
      return true;
    } else {
      // If the upload failed, throw an error with the returned Supabase error message
      throw new Error(error.message);
    }
  } catch (error) {
    // Log the error message if the upload failed
    console.error(`Error uploading object: ${error.message}`);
  }
};

/**
 * Lists all the filenames inside a given bucket.
 *
 * @param {string} bucketName The name of the bucket to list the filenames from.
 * @param {string} [path=''] The folder path
 * @param {number} [limit=100] Max files to return
 * @returns An object containing the list of filenames and an error object if the operation fails.
 */
export const listBucket = async (
  bucketName: string,
  path: string = "",
  limit: number = 100
): Promise<string[]> => {
  const fileNames = [];
  try {
    // Get the bucket object
    const bucket = supabase.storage.from(bucketName);

    // List all files in the bucket
    const result = await bucket.list(path, {
      limit: limit, // Limit the number of results to 100
      offset: 0, // Start from the beginning
      sortBy: { column: "name", order: "asc" }, // Sort the results by name in ascending order
    });

    // Check if there are any files in the bucket
    if (result.data.length === 0) {
      console.log(`No files found in bucket "${bucketName}"`);
      return [];
    }

    // Print the filenames of all the files in the bucket
    console.log(`Files found in bucket "${bucketName}":`);
    result.data.forEach((file) => {
      fileNames.push(file.name);
    });
    return fileNames;
  } catch (error) {
    console.error(`Error listing files in bucket "${bucketName}": ${error.message}`);
    return [];
  }
};

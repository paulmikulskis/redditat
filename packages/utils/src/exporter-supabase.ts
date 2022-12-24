import { createClient } from "@supabase/supabase-js";
import { env } from "./index";

//supabase storage API docs: https://supabase.github.io/storage-api/#/
const supabase = createClient(env.SUPABASE_PROJECT_URL, env.SUPABSE_API_KEY);

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
    return result.data;
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
): Promise<string> => {
  // Get the bucket to upload the object to
  const bucket = supabase.storage.from(bucketName);

  // Attempt to upload the object to the bucket
  try {
    console.log(`attemting to upload object '${key}' to bucket ${bucketName}`);
    // Use the .upload method from the bucket to upload the object
    // Set the upsert option to false to prevent overwriting existing objects with the same key
    // Set the cacheControl option to 3600 seconds (1 hour) to set the object's cache expiration time
    const { data, error } = await bucket.upload(key, object, {
      cacheControl: "3600",
      upsert: false,
    });

    // If the upload was successful, log the object's key
    if (data) {
      console.log(`Successfully uploaded object with key ${key}`);
      return key;
    } else {
      console.log(`was not able to upload to supabase...${error.message}`);
      return "";
    }
  } catch (error) {
    const err = error as Error;
    // Log the error message if the upload failed
    console.error(`Error uploading object: ${err.message}`);
    if (err.message === "The resource already exists") {
      return key;
    }
    return "";
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
  const fileNames: string[] = [];
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
    if (result.data?.length === 0) {
      console.log(`No files found in bucket "${bucketName}"`);
      return [];
    }

    // Print the filenames of all the files in the bucket
    console.log(`Files found in bucket "${bucketName}":`);
    result.data?.forEach((file) => {
      fileNames.push(file.name);
    });
    return fileNames;
  } catch (error) {
    const err = error as Error;
    console.error(`Error listing files in bucket "${bucketName}": ${err.message}`);
    return [];
  }
};

/**
 * Returns whether or not a folder exists in a given bucket.
 *
 * @param {string} bucketName The name of the bucket to check for the folder.
 * @param {string} folderName The name of the folder to check for.
 * @returns {boolean} True if the folder exists in the bucket, false otherwise.
 */
export const folderExists = async (
  bucketName: string,
  folderName: string
): Promise<boolean> => {
  try {
    // Get the bucket object
    const bucket = supabase.storage.from(bucketName);

    // List all files in the bucket
    const result = await bucket.list("", {
      limit: 1, // Only need to check one file to see if the folder exists
      offset: 0, // Start from the beginning
      sortBy: { column: "name", order: "asc" }, // Sort the results by name in ascending order
      search: folderName, // Check for files with names that start with the folder name
    });

    // Check if there are any files in the bucket that match the folder name
    return (result.data?.length || -1) > 0;
  } catch (error) {
    const err = error as Error;
    console.error(
      `Error checking for folder "${folderName}" in bucket "${bucketName}": ${err.message}`
    );
    return false;
  }
};

/**
 * Returns whether or not a file exists in a given bucket.
 *
 * @param {string} bucketName The name of the bucket to check for the file.
 * @param {string} fileName The name of the file to check for.
 * @param {string} [path] An optional search glob to narrow down the lookup.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether or not the file exists in the bucket.
 *
 * @example
 * const fileExists = await fileExists('my-bucket', 'my-file.txt');
 * console.log(fileExists); // true or false
 *
 * @throws {Error} If there is an error while attempting to list the files in the bucket.
 */
export const fileExists = async (
  bucketName: string,
  fileName: string,
  path?: string
): Promise<boolean> => {
  try {
    // Get the bucket object
    const bucket = supabase.storage.from(bucketName);

    // List all files in the bucket
    const result = await bucket.list(path || "", {
      limit: 1, // Only need to check one file to see if the file exists
      offset: 0, // Start from the beginning
      sortBy: { column: "name", order: "asc" }, // Sort the results by name in ascending order
      search: fileName, // Check for files with names that match the file name
    });

    // Check if there are any files in the bucket that match the file name
    return (result.data?.length || -1) > 0;
  } catch (error) {
    const err = error as Error;
    console.error(
      `Error checking for file "${fileName}" in bucket "${bucketName}": ${err.message}`
    );
    return false;
  }
};

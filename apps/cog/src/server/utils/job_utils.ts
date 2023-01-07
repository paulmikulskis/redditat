import { createHash } from "crypto";

/**
 * Returns the workflow name from a given jobId string.
 * @param jobId The jobId of a BullJS job.
 * @returns The workflow name.
 */
export const jobIdToWorkflowName = (jobId: unknown): string => {
  // If the given input is not a string, return 'UNKNOWN_WORKFLOW'
  if (typeof jobId !== "string") return "UNKNOWN_WORKFLOW";
  return jobId.split(".")[1] || "UNKNOWN_WORKFLOW";
};

/**
 * Returns the user name from a given jobId string.
 * @param jobId The jobId of a BullJS job.
 * @returns The user name.
 */
export const jobIdToUserName = (jobId: unknown): string => {
  // If the given input is not a string, return 'UNKNOWN_USER'
  if (typeof jobId !== "string") return "UNKNOWN_USER";
  return jobId.split(".")[0] || "UNKNOWN_USER";
};

/**
 * Returns the function name from a given jobId string.
 * @param jobId The jobId of a BullJS job.
 * @returns The function name.
 */
export const jobIdToFunctionName = (jobId: unknown): string => {
  // If the given input is not a string, return 'UNKNOWN_FUNCTION'
  if (typeof jobId !== "string") return "UNKNOWN_FUNCTION";
  return jobId.split(".")[2] || "UNKNOWN_FUNCTION";
};

/**
 * Returns the cron string from a given jobId string.
 * @param jobId The jobId of a BullJS job.
 * @returns The cron string.
 */
export const jobIdToCron = (jobId: unknown): string => {
  // If the given input is not a string, return 'UNKNOWN_CRON'
  if (typeof jobId !== "string") return "UNKNOWN_CRON";
  return jobId.split(".")[3] || "UNKNOWN_CRON";
};

/**
 * Generates a repeat job ID for a BullJS repeatable job.
 * The job ID is different than a normal BullJS job ID, and is needed to query and fetch info about those job objects.
 * @param name The name of the repeatable job.
 * @param nextMillis The next execution time for the repeatable job in milliseconds.
 * @param key A unique key to identify the repeatable job.
 * @param jobId (optional) The existing job ID to be updated. If not provided, a new job ID will be generated.
 * @returns A repeat job ID string.
 */
export const repeatJobId = (
  name: string,
  nextMillis: number,
  key: string,
  jobId?: string
): string => {
  return getRepeatJobId(name, nextMillis, md5(key), jobId);
};

/**
 * Calculates and returns the md5 hash of a given input
 * @param str The string to take the m5d hash of
 * @returns A the md5 hash of the input string
 */
const md5 = (str: string): string => {
  return createHash("md5").update(str).digest("hex");
};

// from BullJS library, this is actually how they generate it (why don't they export it?!)
const getRepeatJobId = (
  name: string,
  nextMillis: number,
  namespace: string,
  jobId?: string
) => {
  const checksum = md5(`${name}${jobId || ""}${namespace}`);
  return `repeat:${checksum}:${nextMillis}`;
};

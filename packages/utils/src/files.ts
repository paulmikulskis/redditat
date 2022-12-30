import { join } from "path";
import { promises } from "fs";

/**
 * Recursively generates an array of file paths within a given directory
 *
 * @param {string} dir - The path to the directory to search
 * @param {string} basePath - The path remove from the resulting list of paths
 * @returns {string[]} An array of file paths within the given directory
 *
 * @example
 * const filePaths = getFilesRecursive('/path/to/dir');
 * console.log(filePaths);
 * // Output: ['/path/to/dir/file1.txt', '/path/to/dir/subdir/file2.txt']
 */
export async function getFilesRecursive(
  dir: string,
  basePath?: string
): Promise<string[]> {
  // Read the contents of the directory
  const files = await promises.readdir(dir);
  // Initialize an array to store the file paths
  const fileList: string[] = [];
  // Iterate through the contents of the directory
  for (const file of files) {
    // Construct the full file path
    const filePath = join(dir, file);
    // Get the file stats for the current file
    const fileStats = await promises.stat(filePath);
    // If the current file is a directory, recursively search the directory
    if (fileStats.isDirectory()) {
      fileList.push(...(await getFilesRecursive(filePath, basePath)));
    } else {
      fileList.push(basePath ? filePath.substring(basePath.length + 1) : filePath);
    }
  }
  return fileList;
}

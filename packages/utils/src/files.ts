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
  const files = await promises.readdir(dir);
  const fileList: string[] = [];
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStats = await promises.stat(filePath);
    if (fileStats.isDirectory()) {
      fileList.push(...(await getFilesRecursive(filePath, basePath)));
    } else {
      fileList.push(basePath ? filePath.substring(basePath.length + 1) : filePath);
    }
  }
  return fileList;
}

import knexSqlite, { OPEN_READONLY } from "knex-sqlite";
import * as knex from "knex";
import * as path from "path";
import sharp from "sharp";
import { getFilesRecursive } from "@yungsten/utils/src/files";
import { generatePreview } from "@yungsten/prom/src/files";
import { join } from "path";
import { Logger } from "tslog";
import { cache } from "react";
import { files } from "@yungsten/utils";
import { MEDIA_FILES_TYPES_SUPPORTED } from "../utils/constants";

/**
 * Class for interacting with a local SQLite database to store thumbnails for local media files.
 *
 * @example
 * const thumbnailDB = new ThumbnailDB();
 *
 * const filePath = '/path/to/thumbnail.png';
 * const buffer = await fs.promises.readFile(filePath);
 * await thumbnailDB.insertThumbnail(filePath, buffer);
 *
 * const filePaths = thumbnailDB.getLocalThumbnailDiff('/path/to/media/directory');
 * console.log(filePaths);
 * // Output: ['/path/to/media/directory/file1.txt', '/path/to/media/directory/subdir/file2.txt']
 */
export class ThumbnailDB {
  public k: knex.Knex;
  private logger;
  private ALLOWED_EXTENSIONS = [
    "heic",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "avi",
    "mov",
    "mp4",
  ];

  constructor() {
    this.k = knexSqlite(
      // Required: the name of your databse
      "./thumbnails.sqlite",
      // Optional: the knex constructor options
      {
        debug: true,
      }
    );
    this.createThumbnailsTable();
    this.logger = new Logger();
  }

  /**
   * Creates the "thumbnails" table in the database if it does not already exist.
   *
   * The "thumbnails" table has three columns:
   *  - "filePath": a string that represents the file path of the media file
   *  - "thumbnail": a binary column that contains the thumbnail image data
   *  - "lastUpdated": a timestamp of when the thumbnail was last updated
   *
   * @throws {Error} If an error occurs while creating the table
   *
   * @example
   * await createThumbnailsTable();
   */
  async createThumbnailsTable() {
    // Check if the "thumbnails" table exists in the database
    const hasTable = await this.k.schema.hasTable("thumbnails");

    // If the "thumbnails" table does not exist, create the table
    if (!hasTable) {
      await this.k.schema.createTable("thumbnails", (table) => {
        table.string("filePath").notNullable();
        table.binary("buffer").notNullable();
        table.timestamp("lastUpdated").defaultTo(this.k.fn.now());
      });
    }
  }

  /**
   * Inserts or updates a thumbnail in the database.
   *
   * @param {string} filePath - The file path of the thumbnail to insert or update
   * @param {Buffer} buffer - The thumbnail image data as a Buffer
   * @throws {Error} If the file path is not a valid path, the buffer is not a JPEG or PNG image, or the buffer is more than 100,000 bytes
   *
   * @example
   * const filePath = '/path/to/thumbnail.png';
   * const buffer = await fs.promises.readFile(filePath);
   * await thumbnailDB.insertThumbnail(filePath, buffer);
   */
  async insertThumbnail(filePath: string, buffer: Buffer): Promise<void> {
    // Ensure that the file path looks like a valid path
    if (!path.isAbsolute(filePath)) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    // Ensure that the buffer is a JPEG or PNG image
    const imageType = (await sharp(buffer).metadata()).format;
    if (imageType !== "jpeg" && imageType !== "png") {
      throw new Error(`Invalid image type: ${imageType}`);
    }

    // Ensure that the buffer is no more than 100,000 bytes
    if (buffer.length > 100000) {
      throw new Error(`Image too large: ${buffer.length} bytes`);
    }

    try {
      // Check if a thumbnail with the same file path already exists
      const existingThumbnail = await this.k("thumbnails")
        .where("filePath", filePath)
        .first();

      if (existingThumbnail) {
        // Update the existing thumbnail with the new buffer and lastUpdated time
        await this.k("thumbnails").where("filePath", filePath).update({
          buffer,
          lastUpdated: this.k.fn.now(),
        });
      } else {
        // Insert a new thumbnail with the file path and buffer
        await this.k("thumbnails").insert({
          filePath,
          buffer,
          lastUpdated: this.k.fn.now(),
        });
      }
    } catch (error) {
      throw new Error(`Error inserting thumbnail: ${error}`);
    }
  }

  /**
   * Retrieves a list of file paths for local media files that have not yet had thumbnails generated.
   *
   * @param {string} cacheFolder - The path to the directory containing the local media files
   * @param {string} syncFolder - The folder path from the remote that we are syncing
   * @returns {string[]} An array of file paths for local media files without thumbnails
   * @throws {Error} If the provided file path is not a valid absolute path
   *
   * @example
   * const diff = await thumbnailDB.getLocalThumbnailDiff('/path/to/media/files');
   * console.log(diff);
   * // Output: ['/path/to/media/files/video1.mp4', '/path/to/media/files/image2.png']
   */
  async getLocalThumbnailDiff(
    cacheFolder: string,
    syncFolder: string
  ): Promise<string[]> {
    // Get a list of all files within the given directory
    // files have the original cacheFolder part stripped from their paths, so filePaths will be like
    // [syncFolder/example.mp4, syncFolder/subfolder/example2.mov]
    const filePaths = (
      await getFilesRecursive(join(cacheFolder, syncFolder), cacheFolder)
    )
      .filter((filePath) => {
        // Only include files with allowed extensions
        return MEDIA_FILES_TYPES_SUPPORTED.includes(files.getExtension(filePath));
      })
      .map((f) => "/" + f);

    // Get a list of all thumbnails stored in the database
    const thumbnails = await this.k("thumbnails").select("filePath");

    // Return a list of file paths that are present in the list of files
    // but not in the list of thumbnails
    const filteredPaths = filePaths.filter((filePath) => {
      return !thumbnails.some((thumbnail) => thumbnail.filePath === filePath);
    });
    this.logger.debug(
      `must generate ${filteredPaths.length} new thumbnails from syncing folder '${syncFolder}' to system cache at '${cacheFolder}'`
    );
    return filteredPaths;
  }

  /**
   * Removes the thumbnail with the given file path from the database.
   * @param {string} filePath - The file path of the thumbnail to remove
   * @throws {Error} If the file path is invalid or there was an error deleting the thumbnail
   * @example
   * await thumbnailDB.removeThumbnail('/path/to/file.jpg');
   */
  async removeThumbnail(filePath: string): Promise<void> {
    // Ensure that the file path looks like a valid path
    if (!path.isAbsolute(filePath)) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    try {
      // Check if a thumbnail with the given file path exists in the database
      const existingThumbnail = await this.k("thumbnails")
        .where("filePath", filePath)
        .first();

      if (existingThumbnail) {
        // Remove the thumbnail from the database
        await this.k("thumbnails").where("filePath", filePath).delete();
      } else {
        // Throw an error if the thumbnail does not exist in the database
        throw new Error(`Thumbnail not found: ${filePath}`);
      }
    } catch (error) {
      throw new Error(`Error deleting thumbnail: ${error}`);
    }
  }

  /**
   * Removes thumbnail records from the database that are no longer relevant.
   *
   * @param {Date} [lookback] - The date before which thumbnail records should not be deleted.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @example
   * await purgeThumbnails();
   *
   * @example
   * await purgeThumbnails(new Date(Date.now() - 1000 * 60 * 60 * 24)); // Remove thumbnails older than 24 hours
   */
  async purgeThumbnails(
    thumbnailDB: ThumbnailDB,
    dir: string,
    lookback?: Date
  ): Promise<void> {
    // Get a list of all file paths within the given directory
    const filePaths = await getFilesRecursive(dir);

    // Query the thumbnail database for all thumbnails
    let thumbnails: { filePath: string }[] = [];
    if (lookback) {
      // If the "lookback" argument is provided, only get thumbnails that were created after the given date
      thumbnails = await thumbnailDB
        .k("thumbnails")
        .where("lastUpdated", ">=", lookback)
        .select("filePath");
    } else {
      // Otherwise, get all thumbnails
      thumbnails = await thumbnailDB.k("thumbnails").select("filePath");
    }

    // Iterate over the list of thumbnails and remove any that are not in the list of file paths
    for (const thumbnail of thumbnails) {
      if (!filePaths.includes(thumbnail.filePath)) {
        await thumbnailDB.k("thumbnails").where("filePath", thumbnail.filePath).del();
      }
    }
  }

  /**
   * Generates thumbnails for media files within the given `cacheFolder` and stores them in the database.
   * Only generates thumbnails for files that are not already in the database.
   *
   * @param {string} cacheFolder - The path to the directory containing the media files
   * @param {string} syncPath - The path to the root directory being synced
   * @returns {Promise<boolean>} A promise that resolves to `true` if the thumbnails were generated successfully, `false` otherwise
   * @throws {Error} If an error occurs while generating or inserting the thumbnails
   *
   * @example
   * const success = await thumbnailDB.generateThumbnailsLocally('/path/to/cache/folder', 'folder/on/nextcloud');
   * console.log(success);
   * // Output: true
   */
  async generateThumbnailsLocally(
    cacheFolder: string,
    syncPath: string
  ): Promise<boolean> {
    const filesToGenerate = await this.getLocalThumbnailDiff(cacheFolder, syncPath);
    for (const file of filesToGenerate) {
      const fileToGen = join(cacheFolder, file.slice(1));
      this.logger.debug(`generating media preview for file '${fileToGen}'`);
      const buffer = await generatePreview(fileToGen);
      // we store thumbnails based on absolute path
      await this.insertThumbnail(file, buffer);
      this.logger.debug(`inserted thumbnail for file '${file}'`);
    }
    return true;
  }

  /**
   * Retrieves the thumbnail image data for the specified file path.
   *
   * @param {string} nextCloudPath - The file path to retrieve the thumbnail for
   * @returns {Buffer} The thumbnail image data as a Buffer
   * @throws {Error} If the file path is not a valid path or if the thumbnail is not found in the database
   *
   * @example
   * const buffer = await thumbnailDB.getThumbnail('/path/to/thumbnail.png');
   */
  async getThumbnail(nextCloudPath: string): Promise<Buffer> {
    // Ensure that the file path looks like a valid path
    if (!path.isAbsolute(nextCloudPath)) {
      throw new Error(`Invalid file path: ${nextCloudPath}`);
    }

    try {
      // Retrieve the thumbnail from the database
      const thumbnail = await this.k("thumbnails")
        .where("filePath", nextCloudPath)
        .select("buffer")
        .first();

      if (thumbnail) {
        return thumbnail.buffer;
      } else {
        if (this.ALLOWED_EXTENSIONS.includes(nextCloudPath.split(".").pop()!)) {
          const msg = `thumbnail not found for file: ${nextCloudPath}`;
          this.logger.warn(msg);
        }
        return undefined;
      }
    } catch (error) {
      throw new Error(`Error retrieving thumbnail: ${error}`);
    }
  }
}

import Client, {
  Server,
  File,
  Folder,
  DownloadFolderCommand,
  DownloadFolderCommandOptions,
  SourceTargetFileNames,
  CommandStatus,
  CommandResultMetaData,
} from "nextcloud-node-client";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { createReadStream, createWriteStream, statSync, readdir, promises } from "fs";
import { promisify } from "util";
import { env, nextcloud, files } from "@yungsten/utils";
import { Logger } from "tslog";
import { ThumbnailDB } from "../../utils/sqlLite";
import { MEDIA_FILES_TYPES_SUPPORTED } from "../../utils/constants";

const CACHE_FOLDER_NAME = "cache";

const logger = new Logger();
const config: Server = new Server({
  url: process.env.NEXTCLOUD_URL,
  basicAuth: {
    username: process.env.NEXTCLOUD_USERNAME,
    password: process.env.NEXTCLOUD_PASSWORD,
  },
  logRequestResponse: false,
});
const thumbnailsDB = new ThumbnailDB();

const ncloud = new nextcloud.NextClient(config);
const nclient = ncloud.client;
logger.debug(
  `NEXTCLOUD CONNECTION INFO: ${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}@${process.env.NEXTCLOUD_URL}`
);
interface FileMini {
  path: string;
  preview?: Buffer;
  tags: string[];
  date: number;
}

async function recurDirDiff(
  fileList: File[],
  systemCacheFolder: string,
  syncPath: string
): Promise<File[]> {
  // get a list of file paths in the local directory
  const localFiles = await files.getFilesRecursive(
    join(systemCacheFolder, syncPath),
    systemCacheFolder
  );
  logger.debug(
    `found ${localFiles.length} local files, here are 5: \n${localFiles.slice(0, 5)}`
  );
  // return the list of file paths that exist in fileList but not in localFiles
  return fileList.filter((file) => {
    if (!localFiles.includes(file.name.slice(1))) {
      logger.debug(
        `file '${file.name}' not found from '${systemCacheFolder}' locally, will fetch!`
      );
      return true;
    } else {
      logger.debug(`file '${file.name}' exists, won't fetch`);
      return false;
    }
  });
}

export default async function fetchFolder(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // get path and user from request body parameters
    const { rawPath, options } = req.body;
    const allowedParams = req.body.options?.fileTypes ?? MEDIA_FILES_TYPES_SUPPORTED;
    logger.debug(
      `received request to fetch folder at path '${rawPath}', looking for files of type ${allowedParams}`
    );
    // get the folder at the specified path on NextCloud
    const folder = await nclient.getFolder(rawPath as string);
    if (!folder) {
      const msg = `'${rawPath}' is not a folder, or does not exist on NextCloud`;
      logger.error(msg);
      // if path is not a folder, return a 400 for bad user input
      res.status(400).send(msg);
      return;
    }
    const path = rawPath as string;
    // check if the folder exists in the `cache` directory
    const systemCacheFolder = join(process.cwd(), CACHE_FOLDER_NAME);
    const cachedFolderPath = join(systemCacheFolder, path);
    const cacheFolderExists = await promises.stat(cachedFolderPath).catch(() => false);

    // if the folder does not exist in the `cache` directory, download it
    const cacheDir = join(process.cwd(), CACHE_FOLDER_NAME);
    if (!cacheFolderExists) {
      logger.info(
        `cache folder (configured as '${cachedFolderPath}') does not exist!  creating...`
      );
      // create the `cache` directory if it does not exist
      await promises.mkdir(cacheDir, { recursive: true });

      // download the folder contents from NextCloud to the `cache` directory
      const downloadCommand = new DownloadFolderCommand(nclient, {
        sourceFolder: folder,
        filterFile: (file: File) => {
          return allowedParams === undefined ||
            allowedParams.includes(files.getExtension(file.name))
            ? file
            : null;
        },
        getTargetFileNameBeforeDownload: (fileNames: SourceTargetFileNames) =>
          `${CACHE_FOLDER_NAME}/${fileNames.sourceFileName}`,
      });
      downloadCommand.execute();
      while (!downloadCommand.isFinished()) {
        logger.debug(`downloading path '${folder.name}' from NextCloud...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (downloadCommand.getStatus() === CommandStatus.failed) {
        const msg = downloadCommand.getResultMetaData().errors;
        logger.error(msg);
        res.status(500).send({ error: msg });
        return;
      }
      const msg = `successfully cached path ${cachedFolderPath} from NextCloud`;
      await thumbnailsDB.generateThumbnailsLocally(systemCacheFolder, path);
      res.status(200).send({ msg });
      return;
    } else {
      // if the folder exists in the `cache` directory, get the list of file paths
      logger.info(`cache folder (configured as '${cacheDir}) exists`);
      const fileList = await ncloud.getRecursiveFileList(folder, (file) => {
        return allowedParams === undefined ||
          allowedParams.includes(files.getExtension(file.name))
          ? file
          : null;
      });
      logger.debug(`got ${fileList.length} files from NextCloud`);
      const filteredFileList = await recurDirDiff(fileList, systemCacheFolder, path);
      logger.info(
        `syncing ${filteredFileList.length} files from '${folder.name}' on NextCloud to '${cachedFolderPath}'`
      );
      const filteredFileIds = filteredFileList.map((f) => f.id);
      // download the needed files
      const downloadFolderCommand = new DownloadFolderCommand(nclient, {
        sourceFolder: folder,
        filterFile: (file: File) => {
          return filteredFileIds.includes(file.id) &&
            (allowedParams === undefined ||
              allowedParams.includes(files.getExtension(file.name)))
            ? file
            : null;
        },
        getTargetFileNameBeforeDownload: (fileNames: SourceTargetFileNames) => {
          return `${CACHE_FOLDER_NAME}/${fileNames.sourceFileName}`;
        },
      });
      await downloadFolderCommand.execute();
      logger.info(`successfully downloaded folder '${folder.name}' from NextCloud`);
      // build the response object
      const response: FileMini[] = [];
      for (const filex of fileList) {
        const filePath = join(CACHE_FOLDER_NAME, filex.name);
        const fileStats = statSync(filePath);
        const file: FileMini = {
          path: filex.baseName,
          preview: await thumbnailsDB.getThumbnail(filex.name), // TODO: implement getting preview of media files
          tags: await filex.getTags(), // TODO: implement getting tags of file
          date: fileStats.mtime.getTime(),
        };
        response.push(file);
      }
      await thumbnailsDB.generateThumbnailsLocally(systemCacheFolder, path);
      // send the response
      res.status(200).send(response);
    }
  } catch (error) {
    // if there was an error, send a 500 and the error message back to be a least a bit helpful
    const err = error as Error;
    logger.error(`Error: ${(err.message, err.cause, err.stack)}`);
    res.status(500).send(err.message);
  }
}

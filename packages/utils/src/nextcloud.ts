// typescript
// download folder structure asynchronously from nextcloud folder dyana/postem:
import Client, {
  Server,
  File,
  Folder,
  GetFilesRecursivelyCommand,
  GetFilesRecursivelyCommandOptions,
  SourceTargetFileNames,
  CommandStatus,
  CommandResultMetaData,
} from "nextcloud-node-client";
import { validatedEnv as env } from "./validatedEnv";
import { createLogger } from "./logging";

export class ServerConf extends Server {}

export class NextClient {
  public client: Client;
  private logger;

  constructor(client?: Client | Server) {
    this.logger = createLogger();
    if (client instanceof Client) {
      this.client = client;
    } else if (client instanceof Server) {
      this.client = new Client(client);
    } else {
      const newClient = new Client({
        url: env.NEXTCLOUD_URL,
        basicAuth: {
          username: env.NEXTCLOUD_USERNAME,
          password: env.NEXTCLOUD_PASSWORD,
        },
        logRequestResponse: true,
      });
      this.client = newClient;
    }
  }

  /**
   * Recursively generates an array of all File objects within the given directory and its subdirectories.
   *
   * @param {Folder} sourceFolder - The root directory to start the recursive file search from.
   * @param {Client} nclient - The NextCloud client instance to use for making API requests.
   * @returns {Promise<File[]>} - A promise that resolves to an array of File objects.
   *
   * @example
   * const sourceFolder = nclient.getFolder("/path/to/root/folder");
   * const fileList = await getRecursiveFileList(sourceFolder, nclient);
   * console.log(fileList);
   * // Output: [FileObj1, FileObj2, FileObjn"]
   */
  async getRecursiveFileList(
    sourceFolder: Folder,
    filterFile?: (file: File) => File | null
  ): Promise<File[]> {
    const recurseCommand = new GetFilesRecursivelyCommand(this.client, {
      sourceFolder: sourceFolder,
      filterFile: filterFile,
    });
    recurseCommand.execute();
    while (!recurseCommand.isFinished()) {
      this.logger.debug(`recusring on path '${sourceFolder.name}' from NextCloud...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const uploadResult: CommandResultMetaData = recurseCommand.getResultMetaData();
    if (recurseCommand.getStatus() === CommandStatus.failed) {
      const msg = recurseCommand.getResultMetaData().errors;
      this.logger.error(msg);
      return [];
    }
    const msg = `success for recursively querying path '${sourceFolder.name}' from NextCloud`;
    this.logger.debug(msg);
    return recurseCommand.getFiles();
  }
}

// (async () => {
//   const client = new NextClient().client;
//   const sourceFolder: Folder | null = await client.getFolder("dyana/postem");

//   const options: DownloadFolderCommandOptions = {
//     sourceFolder: sourceFolder!,
//     filterFile: (file: File): File | null => {
//       // download only PDFs
//       if (file.mime === "application/pdf") {
//         return file;
//       }
//       return null;
//     },
//     getTargetFileNameBeforeDownload: (fileNames: SourceTargetFileNames): string => {
//       return "./tmp/" + fileNames.targetFileName;
//     },
//   };
//   const command: DownloadFolderCommand = new DownloadFolderCommand(client, options);
//   command.execute();

//   while (command.isFinished() !== true) {
//     console.log(command.getPercentCompleted() + " %");
//     // wait a second
//     await (async () => {
//       return new Promise((resolve) => setTimeout(resolve, 1000));
//     })();
//   }

//   // use the result to do the needful
//   const uploadResult: CommandResultMetaData = command.getResultMetaData();

//   if (command.getStatus() === CommandStatus.success) {
//     console.log(uploadResult.messages);
//     console.log(command.getBytesDownloaded());
//   } else {
//     console.log(uploadResult.errors);
//   }

// })();

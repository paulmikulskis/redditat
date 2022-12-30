// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { env, nextcloud } from "@yungsten/utils";
import { Logger } from "tslog";
import Client, {
  File,
  Folder,
  DownloadFolderCommand,
  DownloadFolderCommandOptions,
  SourceTargetFileNames,
  CommandStatus,
  CommandResultMetaData,
} from "nextcloud-node-client";

const logger = new Logger();
const ncloud = new nextcloud.NextClient();
const nclient = ncloud.client;
type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "John Doe" });

  // Extract the event data from the request body
  const eventType = req.body.eventType;
  const eventName = req.body.eventName;
  const mapperEvent = req.body.mapperEvent;
  const workflowFile = req.body.workflowFile;

  // Check that the event is related to a file and that the tag assignment event is for the "dyana/postem" folder
  if (
    eventType === "OCA\\WorkflowEngine\\Entity\\File" &&
    mapperEvent.objectType === "files" &&
    mapperEvent.tags.includes("dyana/postem")
  ) {
    // Get the file from the Nextcloud server
    const fileData: File | null = await nclient.getFile(workflowFile.url);
    if (fileData) {
      // Download the file
      const fileBuffer = await fileData.getContent();
      // Invoke the handler function to process the file buffer
      //handler(fileBuffer);
    }
  }
}

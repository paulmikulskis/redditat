import { ISettingsParam, Logger } from "tslog";
import { createStream } from "rotating-file-stream";
import { ILogObjMeta } from "tslog/dist/types/interfaces";

// Create the stream with desired rotation options
const stream = createStream("app.log", {
  size: "3M", // rotate every 3 MegaBytes written
  interval: "3d", // rotate every 3 days
  compress: "gzip", // compress rotated files
});

// Create a default logger with the desired settings
const logger = new Logger({
  type: "pretty",
});

// Create a factory function to instantiate new loggers with the same settings and transport
const createLogger = <ILogObj>(options?: ISettingsParam<ILogObj>) => {
  const newLogger = new Logger<ILogObj>(options);
  // Attach the transport to the logger
  newLogger.attachTransport((logObj: ILogObjMeta) => {
    const message = logObj["0"];
    const meta = logObj["_meta"];
    const level = meta.logLevelName;
    const levelId = meta.logLevelId;
    const runtime = meta.runtime;
    const runtimeVersion = meta.runtimeVersion.replace("v", "");
    const hostname = meta.hostname;
    const date = meta.date;
    const fileName = meta.path?.fileName || "UNKNOWN_FILE";
    const fileLine = meta.path?.fileLine || "UNKNOWN_LINE";

    stream.write(
      JSON.stringify({
        level,
        message,
        fileName,
        fileLine,
        date,
        hostname,
        runtime,
        runtimeVersion,
        levelId,
      }) + "\n"
    );
  });
  return newLogger;
};

// Export the default logger and the factory function
export { logger, createLogger };

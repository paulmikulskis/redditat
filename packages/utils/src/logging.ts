import { Logger } from "tslog";
import { createStream } from "rotating-file-stream";

const stream = createStream("app.log", {
  size: "100M", // rotate every 10 MegaBytes written
  interval: "3d", // rotate daily
  compress: "gzip", // compress rotated files
});

const logger = new Logger({
  type: "pretty",
});

logger.attachTransport((logObj) => {
  stream.write(JSON.stringify(logObj) + "\n");
});

export { logger };

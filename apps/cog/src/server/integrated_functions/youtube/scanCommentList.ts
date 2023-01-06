import { z } from "zod";
import {
  createIntegratedFunction,
  IntegratedFunction,
  respondWith,
} from "../../utils/server_utils";
import { redis } from "@yungsten/utils";
import { ScanConfig, AuthConfig } from "../../utils/scan_config_template";

const ScanCommentList = z.object({
  config: ScanConfig,
  auth: AuthConfig,
});

type ScanCommentListType = z.TypeOf<typeof ScanCommentList>;

export const scanCommentList: IntegratedFunction = createIntegratedFunction(
  "scanCommentList",
  `scanCommentList`,
  ScanCommentList,
  async (context, body) => {
    const dispoDumpQueue = await redis.getQueue<ScanCommentListType>(
      context.mqConnection,
      "scanCommentList"
    );
    const { ...ScanCommentList } = body;

    await dispoDumpQueue.add(`${body.auth.uuid}.scanCommentList`, {
      reqBody: ScanCommentList,
      calls: null,
    });
    return respondWith(200, `added job to queue 'scanCommentList'`);
  }
);

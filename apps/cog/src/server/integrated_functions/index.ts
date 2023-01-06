import { healthcheck } from "./system/healthcheck";
import { scheduler } from "./system/scheduler";

import { scanRecentVideos } from "./youtube/scanRecentVideos";
import { scanEntireChannel } from "./youtube/scanEntireChannel";
import { scanCommunityPost } from "./youtube/scanCommunityPost";
import { scanCommentList } from "./youtube/scanCommentList";
import { scanChosenVideos } from "./youtube/scanChosenVideos";
import { checkYTAuthToken } from "./youtube/checkYTAuthToken";

import { exampleFunc } from "./exampleFunc";

export const allIntegratedFunctions = [
  healthcheck,
  scheduler,
  scanRecentVideos,
  scanEntireChannel,
  scanCommentList,
  scanCommunityPost,
  scanChosenVideos,
  checkYTAuthToken,
  exampleFunc,
];

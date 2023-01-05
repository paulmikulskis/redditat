import { createIntegratedWorker } from "../../utils/worker";
import ytpurge from "../../../server/utils/ytpurgeapi";

export const scanCommunityPost = () => {
  return createIntegratedWorker("scanCommunityPost", async ({ reqBody, _calls }) => {
    // We can't get request headers here
    const response = await ytpurge.post(
      `/scan/${reqBody.auth.uuid}`,
      {
        data: {
          settings: {
            scan_mode: "communitypost",
            ...reqBody.config,
          },
        },
      },
      {
        auth: {
          username: reqBody.auth.uuid,
          password: reqBody.auth.password,
        },
      }
    );

    //for now just log response
    console.log(response.data);
    try {
    } catch (e) {
      console.log(`ERROR while trying to request for the api`);
    }
  });
};

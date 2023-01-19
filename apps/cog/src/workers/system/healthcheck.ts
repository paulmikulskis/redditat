import { createIntegratedWorker } from "../utils/worker";
import axios from "axios";
import { sentryException } from "../../utils/sentry";

export const healthcheck = () => {
  return createIntegratedWorker("healthcheck", async ({ reqBody, _calls }) => {
    // We can't get request headers here
    const endpoint = reqBody.endpoint;

    try {
      const response = await axios.get(endpoint);

      //for now just log response
      console.log(response.data);
      return true;
    } catch (e) {
      sentryException(e as Error);
      console.log(`ERROR while trying to send healthcheck ping to '${endpoint}'`);
      return false;
    }
  });
};

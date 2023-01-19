import * as firebaseAdmin from "firebase-admin";
import { config } from "dotenv";
import { env, logging } from "@yungsten/utils";

const logger = logging.createLogger();
config({ path: "base.env" });
config({ path: ".env", override: true });
// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    const f = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(JSON.parse(env.FIREBASE_SERVICE_ACCT)),
      databaseURL: env.FIREBASE_DB_URL,
    });
    logger.info("successfully initialized firebase");
    return f;
  } catch (e) {
    logger.warn("unable to initialize firebase admin: " + e);
    return undefined;
  }
};
export default initializeFirebase;

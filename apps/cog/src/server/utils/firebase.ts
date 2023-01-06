import * as firebaseAdmin from "firebase-admin";
import { Logger } from "tslog";
import { config } from "dotenv";
import { env } from "@yungsten/utils";

const logger = new Logger();
config({ path: "base.env" });
config({ path: ".env", override: true });
// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    const f = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(JSON.parse(env.FIREBASE_SERVICE_ACCT)),
      databaseURL: env.FIREBASE_DB_URL,
    });
    logger.info("Successfully initialized firebase");
    return f;
  } catch (e) {
    logger.error("Unable to initialize firebase admin " + e);
    return undefined;
  }
};
export default initializeFirebase;

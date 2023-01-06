import { Request, Response, NextFunction } from "express";
import { respondWith } from "../utils/server_utils";
import { app } from "firebase-admin/lib/firebase-namespace-api";
import { getFirestore } from "firebase-admin/firestore";
import { env } from "@yungsten/utils";

// eslint-disable-next-line unused-imports/no-unused-vars
/**
 * Middleware for authenticating requests to the Cog API using Firebase.
 *
 * This middleware checks the `Authorization` header of incoming requests for a valid authentication token. If no
 * token is found, the request is denied with a 403 status code and an error message. If the token is in the form of a
 * Basic HTTP auth header, the middleware decodes and splits the header into a user ID and password, and checks the
 * Firebase database for a matching user record. If a match is found and the password is correct, the request is
 * allowed to proceed. If the token is not a Basic HTTP auth header, it is checked against a list of authorized keys. If
 * a match is found, the request is allowed to proceed.
 *
 * @param {app.App} firebaseAdmin - The Firebase admin app instance.
 * @returns {(req: Request, res: Response, next: NextFunction)} An Express middleware function.
 *
 * @throws {Error} If there is an error while checking the database or decoding the auth header.
 */
const authToken = (firebaseAdmin: app.App) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = getFirestore();
      const auth = req.headers.authorization;
      if (!auth || auth.length == 0) {
        return res.send(respondWith(403, `no authentication credentials found`));
      }
      if (auth.split(" ").length < 2) {
        if (env.KEYS.split(",").includes(auth)) {
          return next();
        } else {
          return res.send(respondWith(403, `key '${auth}' not valid`));
        }
      }

      if (!auth) {
        return res.send(respondWith(403, `Basic HTTP auth info not found`));
      }
      const decodedAuth = Buffer.from(auth.split(" ")[1] || "", "base64")
        .toString("utf8")
        .split(":");
      const uuid = decodedAuth[0];
      const password = decodedAuth[1];
      if (!uuid || !password)
        return res.send(respondWith(403, `User's complete auth info not found`));

      const userSnapshot = await db.collection("users").doc(uuid).get();
      if (!userSnapshot.exists) return res.send(respondWith(403, `Users not found`));

      const user = userSnapshot.data();

      if (password === user?.key) {
        return next();
      } else {
        return res.send(respondWith(403, `Invalid password credentials`));
      }
    } catch {
      return res.send(respondWith(403, `Authentication Server Error`));
    }
  };
};

export { authToken };

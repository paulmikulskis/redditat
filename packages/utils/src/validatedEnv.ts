import { z } from "zod";
import { config } from "dotenv";

// No matter what, values here will ALWAYS load from base.env unless
// the the ENVIRONMENT variable is specifically set to "production" in ".env"
const OVERRIDE_DOTENVS = [
  "SUPABSE_API_KEY",
  "SUPABASE_PSQL_URI",
  "SUPABASE_STUDIO_URL",
  "SUPABASE_API_URL",
  "SUPABASE_JWT_SECRET",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const skipOverride = (
  process.env.SKIP_OVERRIDE ? process.env.SKIP_OVERRIDE.split(",") : []
).concat(OVERRIDE_DOTENVS);
// Load base.env
const baseEnv = config({ path: "../../base.env" }).parsed || {};
// Load .env and override values in base.env
const env = config({ path: "../../.env", override: true }).parsed || {};
if (env["ENVIRONMENT"] !== "production") {
  // Overwrite environment variables from base.env with those from .env, except for the ones in skipOverride
  for (const key in process.env) {
    if (skipOverride.includes(key)) {
      // Replace the current key in process.env with the value from baseEnv
      process.env[key] = baseEnv[key];
    }
  }
}

// https://github.com/colinhacks/zod/discussions/330#discussioncomment-1625947
const stringToNumber = () =>
  z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number());
const stringToBool = () =>
  z.preprocess((a) => (a === "true" || a === "True" ? true : false), z.boolean());

export const ValidatedEnv = z.object({
  API_HOST: z.string().default("http://127.0.0.1"),
  API_PORT: stringToNumber().default("3000"),
  KEYS: z.string().default(""),
  ENVIRONMENT: z.union([z.literal("development"), z.literal("production")]),
  IAM_USER_KEY: z.string().default("--?--"),
  IAM_USER_SECRET: z.string().default("--?--"),
  DUTCHIE_GRAPHQL_URL: z.string().default("https://dutchie.com/graphql"),
  OBJECT_STORAGE_BUCKET: z.string().default("redditat"),
  MINIO_ENDPOINT: z.string().default("127.0.0.1"),
  MINIO_PORT: stringToNumber().default("9000"),
  MINIO_ACCESS_KEY: z.string().default("minio"),
  MINIO_SECRET_KEY: z.string().default("minio123"),
  UPLOAD_MINIO: stringToBool().default(true),
  UPLOAD_S3: stringToBool().default(false),
  REDDIT_BOT_REFRESH_TOKEN: z.string().min(1),
  REDDIT_BOT_CLIENT_SECRET: z.string().min(1),
  REDDIT_BOT_CLIENT_ID: z.string().min(1),
  REDDIT_BOT_USER_AGENT: z.string().min(1),
  OPEN_AI_API_KEY: z.string().default(""),
  SUPABASE_PUBLIC_KEY: z.string().min(1),
  SUPABSE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_PROJECT_URL: z.string().min(1),
  SUPABSE_API_KEY: z.string().min(1),
  SUPABASE_PSQL_URI: z.string().min(1),
});
export type ValidatedEnv = z.TypeOf<typeof ValidatedEnv>;
export const validatedEnv = ValidatedEnv.parse(process.env);

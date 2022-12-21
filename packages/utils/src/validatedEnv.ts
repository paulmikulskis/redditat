import { z } from "zod"
import { config } from "dotenv"

config({ path: "../../base.env" })
config({ path: "../../.env", override: true })
// https://github.com/colinhacks/zod/discussions/330#discussioncomment-1625947
const stringToNumber = () => z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number())
const stringToBool = () =>
  z.preprocess((a) => (a === "true" || a === "True" ? true : false), z.boolean())

export const ValidatedEnv = z.object({
  API_HOST: z.string().default("http://127.0.0.1"),
  API_PORT: stringToNumber().default("3000"),
  KEYS: z.string().default(""),
  ENVIRONMENT: z.union([z.literal("development"), z.literal("production")]),
  IAM_USER_KEY: z.string().default('--?--'),
  IAM_USER_SECRET: z.string().default('--?--'),
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
  REDDIT_BOT_USER_AGENT: z.string().min(1)
})
export type ValidatedEnv = z.TypeOf<typeof ValidatedEnv>
export const validatedEnv = ValidatedEnv.parse(process.env)

import { TextEncoder } from "util";
import { env } from "@yungsten/utils";
import { Configuration, OpenAIApi } from "openai";

export const getSizeInBytes = (obj: any) => {
  let str = null;
  if (typeof obj === "string") {
    str = obj;
  } else {
    str = JSON.stringify(obj);
  }
  const bytes = new TextEncoder().encode(str).length;
  return bytes;
};

export const getClient = () => {
  const configuration = new Configuration({
    apiKey: env.OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  return openai;
};

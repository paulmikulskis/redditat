import { TextEncoder } from "util";
import { env } from "@yungsten/utils";

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

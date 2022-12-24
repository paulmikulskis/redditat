import { request } from "@yungsten/utils/src/requests";
import { env } from "@yungsten/utils";
import openai from "openai";
import { getClient } from "./helper-funcs";
import { generateResponse } from "./completions";
export type ImageResolution = "1024x1024" | "512x512" | "256x256";

const openAiClient = getClient();

/**
 * Generates an image using the OpenAI DALL-E API.
 *
 * @param {string} prompt - The prompt for DALL-E to generate an image for.
 * @param {ImageResolution} [resolution='256x256'] - The desired resolution of the generated image.
 * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the image data.
 * @throws {Error} If the request to DALL-E fails or the response is invalid.
 */
export async function generateImage(
  prompt: string,
  resolution: ImageResolution = "1024x1024"
): Promise<Buffer | undefined> {
  const model = "image-alpha-001";
  const completion = await openAiClient.createImage({
    prompt: prompt,
    size: resolution,
    n: 1,
    response_format: "b64_json",
  });
  const data = completion.data.data[0].b64_json;
  return Buffer.from(data || "", "base64");
}

export const generateRedditPromptImage = async (
  prompt: string,
  resolution: ImageResolution = "1024x1024"
): Promise<Buffer | undefined> => {
  const dallePromptPrefix = "high-res beautiful colorful anime of";
  const promptPrefix =
    "describe in no longer than two sentences of a scene that relates to the focus of the following prompt: ";
  const promptSuffix = ".  Output the description only";
  const davinciPrompt = `${promptPrefix}${prompt} ${promptSuffix}`;
  const interpretation = await generateResponse(`${davinciPrompt}`);
  const finalPrompt = `${dallePromptPrefix} ${interpretation}`;
  if (!finalPrompt) return;
  console.log(`generating image with prompt: "${finalPrompt}"`);
  return generateImage(finalPrompt, resolution);
};

export const generateRedditPromptResponseImage = async (
  prompt: string,
  originalPrompt: string,
  resolution: ImageResolution = "1024x1024"
): Promise<Buffer | undefined> => {
  const dallePromptPrefix = "high-res beautiful colorful anime of";
  const promptPrefix =
    "output a concrete description no longer than two sentences of a scene that relates to the focus of the following idea: ";
  const promptSuffix = "Output the description only";
  const davinciPrompt = `${promptPrefix}${originalPrompt} ${prompt} ${promptSuffix}`;
  const interpretation = await generateResponse(`${davinciPrompt}`);
  const finalPrompt = `${dallePromptPrefix} ${interpretation}`;
  if (!finalPrompt) return;
  console.log(`generating image with prompt: "${finalPrompt}"`);
  return generateImage(finalPrompt, resolution);
};

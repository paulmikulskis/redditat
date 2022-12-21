import { request } from "@yungsten/redditat-utils/src/requests";
import { env } from "@yungsten/redditat-utils";

export type ImageResolution = "1024x1024" | "512x512" | "256x256";

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
  resolution: ImageResolution = "256x256"
): Promise<Buffer> {
  const model = "image-alpha-001";
  const apiKey = env.OPEN_AI_API_KEY;
  if (!apiKey) {
    throw new Error("OPEN_AI_API_KEY is not set");
  }
  const options = {
    method: "POST",
    url: "https://api.openai.com/v1/images/generations",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      prompt: prompt,
      model: model,
      size: resolution,
      response_format: "url",
    },
  };
  const response = await request(options);
  if (response.statusCode !== 200) {
    throw new Error(`Failed to generate image: ${response.statusMessage}`);
  }
  const imageUrl = response.body.data.url;
  const imageResponse = await request({
    method: "GET",
    url: imageUrl,
    responseType: "arraybuffer",
  });
  return Buffer.from(imageResponse.body);
}

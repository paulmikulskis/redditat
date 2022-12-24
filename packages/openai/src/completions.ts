import { getClient } from "./helper-funcs";

const openAiClient = getClient();

/**
 * Generates a response from the OpenAI model
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<string>} - A promise that resolves to the model's response
 * @throws {Error} - If there is an issue with the API request or response
 */
export const generateResponse = async (prompt: string): Promise<string | undefined> => {
  try {
    // Send the prompt to the model and get the response
    const response = await openAiClient.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
    });

    // Return the text of the first response choice
    return response.data?.choices[0]?.text;
  } catch (error) {
    // If there is an error, throw it so it can be handled by the caller
    throw error;
  }
};

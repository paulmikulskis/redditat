import { CommentDetails } from "../types";
import { abbreviationDictionary } from "./constants";

/**
 * Removes addendums from a piece of text or from the `text` field of each object in an array of `CommentDetails`.
 * Addendums are updates or edits to the original text that are marked with keywords such as "Edit:" or "UPDATE -".
 *
 * @template T
 * @param data - A string or an array of `CommentDetails` objects.
 * @returns The original `data` argument with any addendums removed.
 */
export function cleanAddendums<T extends string | CommentDetails[]>(data: T): T {
  // Create a regular expression that matches addendums marked with "Edit", "EDIT", "Update", "UPDATE", " -", or "-"
  const addendumRegex = /^(Edit|EDIT|Update|UPDATE)(:| -|-)\s/im;
  if (typeof data === "string") {
    // Remove addendums from a string
    return data.replace(addendumRegex, "") as T;
  } else {
    const commentDeets = data as CommentDetails[];
    // Remove addendums from the `text` field of each object in an array of `CommentDetails`
    for (const comment of commentDeets) {
      comment.text = comment.text.replace(addendumRegex, "");
      comment.replies = cleanAddendums(comment.replies);
    }
    return data;
  }
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

/**
 * Replaces all occurrences of words or phrases from a dictionary within an input string with their corresponding values from the dictionary.
 *
 * @param {string} input - The input string to search for and replace words or phrases within.
 * @param {object} swapKey - A dictionary of words or phrases to search for and their corresponding values to replace them with.
 * @return {string} A new string with all occurrences of the words or phrases from the dictionary replaced with their corresponding values.
 *
 * @example
 * let inputString = "I can't wait to see you bc I miss you so much!";
 * let abbreviationDictionary = {
 *   "bc": "because"
 * };
 * let outputString = swapDict(inputString, abbreviationDictionary);
 * console.log(outputString);  // Output: "I can't wait to see you because I miss you so much!"
 */
export const swapDict = (input: string, swapKey: Record<string, string>) => {
  let output = input;
  const dict = Object.entries(swapKey);
  for (const [key, value] of dict) {
    output = output.replace(new RegExp(escapeRegExp(key), "g"), value);
  }

  return output;
};

/**
 * Replaces all occurrences of common internet abbreviations within an input string with their corresponding full values.
 *
 * There are many common internet abbreviations that are used in text-based communication, such as "afk" for "away from keyboard"
 * or "brb" for "be right back". These abbreviations can make text messages and chat conversations more concise and easier to
 * read, but they can also be confusing or unclear to people who are unfamiliar with them.
 *
 * By running the `swapInternetSlang` function against an input string with the abbreviation dictionary containing the most common internet
 * abbreviations, we can convert the abbreviations in the input string to their corresponding full values, making the text more
 * readable and understandable to a wider audience. This can be particularly useful in situations where the input string is
 * intended for a general audience or for people who may not be familiar with internet slang and abbreviations.
 *
 * @param {string} input - The input string to search for and replace common internet abbreviations within.
 * @return {string} A new string with all occurrences of the common internet abbreviations replaced with their corresponding full values.
 *
 * @example
 * let inputString = "I can't wait to see you bc I miss you so much!";
 * let outputString = swapInternetSlang(inputString);
 * console.log(outputString);  // Output: "I can't wait to see you because I miss you so much!"
 */
export const swapInternetSlang = (input: string) => {
  return swapDict(input, abbreviationDictionary);
};

/**
 * Inserts a newline character every n characters in an input string.
 *
 * @param {string} input - The input string to insert newline characters in.
 * @param {number} every - The number of characters after which to insert a newline character.
 * @return {string} The input string with newline characters inserted every n characters.
 *
 * @example
 * let inputString = "This is a long string that needs to be broken up into multiple lines.";
 * let outputString = insertNewlinesEvery(inputString, 30);
 * console.log(outputString);
 * // Output: "This is a long string that \nneeds to be broken up into \nmultiple lines."
 */
export const insertNewlinesEvery = (input: string, every: number) => {
  let output = "";
  let currentCharCount = 0;

  for (let i = 0; i < input.length; i++) {
    output += input[i];
    currentCharCount++;
    if (currentCharCount % every === 0) {
      output += "\n";
    }
  }

  return output;
};

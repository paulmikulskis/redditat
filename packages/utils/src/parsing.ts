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

/**
 * Reassembles an input string into an output string with newline characters inserted to ensure that each line has no more than a specified maximum number of characters.
 *
 * @param {string} input - The input string to reassemble and insert newline characters in.
 * @param {number} max - The maximum number of characters allowed in each line.
 * @return {string} The input string reassembled into an output string with newline characters inserted as needed to ensure that each line has no more than the specified maximum number of characters.
 *
 * @example
 * let inputString = "This is a long string that needs to be broken up into multiple lines.";
 * let outputString = maxCharsPerLine(inputString, 30);
 * console.log(outputString);
 * // Output: "This is a long string that \nneeds to be broken up \ninto multiple lines."
 */
export const maxCharsPerLine = (input: string, max: number) => {
  let output = "";
  let currentLine = "";
  let words = input.split(" ");

  for (const word of words) {
    if (currentLine.length + word.length + 1 > max) {
      // Insert newline character and reset current line
      output += "\n" + word + " ";
      currentLine = word + " ";
    } else {
      // Concatenate word to current line
      currentLine += word + " ";
      output += word + " ";
    }
  }

  return output;
};

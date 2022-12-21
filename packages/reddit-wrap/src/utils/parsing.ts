import { CommentDetails } from "../types";

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

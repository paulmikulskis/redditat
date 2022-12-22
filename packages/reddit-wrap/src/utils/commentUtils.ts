import { Comment, RedditUser, Submission } from "snoowrap";
import { CommentDetails } from "../types";

/**
 * Returns details for the given comment.
 *
 * @param {Comment} comment - The comment to get details for.
 * @returns {Comment} The comment object with additional details.
 */
export const getCommentDetails = (comment: Comment): CommentDetails => {
  return {
    author: comment.author.name,
    authorKarma: comment.author.name !== "[deleted]" ? comment.author.link_karma : 0,
    commentKarma: comment.score,
    numReplies: comment.replies.length,
    text: comment.body,
    replies: comment.replies.map(getCommentDetails),
  };
};

/**
 * Returns the top n comments with the highest comment karma value.
 *
 * @param {CommentDetails} comments - The comments to get the top n comments from.
 * @param {number} [n=10] - The number of top comments to return.
 * @returns {CommentDetails[]} An array of the top n comments with the highest comment karma value.
 */
export const topKarma = (
  comments: CommentDetails[],
  n: number = 10
): CommentDetails[] => {
  // Sort the comments by comment karma in descending order
  const sortedComments = comments.sort((a, b) => b.commentKarma - a.commentKarma);
  // Return the first n comments
  return sortedComments.slice(0, n);
};

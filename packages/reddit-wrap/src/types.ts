export interface CommentDetails {
  author: string;
  authorKarma: number;
  commentKarma: number;
  numReplies: number;
  text: string;
  replies: CommentDetails[];
}

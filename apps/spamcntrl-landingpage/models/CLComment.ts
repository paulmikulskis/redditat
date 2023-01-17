export class CLComment {
  authorChannelID: string
  authorChannelName: string
  commentID: string
  commentText: string
  isSpam: boolean
  spamComments: number
  totalComments: number
  videoId: string
  videoTitle: string

  constructor(comment: any) {
    this.authorChannelID = comment.authorChannelID
    this.authorChannelName = comment.authorChannelName
    this.commentID = comment.commentID
    this.commentText = comment.commentText
    this.isSpam = comment.isSpam
    this.spamComments = comment.spamComments
    this.totalComments = comment.totalComments
    this.videoId = comment.videoId
    this.videoTitle = comment.videoTitle
  }
}

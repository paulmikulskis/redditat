interface ILog {
  authorChannelID: string
  authorChannelName: string
  commentID: string
  commentText: string
  isSpam: 'False' | 'True'
  matchReason: string
  originalCommentID: string
  parentAuthorChannelID: string
  textUnsanitized: string
  timestamp: Date //comment date
  uploaderChannelID: string
  uploaderChannelName: string
  videoID: string
  videoTitle: string
  date: Date //purge date
}

export default ILog

import { DocumentData } from 'firebase/firestore'

export class CLScan {
  email: string
  videos: {
    commentHighlights: {
      isSpam: boolean
      commentText: string
      authorChannelID: string
      authorChannelName: string
      commentID: string
    }[]
    spamComments: number
    totalComments: number
    videoId: string
    videoTitle: string
  }[]

  constructor(docData: DocumentData) {
    const obj = Object.values(docData)[0]
    this.email = obj.email
    this.videos = obj.videos
  }
}

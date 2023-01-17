import { CLComment } from './CLComment'
import { CLMath } from './CLMath'

export class CLVideo extends CLMath {
  commentHighlights: CLComment[]
  spamComments: number
  notSpamComments: number
  totalComments: number
  videoId: string
  videoTitle: string

  constructor(video: any) {
    super()
    this.commentHighlights = video.commentHighlights
    this.spamComments = +video.spamComments
    this.totalComments = +video.totalComments
    this.videoId = video.videoId
    this.videoTitle = video.videoTitle
    this.notSpamComments = this.totalComments - this.spamComments
  }

  getSpamPercent() {
    return this.toPercent(this.spamComments, this.totalComments)
  }

  getNotSpamPercent() {
    return this.toPercent(this.notSpamComments, this.totalComments)
  }

  getSpamPercentString(decimal: number = 2) {
    return this.toPercentString(this.spamComments, this.totalComments, decimal)
  }

  getNotSpamPercentString(decimal: number = 2) {
    return this.toPercentString(
      this.notSpamComments,
      this.totalComments,
      decimal
    )
  }
}

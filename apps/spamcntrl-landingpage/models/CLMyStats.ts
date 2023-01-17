import { CLMath } from './CLMath'
import { CLVideo } from './CLVideo'

export class CLMyStats extends CLMath {
  spamComments: number
  notSpamComments: number
  totalComments: number
  videos: CLVideo[]

  constructor() {
    super()
    this.spamComments = 0
    this.notSpamComments = 0
    this.totalComments = 0
    this.videos = []
  }

  addVideoStats(video: CLVideo) {
    this.spamComments += video.spamComments
    this.totalComments += video.totalComments
    this.notSpamComments += video.notSpamComments
    this.videos.push(video)
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

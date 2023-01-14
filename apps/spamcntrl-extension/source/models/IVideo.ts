import { ISchedulePurge } from './ISchedulePurge'

interface IVideo {
  thumbnail: string
  completed: Boolean
  name: string
  videoID: string
  videoTitle: string
  commentCount: number
  schedulePurge?: ISchedulePurge
  date?: Date
}

export default IVideo

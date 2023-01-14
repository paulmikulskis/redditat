import { ISchedulePurge } from '../models/ISchedulePurge'

export class CLPlaylist {
  title: string
  thumbnail: string
  count: number
  schedulePurge?: ISchedulePurge

  constructor(
    title: string,
    thumbnail: string,
    count: number,
    schedulePurge?: ISchedulePurge
  ) {
    this.title = title
    this.thumbnail = thumbnail
    this.count = count
    this.schedulePurge = schedulePurge
  }
}

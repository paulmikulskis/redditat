export class CLPurgingHistoryComment {
  author: string
  comment: string
  date: Date
}

export class CLPurgingHistory {
  title: string
  date: Date
  thumbnail: string

  spamComments: CLPurgingHistoryComment[]

  constructor(
    title: string,
    date: Date,
    thumbnail: string,
    spamComments: CLPurgingHistoryComment[]
  ) {
    this.title = title
    this.date = date
    this.thumbnail = thumbnail
    this.spamComments = spamComments
  }
}

export default class CLNotification {
  date: Date
  title: string
  content: string
  isRead: boolean
  linkTitle: string

  constructor(
    date: Date,
    title: string,
    content: string,
    isRead: boolean,
    linkTitle?: string
  ) {
    this.date = date
    this.title = title
    this.content = content
    this.isRead = isRead
    this.linkTitle = linkTitle ? linkTitle : 'Learn More'
  }
}

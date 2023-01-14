import _ from 'lodash'
import ILog from './ILog'
import IPurgeHistoryGroupByComment from './IPurgeHistoryGroupByComment'
import IPurgeHistoryGroupByDate from './IPurgeHistoryGroupByDate'
import IPurgeHistoryGroupByVideo from './IPurgeHistoryGroupByVideo'
import TPurgeHistorySortByKeys from './TPurgeHistorySortByKeys'

export class CLPurgeHistories {
  data: ILog[]

  constructor(data: ILog[]) {
    this.data = data
  }

  /**
   * Group by video then grouped by purge date
   * @returns array grouped by video then by purge date
   */
  getGroupedByVideo(
    sortBy: TPurgeHistorySortByKeys,
    showSpam: boolean,
    showNotSpam: boolean
  ): IPurgeHistoryGroupByVideo[] {
    if (!showSpam && !showNotSpam) {
      return []
    }

    const groupedByVideoIdArr: IPurgeHistoryGroupByVideo[] = []
    const groupedByVideoId = _.groupBy(this.data, (d) => {
      return d.videoID
    })

    _.each(Object.keys(groupedByVideoId), (key) => {
      const g = _.groupBy(groupedByVideoId[key], (d) => {
        return d.date
      })
      const arrDate: IPurgeHistoryGroupByDate[] = []
      _.each(Object.keys(g), (key2) => {
        arrDate.push({
          id: key2,
          data: g[key2],
        })
      })

      const comments: ILog[] = []

      _.each(arrDate, (d) => {
        comments.push(...d.data)
      })

      const spamComments: ILog[] = comments.filter((c) => c.isSpam == 'True')

      if (
        (showSpam || comments.length != spamComments.length) &&
        (showNotSpam || spamComments.length != 0)
      ) {
        groupedByVideoIdArr.push({
          id: key,
          dates: _.sortBy(arrDate, (d) => {
            return -d.id
          }),
        })
      }
    })

    switch (sortBy) {
      case 'count':
        return _.sortBy(groupedByVideoIdArr, (g, i) => {
          const firstVideo: ILog | null =
            g && g.dates.length > 0 && g.dates[0] && g.dates[0].data.length > 0
              ? (g.dates[0].data[0] as ILog)
              : null

          if (firstVideo == null) {
            return i
          } else {
            return -g.dates.length
          }
        })
      case 'asc':
        return _.orderBy(
          groupedByVideoIdArr,
          [
            (g, i) => {
              const firstVideo: ILog | null =
                g &&
                g.dates.length > 0 &&
                g.dates[0] &&
                g.dates[0].data.length > 0
                  ? (g.dates[0].data[0] as ILog)
                  : null

              if (firstVideo == null) {
                return i
              } else {
                return firstVideo.videoTitle.toLowerCase()
              }
            },
          ],
          ['asc']
        )
      case 'desc':
      default:
        return _.orderBy(
          groupedByVideoIdArr,
          [
            (g, i) => {
              const firstVideo: ILog | null =
                g &&
                g.dates.length > 0 &&
                g.dates[0] &&
                g.dates[0].data.length > 0
                  ? (g.dates[0].data[0] as ILog)
                  : null

              if (firstVideo == null) {
                return i
              } else {
                return firstVideo.videoTitle.toLowerCase()
              }
            },
          ],
          ['desc']
        )
    }
  }

  /**
   * Group by purge date
   * @returns array grouped by purge date
   */
  getGroupedByDate(
    sortBy: TPurgeHistorySortByKeys,
    showSpam: boolean,
    showNotSpam: boolean
  ): IPurgeHistoryGroupByDate[] {
    if (!showSpam && !showNotSpam) {
      return []
    }

    const groupedByDate = _.groupBy(this.data, (d) => {
      return d.date
    })

    const groupedByDateArr: IPurgeHistoryGroupByDate[] = []

    _.each(Object.keys(groupedByDate), (key) => {
      const grouped = groupedByDate[key]

      groupedByDateArr.push({
        id: key,
        data: grouped,
      })
    })

    switch (sortBy) {
      case 'count':
        return _.sortBy(groupedByDateArr, (d) => {
          return -d.data.length
        })
      case 'asc':
        return _.sortBy(groupedByDateArr, (d) => {
          return d.id
        })
      case 'desc':
      default:
        return _.sortBy(groupedByDateArr, (d) => {
          return -d.id
        })
    }
  }

  /**
   * Group by comment
   * @returns array grouped by comment
   */
  getGroupedByComment(
    sortBy: TPurgeHistorySortByKeys,
    showSpam: boolean,
    showNotSpam: boolean
  ): IPurgeHistoryGroupByComment[] {
    if (!showSpam && !showNotSpam) {
      return []
    }

    const groupedByCommentArr: IPurgeHistoryGroupByComment[] = []
    const groupedByComment = _.groupBy(this.data, (d) => {
      return d.commentText
    })

    console.log('log: groupedByComment', groupedByComment)

    _.each(Object.keys(groupedByComment), (key) => {
      const g = _.groupBy(groupedByComment[key], (d) => {
        return d.date
      })
      const arrDate: IPurgeHistoryGroupByDate[] = []
      _.each(Object.keys(g), (key2) => {
        arrDate.push({
          id: key2,
          data: g[key2],
        })
      })

      const comments: ILog[] = []

      _.each(arrDate, (d) => {
        comments.push(...d.data)
      })

      const spamComments: ILog[] = comments.filter((c) => c.isSpam == 'True')

      if (
        (showSpam || comments.length != spamComments.length) &&
        (showNotSpam || spamComments.length != 0)
      ) {
        groupedByCommentArr.push({
          id: key,
          dates: _.sortBy(arrDate, (d) => {
            return -d.id
          }),
        })
      }
    })

    switch (sortBy) {
      case 'count':
        return _.sortBy(groupedByCommentArr, (g) => {
          let totalComments = 0

          _.each(g.dates, (d) => {
            totalComments += d.data.length
          })

          return -totalComments
        })
      case 'asc':
        return _.orderBy(
          groupedByCommentArr,
          [
            (g) => {
              return g.id.toLowerCase()
            },
          ],
          ['asc']
        )
      case 'desc':
      default:
        return _.orderBy(
          groupedByCommentArr,
          [
            (g) => {
              return g.id.toLowerCase()
            },
          ],
          ['desc']
        )
    }
  }
}

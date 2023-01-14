import React, { useState } from 'react'
import ILog from '../models/ILog'
import IPurgeHistoryGroupByVideo from '../models/IPurgeHistoryGroupByVideo'
import { CLPurgeHistories } from '../models/CLPurgeHistories'
import TPurgeHistorySortByKeys from '../models/TPurgeHistorySortByKeys'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'
import {
  getPurgeHistoryFilterByNotSpam,
  getPurgeHistoryFilterBySpam,
} from '../store/slices/purgeHistorySlice'
import IPurgeHistoryGroupByDate from '../models/IPurgeHistoryGroupByDate'
import { getYoutubeImageFromVideoId } from '../utils'

interface CPurgeHistoryGroupByCommentRowProps {
  firstComment: ILog
  data: ILog[]
  datesData: IPurgeHistoryGroupByDate[]
}
const CPurgeHistoryGroupByCommentRow: React.FC<CPurgeHistoryGroupByCommentRowProps> =
  ({ data, firstComment, datesData }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const showSpam = getPurgeHistoryFilterBySpam()
    const showNotSpam = getPurgeHistoryFilterByNotSpam()

    const allComments = data
    const allSpamComments = data.filter((d) => d.isSpam == 'True')

    const isConsideredSpam = allSpamComments.length / allComments.length >= 0.5

    return (
      <>
        <div
          className={classNames(
            isOpen ? 'bg-slate-100' : '',
            'mx-2 px-3 pt-3 rounded'
          )}
        >
          <div className="flex">
            <span className="flex-1 flex flex-col text-xs font-bold text-gray-600 h-auto">
              <div className="text-gray-400">
                Spam: {data.filter((data) => data.isSpam == 'True').length}/
                {data.length}
              </div>
              <div
                className={classNames(
                  'mt-1',
                  isConsideredSpam ? 'line-through' : ''
                )}
              >
                {firstComment.commentText}
              </div>
            </span>
            <span className="flex-initial ml-2">
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              )}
            </span>
          </div>
          {isOpen && datesData && datesData.length > 0 && (
            <div className="mb-1 mt-3 flex flex-col">
              {datesData.map((dD) => {
                const comments = dD.data
                const spamComments = comments.filter(
                  (comment) => comment.isSpam == 'True'
                )

                if (!showSpam && comments.length == spamComments.length) {
                  return null
                }

                if (!showNotSpam && spamComments.length == 0) {
                  return null
                }

                return (
                  <div className="flex flex-col my-4">
                    <div className="flex items-center">
                      <span className="flex-1 border-t border-t-black"></span>
                      <span className="flex-initial mx-2 text-xs font-bold text-gray-600">
                        Scanned on{' '}
                        {moment(dD.id, 'X').format('MM/DD/YY HH:mm a')}
                      </span>
                      <span className="flex-1 border-t border-t-black"></span>
                    </div>
                    <div className="flex justify-center items-center text-gray-400 font-bold text-xs">
                      Spam: {spamComments.length} / {comments.length}
                    </div>
                    <div className="flex flex-col">
                      {comments &&
                        comments.length > 0 &&
                        comments
                          .filter((comment) => {
                            if (showSpam && comment.isSpam == 'True') {
                              return true
                            }

                            if (showNotSpam && comment.isSpam == 'False') {
                              return true
                            }

                            return false
                          })
                          .map((comment) => {
                            return (
                              <div
                                className="flex flex-col my-3 px-2"
                                key={comment.commentID}
                              >
                                <div className="flex flex-wrap">
                                  {comment.isSpam == 'True' && (
                                    <span className="mr-2 flex items-center justify-center rounded bg-red-500 text-white px-2">
                                      spam
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-600 mr-1">
                                    by
                                  </span>
                                  <span className="font-bold text-gray-600">
                                    {comment.authorChannelName}
                                  </span>
                                  <span className="ml-2 text-xs font-semibold text-gray-400">
                                    {moment(comment.timestamp).fromNow()}
                                  </span>
                                  <span className="text-xs text-gray-600 ml-1">
                                    on
                                  </span>
                                </div>
                                <div className="mt-2 flex">
                                  <span className="flex-initial mr-2 w-12 h-8 flex items-center">
                                    <img
                                      className="w-12 h-8 rounded-md"
                                      src={getYoutubeImageFromVideoId(
                                        comment.videoID
                                      )}
                                    />
                                  </span>
                                  <span className="flex-1 flex flex-col text-xs font-bold text-gray-600 line-clamp-2">
                                    {comment.videoTitle}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </>
    )
  }

export interface CPurgeHistoryGroupByCommentProps {
  purgeHistories: ILog[] | undefined | null
  sortBy: TPurgeHistorySortByKeys
}
const defaultProps: CPurgeHistoryGroupByCommentProps = {
  purgeHistories: [],
  sortBy: 'count',
}

const CPurgeHistoryGroupByComment: React.FC<CPurgeHistoryGroupByCommentProps> =
  ({ purgeHistories, sortBy }) => {
    const showSpam = getPurgeHistoryFilterBySpam()
    const showNotSpam = getPurgeHistoryFilterByNotSpam()

    const purgeHistoriesGroupedByVideo: IPurgeHistoryGroupByVideo[] =
      purgeHistories && purgeHistories.length > 0
        ? new CLPurgeHistories(purgeHistories).getGroupedByComment(
            sortBy,
            showSpam,
            showNotSpam
          )
        : []

    return (
      <div className="overflow-y-auto pb-5 space-y-4">
        {purgeHistoriesGroupedByVideo &&
          purgeHistoriesGroupedByVideo.length == 0 && (
            <div className="px-5">
              <h2 className="text-2xl font-bold text-primary-400">
                No History Found!
              </h2>
              <p className="mt-1 font-semibold text-sm text-primary-300">
                Search result is empty.
              </p>
            </div>
          )}

        {purgeHistoriesGroupedByVideo &&
          purgeHistoriesGroupedByVideo.length > 0 && (
            <>
              {purgeHistoriesGroupedByVideo.map((groupedByVideo) => {
                const firstComment =
                  groupedByVideo.dates && groupedByVideo.dates.length > 0
                    ? _.sortBy(groupedByVideo.dates, (d) => {
                        return -d.id
                      })[0].data[0]
                    : null
                const comments: ILog[] = []
                _.each(groupedByVideo.dates, (d) => {
                  comments.push(...d.data)
                })

                if (firstComment == null) {
                  return null
                } else {
                  return (
                    <CPurgeHistoryGroupByCommentRow
                      key={groupedByVideo.id}
                      firstComment={firstComment}
                      datesData={groupedByVideo.dates}
                      data={comments}
                    />
                  )
                }
              })}
            </>
          )}
      </div>
    )
  }

CPurgeHistoryGroupByComment.defaultProps = defaultProps
export default CPurgeHistoryGroupByComment

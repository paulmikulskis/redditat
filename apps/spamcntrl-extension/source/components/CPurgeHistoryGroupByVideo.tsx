import React, { useState } from 'react'
import ILog from '../models/ILog'
import IPurgeHistoryGroupByVideo from '../models/IPurgeHistoryGroupByVideo'
import { CLPurgeHistories } from '../models/CLPurgeHistories'
import TPurgeHistorySortByKeys from '../models/TPurgeHistorySortByKeys'
import _ from 'lodash'
import { getYoutubeImageFromVideoId } from '../utils'
import moment from 'moment'
import classNames from 'classnames'
import {
  getPurgeHistoryFilterByNotSpam,
  getPurgeHistoryFilterBySpam,
} from '../store/slices/purgeHistorySlice'
import IPurgeHistoryGroupByDate from '../models/IPurgeHistoryGroupByDate'

interface CPurgeHistoryGroupByVideoRowProps {
  video: ILog
  data: ILog[]
  datesData: IPurgeHistoryGroupByDate[]
}
const CPurgeHistoryGroupByVideoRow: React.FC<CPurgeHistoryGroupByVideoRowProps> =
  ({ data, video, datesData }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const showSpam = getPurgeHistoryFilterBySpam()
    const showNotSpam = getPurgeHistoryFilterByNotSpam()

    return (
      <>
        <div
          className={classNames(
            isOpen ? 'bg-slate-100' : '',
            'mx-2 px-3 pt-3 rounded'
          )}
        >
          <div className="flex">
            <span className="flex-initial mr-2 w-12 h-8 flex items-center">
              <img
                className="w-12 h-8 rounded-md"
                src={getYoutubeImageFromVideoId(video.videoID)}
              />
            </span>
            <span className="flex-1 flex flex-col text-xs font-bold text-gray-600 truncate">
              <div className="truncate">{video.videoTitle}</div>
              <div className="text-gray-400">
                Spam: {data.filter((data) => data.isSpam == 'True').length}/
                {data.length}
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
                                  <span className="font-bold text-gray-600">
                                    {comment.authorChannelName}
                                  </span>
                                  <span className="ml-2 text-xs font-semibold text-gray-400">
                                    {moment(comment.timestamp).fromNow()}
                                  </span>
                                </div>
                                <div
                                  className={`text-xs mt-1 text-gray-600 ${
                                    comment.isSpam == 'True'
                                      ? 'line-through'
                                      : ''
                                  }`}
                                >
                                  {comment.commentText}
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

export interface CPurgeHistoryGroupByVideoProps {
  purgeHistories: ILog[] | undefined | null
  sortBy: TPurgeHistorySortByKeys
}
const defaultProps: CPurgeHistoryGroupByVideoProps = {
  purgeHistories: [],
  sortBy: 'desc',
}

const CPurgeHistoryGroupByVideo: React.FC<CPurgeHistoryGroupByVideoProps> = ({
  purgeHistories,
  sortBy,
}) => {
  const showSpam = getPurgeHistoryFilterBySpam()
  const showNotSpam = getPurgeHistoryFilterByNotSpam()

  const purgeHistoriesGroupedByVideo: IPurgeHistoryGroupByVideo[] =
    purgeHistories && purgeHistories.length > 0
      ? new CLPurgeHistories(purgeHistories).getGroupedByVideo(
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

      {purgeHistoriesGroupedByVideo && purgeHistoriesGroupedByVideo.length > 0 && (
        <>
          {purgeHistoriesGroupedByVideo.map((groupedByVideo) => {
            const firstVideo =
              groupedByVideo.dates && groupedByVideo.dates.length > 0
                ? _.sortBy(groupedByVideo.dates, (d) => {
                    return -d.id
                  })[0].data[0]
                : null
            const comments: ILog[] = []
            _.each(groupedByVideo.dates, (d) => {
              comments.push(...d.data)
            })

            if (firstVideo == null) {
              return null
            } else {
              return (
                <CPurgeHistoryGroupByVideoRow
                  key={groupedByVideo.id}
                  video={firstVideo}
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

CPurgeHistoryGroupByVideo.defaultProps = defaultProps
export default CPurgeHistoryGroupByVideo

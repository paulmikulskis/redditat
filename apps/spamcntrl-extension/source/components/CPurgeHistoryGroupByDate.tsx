import React, { useState } from 'react'
import ILog from '../models/ILog'

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

interface CPurgeHistoryGroupByDateRowProps {
  dateData: IPurgeHistoryGroupByDate
  comments: ILog[]
  spamComments: ILog[]
}
const CPurgeHistoryGroupByDateRow: React.FC<CPurgeHistoryGroupByDateRowProps> =
  ({ dateData, comments, spamComments }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const showSpam = getPurgeHistoryFilterBySpam()
    const showNotSpam = getPurgeHistoryFilterByNotSpam()

    return (
      <div
        className={classNames(
          isOpen ? 'bg-slate-100' : '',
          'flex flex-col my-4 mb-1 mt-3 mx-2 px-3 rounded pt-3'
        )}
      >
        <div className="flex items-center">
          <span className="flex-1 border-t border-t-black"></span>
          <span className="flex-initial mx-2 text-xs font-bold text-gray-600">
            Scanned on {moment(dateData.id, 'X').format('MM/DD/YY HH:mm a')}
          </span>
          <span className="flex-1 border-t border-t-black"></span>
        </div>
        <div className="flex justify-center items-center text-gray-400 font-bold text-xs relative">
          Spam: {spamComments.length} / {comments.length}
          <span className="flex-initial absolute right-0 text-black">
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
        {isOpen && (
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
                          comment.isSpam == 'True' ? 'line-through' : ''
                        }`}
                      >
                        {comment.commentText}
                      </div>
                    </div>
                  )
                })}
          </div>
        )}
      </div>
    )
  }

export interface CPurgeHistoryGroupByDateProps {
  purgeHistories: ILog[] | undefined | null
  sortBy: TPurgeHistorySortByKeys
}
const defaultProps: CPurgeHistoryGroupByDateProps = {
  purgeHistories: [],
  sortBy: 'desc',
}

const CPurgeHistoryGroupByDate: React.FC<CPurgeHistoryGroupByDateProps> = ({
  purgeHistories,
  sortBy,
}) => {
  const showSpam = getPurgeHistoryFilterBySpam()
  const showNotSpam = getPurgeHistoryFilterByNotSpam()

  const purgeHistoriesGroupedByDate: IPurgeHistoryGroupByDate[] =
    purgeHistories && purgeHistories.length > 0
      ? new CLPurgeHistories(purgeHistories).getGroupedByDate(
          sortBy,
          showSpam,
          showNotSpam
        )
      : []

  return (
    <div className="overflow-y-auto pb-5 space-y-4">
      {purgeHistoriesGroupedByDate && purgeHistoriesGroupedByDate.length == 0 && (
        <div className="px-5">
          <h2 className="text-2xl font-bold text-primary-400">
            No History Found!
          </h2>
          <p className="mt-1 font-semibold text-sm text-primary-300">
            Search result is empty.
          </p>
        </div>
      )}

      {purgeHistoriesGroupedByDate &&
        purgeHistoriesGroupedByDate.length > 0 &&
        purgeHistoriesGroupedByDate.map((groupedByDate) => {
          const comments = groupedByDate.data
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
            <CPurgeHistoryGroupByDateRow
              dateData={groupedByDate}
              comments={comments}
              spamComments={spamComments}
            />
          )
        })}
    </div>
  )
}

CPurgeHistoryGroupByDate.defaultProps = defaultProps
export default CPurgeHistoryGroupByDate

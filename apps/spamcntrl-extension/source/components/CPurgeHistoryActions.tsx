import React from 'react'
import { useDispatch } from 'react-redux'
import { IDropdownMenuItem } from '../models'
import TPurgeHistoryGroupByKeys from '../models/TPurgeHistoryGroupByKeys'
import TPurgeHistorySortByKeys from '../models/TPurgeHistorySortByKeys'
import {
  getPurgeHistoryFilterByNotSpam,
  getPurgeHistoryFilterBySpam,
  getPurgeHistoryGroupBy,
  getPurgeHistorySortBy,
  setGroupBy,
  setNotSpam,
  setSortBy,
  setSpam,
} from '../store/slices/purgeHistorySlice'
import CDropdownAction from './CDropdownAction'

export interface CPurgeHistoryActionsProps {}
const defaultProps: CPurgeHistoryActionsProps = {}

const CPurgeHistoryActions: React.FC<CPurgeHistoryActionsProps> = ({}) => {
  const dispatch = useDispatch()

  //groupBy
  const groupBy = getPurgeHistoryGroupBy()

  function onClickGroupBy(action: IDropdownMenuItem) {
    dispatch(setGroupBy(action.key as TPurgeHistoryGroupByKeys))

    //set default sort every time group by is changed
    const groupBy = action.key as TPurgeHistoryGroupByKeys
    switch (groupBy) {
      case 'comments':
        dispatch(setSortBy('count'))
        break
      case 'date':
        dispatch(setSortBy('desc'))
        break
      case 'video':
        dispatch(setSortBy('count'))
        break
    }

    //set default filter every time groupby is changed
    dispatch(setNotSpam(true))
    dispatch(setSpam(true))
  }

  //sortBy
  const sortBy = getPurgeHistorySortBy()

  function onClickSortBy(action: IDropdownMenuItem) {
    dispatch(setSortBy(action.key as TPurgeHistorySortByKeys))
  }

  //filterBy
  const filterBySpam = getPurgeHistoryFilterBySpam()
  const filterByNotSpam = getPurgeHistoryFilterByNotSpam()

  function onClickFilterBySpam() {
    dispatch(setSpam(!filterBySpam))
  }

  function onClickFilterByNotSpam() {
    dispatch(setNotSpam(!filterByNotSpam))
  }

  return (
    <div className="flex justify-end w-full">
      <span className="mr-1">
        <CDropdownAction
          selected={groupBy}
          onClickDropdown={onClickGroupBy}
          actions={[
            { key: 'video', title: 'Video' },
            { key: 'date', title: 'Date' },
            { key: 'comments', title: 'Comments' },
          ]}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          }
        />
      </span>
      <span className="mr-1">
        <CDropdownAction
          selected={sortBy}
          onClickDropdown={onClickSortBy}
          actions={[
            { key: 'asc', title: 'Ascending' },
            { key: 'desc', title: 'Descending' },
            { key: 'count', title: 'Popular' },
          ]}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          }
        />
      </span>
      <span>
        <CDropdownAction
          actions={[
            {
              key: 'spam',
              title: (
                <div className="flex w-full items-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer mr-2 w-4 h-4 rounded pointer-events-none"
                    checked={filterBySpam}
                  />{' '}
                  Spam
                </div>
              ),
              onClick: () => {
                onClickFilterBySpam()
              },
              hideOnClick: false,
            },
            {
              key: 'notspam',
              title: (
                <div className="flex w-full items-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer mr-2 w-4 h-4 rounded pointer-events-none"
                    checked={filterByNotSpam}
                  />{' '}
                  Not Spam
                </div>
              ),
              onClick: () => {
                onClickFilterByNotSpam()
              },
              hideOnClick: false,
            },
          ]}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
          }
        />
      </span>
    </div>
  )
}

CPurgeHistoryActions.defaultProps = defaultProps
export default CPurgeHistoryActions

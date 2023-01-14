import React, { useContext } from 'react'
import { AppContext } from '../context'
import {
  getPurgeHistories,
  getPurgeHistoryLoading,
} from '../store/slices/purgeHistorySlice'
import CLinkButton from './CLinkButton'
import CLoader from './CLoader'
import { ResponsiveBar } from '@nivo/bar'
import _ from 'lodash'
import ILog from '../models/ILog'

interface CTop5SpamCommentsWidgetProps {}
const defaultProps: CTop5SpamCommentsWidgetProps = {}

const CTop5SpamCommentsWidget: React.FC<CTop5SpamCommentsWidgetProps> =
  ({}) => {
    const { setActiveNavbarKey } = useContext(AppContext)

    function onClickSeePurgingHistory() {
      setActiveNavbarKey && setActiveNavbarKey('purging')
    }

    const loading = getPurgeHistoryLoading()
    const purgeHistories = getPurgeHistories()

    const spams = purgeHistories?.filter((p) => p.isSpam == 'True')

    const grouped = _.groupBy(spams, (p) => {
      return p.commentText
    })
    let groupedArr: { key: string; value: number }[] = []
    if (grouped && Object.keys(grouped).length > 0) {
      _.each(Object.keys(grouped), (key) => {
        const items = grouped[key] as ILog[]
        groupedArr.push({ key: key, value: items.length })
      })
      groupedArr = _.sortBy(groupedArr, (g) => {
        return g.value
      }).slice(0, 5)
    }

    return (
      <>
        <div className="px-5 pt-5 flex flex-col justify-start">
          <div className="text-base font-bold">Top 5 Spam Comments</div>
        </div>

        {loading ? (
          <CLoader show inline />
        ) : (
          <>
            {groupedArr && groupedArr.length > 0 ? (
              <div>
                <div className="flex px-4 w-full flex-wrap justify-around items-center h-52 text-xs">
                  <ResponsiveBar
                    data={groupedArr}
                    indexBy="key"
                    layout="horizontal"
                    colors={() => '#FF4B4B'}
                    labelTextColor="#FFF"
                    enableGridX={false}
                    enableGridY={false}
                    tooltip={(d) => (
                      <div className="text-xs p-2 bg-white shadow shadow-gray-300">
                        {d.data.key}
                      </div>
                    )}
                  />
                </div>
                <div className="px-4 flex justify-end mb-8 mt-2">
                  <CLinkButton onClick={onClickSeePurgingHistory}>
                    ...See your purging history here
                  </CLinkButton>
                </div>
              </div>
            ) : (
              <div className="px-5 mb-8">
                <h2 className="text-2xl font-bold text-primary-400">
                  No History Found!
                </h2>
                <p className="mt-1 font-semibold text-sm text-primary-300">
                  Scan your videos' comments...
                </p>
              </div>
            )}
          </>
        )}
      </>
    )
  }

CTop5SpamCommentsWidget.defaultProps = defaultProps
export default CTop5SpamCommentsWidget

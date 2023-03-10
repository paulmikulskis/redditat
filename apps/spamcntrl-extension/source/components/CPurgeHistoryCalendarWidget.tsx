import React, { useContext } from 'react'
import { ResponsiveTimeRange } from '@nivo/calendar'
import _ from 'lodash'
import moment from 'moment'
import {
  getPurgeHistories,
  getPurgeHistoryLoading,
} from '../store/slices/purgeHistorySlice'
import CLinkButton from './CLinkButton'
import { AppContext } from '../context'
import CLoader from './CLoader'

interface CPurgeHistoryCalendarWidgetProps {}
const defaultProps: CPurgeHistoryCalendarWidgetProps = {}

const CPurgeHistoryCalendarWidget: React.FC<CPurgeHistoryCalendarWidgetProps> =
  ({}) => {
    const { setActiveNavbarKey } = useContext(AppContext)

    function onClickSeePurgingHistory() {
      setActiveNavbarKey && setActiveNavbarKey('purging')
    }

    const loading = getPurgeHistoryLoading()
    const purgeHistories = getPurgeHistories()

    const purgeHistoriesGroupedByDate = _.groupBy(purgeHistories, (p) => p.date)
    const purgeHistoriesData = purgeHistories
      ? _.map(Object.keys(purgeHistoriesGroupedByDate), (key) => {
          return {
            value: purgeHistoriesGroupedByDate[key].length,
            day: moment(key, 'X').format('YYYY-MM-DD'),
          }
        })
      : []

    return (
      <>
        <div className="px-5 pt-5 flex flex-col justify-start">
          <div className="text-base font-bold">
            Comments Scanned in the Last 5 Months
          </div>
        </div>

        {loading ? (
          <CLoader show inline />
        ) : (
          <>
            {purgeHistories && purgeHistories.length > 0 ? (
              <div>
                <div className="flex px-4 w-full flex-wrap justify-around items-center h-28 text-xs">
                  <ResponsiveTimeRange
                    square={true}
                    data={purgeHistoriesData}
                    from={moment().subtract(5, 'months').format('YYYY-MM-DD')}
                    to={moment().format('YYYY-MM-DD')}
                    emptyColor="#eeeeee"
                    colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    dayBorderWidth={2}
                    dayBorderColor="#ffffff"
                    legendFormat={() => ''}
                    monthLegend={() => ''}
                    weekdayLegendOffset={0}
                    weekdayTicks={[]}
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

CPurgeHistoryCalendarWidget.defaultProps = defaultProps
export default CPurgeHistoryCalendarWidget

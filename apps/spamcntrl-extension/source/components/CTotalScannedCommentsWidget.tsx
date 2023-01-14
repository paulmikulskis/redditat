import React, { useContext } from 'react'
import { AppContext } from '../context'
import {
  getPurgeHistories,
  getPurgeHistoryLoading,
} from '../store/slices/purgeHistorySlice'
import CLinkButton from './CLinkButton'
import CLoader from './CLoader'
import { ResponsivePie } from '@nivo/Pie'
import _ from 'lodash'

interface CTotalScannedCommentsWidgetProps {}
const defaultProps: CTotalScannedCommentsWidgetProps = {}

const CTotalScannedCommentsWidget: React.FC<CTotalScannedCommentsWidgetProps> =
  ({}) => {
    const { setActiveNavbarKey } = useContext(AppContext)

    function onClickSeePurgingHistory() {
      setActiveNavbarKey && setActiveNavbarKey('purging')
    }

    const loading = getPurgeHistoryLoading()
    const purgeHistories = getPurgeHistories()

    const spams = purgeHistories?.filter((p) => p.isSpam == 'True')
    const notSpams = purgeHistories?.filter((p) => p.isSpam == 'False')

    const data = [
      {
        key: 'spam',
        label: 'Spam',
        value: spams?.length,
        color: '#FB5A5A',
      },
      {
        key: 'notSpam',
        label: 'Not Spam',
        value: notSpams?.length,
        color: '#6BDFF5',
      },
    ]

    return (
      <>
        <div className="px-5 pt-5 flex flex-col justify-start">
          <div className="text-base font-bold">Total Scanned Comments</div>
        </div>

        {loading ? (
          <CLoader show inline />
        ) : (
          <>
            {purgeHistories && purgeHistories.length > 0 ? (
              <div>
                <div className="flex px-4 w-full flex-wrap justify-around items-center h-52 text-xs">
                  <ResponsivePie
                    colors={(d: any) => d.data.color}
                    id={'label'}
                    data={data}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={2}
                    borderWidth={1}
                    borderColor={{
                      from: 'color',
                      modifiers: [['darker', 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                      from: 'color',
                      modifiers: [['darker', 2]],
                    }}
                    enableArcLinkLabels={false}
                    legends={[
                      {
                        anchor: 'bottom-left',
                        direction: 'column',
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemsSpacing: 0,
                        symbolSize: 20,
                        itemDirection: 'left-to-right',
                      },
                    ]}
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

CTotalScannedCommentsWidget.defaultProps = defaultProps
export default CTotalScannedCommentsWidget

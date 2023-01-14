import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { AppContext } from '../context'
import { getOngoingPurgeSearchResults } from '../store/slices/ongoingPurgeSlice'

import { getURL } from '../utils'
import CDropdownButton from './CDropdownButton'
import CIconButton from './CIconButton'
import CVideoBox from './CVideoBox'

interface COngoingPurgePageProps {}
const defaultProps: COngoingPurgePageProps = {}

const COngoingPurgePage: React.FC<COngoingPurgePageProps> = ({}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)

  const ongoingPurgeSearchResults = getOngoingPurgeSearchResults()

  return (
    <div>
      <div className="w-full flex justify-between">
        <span className="w-full flex items-center h-full">
          <span className="mr-2 flex items-center h-full">
            <CIconButton
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey('purging')
              }}
              icon={<img src={getURL('assets/icons/arrow-back.svg')} />}
            />
          </span>
          <span className="font-bold text-title text-txt flex items-center h-full">
            Ongoing Purge - {ongoingPurgeSearchResults.length}
          </span>
        </span>
        <span>
          <CDropdownButton
            buttonStyle="alt"
            text={'Ongoing'}
            menuOptions={[
              { key: 'ongoing', title: 'Ongoing' },
              { key: 'paused', title: 'Paused' },
              { key: 'cancelled', title: 'Cancelled' },
            ]}
          />
        </span>
      </div>

      {/* My Videos */}
      <div className="mt-3 w-full grid grid-cols-3 gap-[9px]">
        {ongoingPurgeSearchResults.map((video) => {
          return (
            <CVideoBox
              key={video.videoID}
              img={video.thumbnail}
              title={video.videoTitle}
              type={'ongoing'}
            />
          )
        })}
      </div>
    </div>
  )
}

COngoingPurgePage.defaultProps = defaultProps
export default COngoingPurgePage

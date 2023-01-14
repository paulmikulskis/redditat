import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { getSinglePurgeList } from '../store/slices/singlePurgeSlice'

import CCheckoutButton from './CCheckoutButton'
import CVideoBox from './CVideoBox'
import CVideoPicker from './CVideoPicker'

interface CSinglePurgePageProps {}
const defaultProps: CSinglePurgePageProps = {}

const CSinglePurgePage: React.FC<CSinglePurgePageProps> = ({}) => {
  const singlePurgeList = getSinglePurgeList()

  return (
    <div className="w-full">
      <div className="font-bold text-title text-txt flex items-center h-full">
        Single Purge
      </div>

      <div className="mt-3">
        <CVideoPicker />
      </div>

      {/* My Videos */}
      <div className="mt-3">
        <div className="font-bold text-title text-txt flex items-center h-full">
          Added Videos - {singlePurgeList.length}
        </div>
        <div className="mt-2 w-full grid grid-cols-3 gap-[9px]">
          {singlePurgeList.map((video) => {
            return (
              <CVideoBox
                key={video.videoID}
                img={video.thumbnail}
                title={video.videoTitle}
                hasDelete
                type="view"
                date={video.date}
              />
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center w-full">
        <CCheckoutButton
          text="Buy Now $9.99"
          buttonStyle="primary"
          confirmHeader={`Single Purge - ${singlePurgeList.length}`}
          confirmText={'Buy Now - $1.99'}
          style={{ width: '120px' }}
        />
      </div>
    </div>
  )
}

CSinglePurgePage.defaultProps = defaultProps
export default CSinglePurgePage

import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useDispatch } from 'react-redux'
import { AppContext } from '../context'
import {
  getMyVideosSearchResults,
  getMyVideosSearchText,
  setMyVideosSearchText,
} from '../store/slices/myVideosSlice'

import { getURL } from '../utils'
import CIconButton from './CIconButton'
import CInput from './CInput'
import CSearchIcon from './CSearchIcon'
import CVideoBox from './CVideoBox'

interface CMyVideosPageProps {}
const defaultProps: CMyVideosPageProps = {}

const CMyVideosPage: React.FC<CMyVideosPageProps> = ({}) => {
  const dispatch = useDispatch()

  const { setActiveNavbarKey } = React.useContext(AppContext)

  const myVideosSearchText = getMyVideosSearchText()
  const myVideosSearchResults = getMyVideosSearchResults()

  return (
    <div>
      <div className="flex justify-between">
        <span className="flex items-center h-full">
          <span className="mr-2 flex items-center h-full">
            <CIconButton
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey('purging')
              }}
              icon={<img src={getURL('assets/icons/arrow-back.svg')} />}
            />
          </span>
          <span className="font-bold text-title text-txt flex items-center h-full">
            My Videos - {myVideosSearchResults.length}
          </span>
        </span>
      </div>

      <div className="mt-3 flex">
        <CInput
          onChange={(e) => dispatch(setMyVideosSearchText(e.target.value))}
          icon={<CSearchIcon />}
          value={myVideosSearchText}
          placeholder={'Search videos...'}
        />
      </div>

      {/* My Videos */}
      <div className="my-3 w-full grid grid-cols-3 gap-[9px]">
        {myVideosSearchResults.map((video) => {
          return (
            <CVideoBox
              key={video.videoID}
              img={video.thumbnail}
              title={video.videoTitle}
            />
          )
        })}
      </div>
    </div>
  )
}

CMyVideosPage.defaultProps = defaultProps
export default CMyVideosPage

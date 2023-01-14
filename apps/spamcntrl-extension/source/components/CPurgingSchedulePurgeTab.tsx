import React from 'react'
import { AppContext } from '../context'
import CButton from './CButton'
import CVideoBox from './CVideoBox'

interface CPurgingSchedulePurgeTabProps {}
const defaultProps: CPurgingSchedulePurgeTabProps = {}

const CPurgingSchedulePurgeTab: React.FC<CPurgingSchedulePurgeTabProps> =
  ({}) => {
    const { setActiveNavbarKey } = React.useContext(AppContext)
    return (
      <>
        <div className="w-full flex justify-between">
          <CVideoBox
            img="https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg"
            title="The Crypto Markets Just Flipped"
            type="schedule"
          />
          <CVideoBox
            img="https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw"
            title="Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF"
            type="schedule"
          />
          <CVideoBox
            img="https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw"
            title="Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️"
            type="schedule"
          />
        </div>
        <div className="mt-3 flex justify-center">
          <CButton
            buttonStyle={'tab'}
            text="Go to Schedule"
            onClick={() => {
              setActiveNavbarKey && setActiveNavbarKey('schedule-purge')
            }}
          />
        </div>
      </>
    )
  }

CPurgingSchedulePurgeTab.defaultProps = defaultProps
export default CPurgingSchedulePurgeTab

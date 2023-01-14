import React from 'react'
import CVideoBox from './CVideoBox'

interface CLatestVideosProps {}
const defaultProps: CLatestVideosProps = {}

const CLatestVideos: React.FC<CLatestVideosProps> = ({}) => {
  return (
    <div className="mt-3 w-full">
      <div className="w-full flex mb-3">
        <span className="font-bold text-title text-txt leading-[18px]">
          Latest Videos
        </span>
      </div>

      <div className="w-full flex justify-between">
        <CVideoBox
          img="https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg"
          title="The Crypto Markets Just Flipped"
        />
        <CVideoBox
          img="https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw"
          title="Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF"
        />
        <CVideoBox
          img="https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw"
          title="Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️"
        />
      </div>
    </div>
  )
}

CLatestVideos.defaultProps = defaultProps
export default CLatestVideos

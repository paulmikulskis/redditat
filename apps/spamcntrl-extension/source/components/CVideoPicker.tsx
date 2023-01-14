import classNames from 'classnames'
import { format, subDays } from 'date-fns'
import React, { useState } from 'react'
import { IVideo } from '../models'
import CButton from './CButton'
import CInput from './CInput'
import CSearchIcon from './CSearchIcon'

interface CVideoPickerProps {}
const defaultProps: CVideoPickerProps = {}

const CVideoPicker: React.FC<CVideoPickerProps> = ({}) => {
  const [searchText, setSearchText] = useState<string>('')
  const [videoResults, setVideoResults] = useState<IVideo[]>([])

  const hasVideoResults = videoResults && videoResults.length > 0
  const hasSearchText = searchText.trim().length > 0

  function onClickClear() {
    setSearchText('')
  }

  function onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value)
  }

  function getCustomAddOns() {
    if (!hasVideoResults) {
      return null
    }

    return (
      <div
        className={classNames(
          'pt-8 absolute top-0 left-0 w-full pointer-events-none',
          'peer-hover:block peer-focus-within:block hover:block peer shadow-searchbox',
          'hidden'
        )}
      >
        <div
          className={classNames(
            'pb-4 rounded-b-little w-full bg-alt pointer-events-auto'
          )}
        >
          {/* Search box and video results eparator */}
          <div className="px-[16px] border-t border-t-[#F2F4F6]"></div>

          {/* Video results */}
          <div className="px-[16px] pt-3 space-y-[13px] max-h-[100px] overflow-y-auto">
            {videoResults.map((v) => {
              return (
                <div
                  className={classNames('flex justify-between items-center')}
                >
                  <span className="flex items-center">
                    <img
                      className="rounded-[3px] h-7 w-[42px] mr-2"
                      src={v.thumbnail}
                    />
                    <span className="text-xsm max-w-[156px]">
                      <div className="text-txt truncate font-bold">
                        {v.videoTitle}
                      </div>
                      {v.date && (
                        <div className="text-lnk font-[450]">
                          {format(v.date, 'dd MMM yyyy')}
                        </div>
                      )}
                    </span>
                  </span>
                  <CButton
                    style={{ width: '72px' }}
                    text="+ Add"
                    buttonStyle="pcard"
                    onClick={() => {
                      console.log('log: added video')
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  React.useEffect(() => {
    if (hasSearchText) {
      setVideoResults([
        {
          thumbnail:
            'https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg',
          name: 'Sample',
          videoID: '01',
          videoTitle: 'The Crypto Markets Just Flipped',
          commentCount: 2,
          completed: false,
          date: subDays(new Date(), 4),
        },
        {
          thumbnail:
            'https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw',
          name: 'Sample',
          videoID: '01',
          videoTitle:
            "Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF",
          commentCount: 5,
          completed: false,
          date: subDays(new Date(), 14),
        },
      ])
    } else {
      setVideoResults([])
    }
  }, [searchText])

  return (
    <div>
      <CInput
        icon={<CSearchIcon />}
        placeholder={'Add videos...'}
        onChange={onChangeSearchInput}
        customAddons={getCustomAddOns()}
        removeBottomBorderOnFocus={hasVideoResults ? true : false}
        onClickClear={hasSearchText ? onClickClear : undefined}
        value={searchText}
      />
    </div>
  )
}

CVideoPicker.defaultProps = defaultProps
export default CVideoPicker

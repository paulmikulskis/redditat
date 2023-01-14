import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useDispatch } from 'react-redux'
import {
  getSchedulePurgeActiveButtonTabKey,
  getSchedulePurgeButtonTabs,
  getSchedulePurgeDropdownMenuOptions,
  getSchedulePurgeDropdownType,
  getSchedulePurgePlaylistSearchResults,
  getSchedulePurgeSearchResults,
  getSchedulePurgeSearchText,
  setSchedulePurgeActiveButtonTabKey,
  setSchedulePurgeDropdownType,
  setSchedulePurgeText,
  TSchedulePurgeDropdownType,
} from '../store/slices/schedulePurgeSlice'

import CButtonTabs from './CButtonTabs'
import CDropdownButton from './CDropdownButton'
import CInput from './CInput'
import CPlaylistBox from './CPlaylistBox'
import CSearchIcon from './CSearchIcon'
import CVideoBox from './CVideoBox'

interface CSchedulePurgePageProps {}
const defaultProps: CSchedulePurgePageProps = {}

const CSchedulePurgePage: React.FC<CSchedulePurgePageProps> = ({}) => {
  const dispatch = useDispatch()

  const schedulePurgeSearchText = getSchedulePurgeSearchText()
  const schedulePurgeSearchResults = getSchedulePurgeSearchResults()
  const schedulePurgeActiveButtonTabKey = getSchedulePurgeActiveButtonTabKey()
  const schedulePurgeDropdownType = getSchedulePurgeDropdownType()
  const schedulePurgeDropdownMenuOptions = getSchedulePurgeDropdownMenuOptions()
  const schedulePurgePlaylistSearchResults =
    getSchedulePurgePlaylistSearchResults()

  const isScheduled = schedulePurgeActiveButtonTabKey == 'sp-scheduled-videos'
  const isVideos = schedulePurgeDropdownType == 'videos'

  return (
    <div>
      <div className="w-full flex justify-between">
        <span className="w-full flex items-center h-full">
          <CButtonTabs
            tabsStyle={{
              width: '110px',
              marginRight: '6px',
            }}
            tabs={getSchedulePurgeButtonTabs()}
            activeTabKey={schedulePurgeActiveButtonTabKey}
            onClickTab={(tab) =>
              dispatch(setSchedulePurgeActiveButtonTabKey(tab.key))
            }
          />
        </span>
        <span>
          <CDropdownButton
            onClick={(menuOption) => {
              dispatch(
                setSchedulePurgeDropdownType(
                  menuOption.key as TSchedulePurgeDropdownType
                )
              )
            }}
            buttonStyle="alt"
            text={
              schedulePurgeDropdownMenuOptions.find(
                (opt) => opt.key == schedulePurgeDropdownType
              )?.title
            }
            menuOptions={schedulePurgeDropdownMenuOptions}
          />
        </span>
      </div>

      <div className="mt-3 flex">
        <CInput
          onChange={(e) => dispatch(setSchedulePurgeText(e.target.value))}
          icon={<CSearchIcon />}
          value={schedulePurgeSearchText}
          placeholder={isVideos ? 'Search Videos...' : 'Search Playlist...'}
        />
      </div>

      {/* My Videos */}
      {schedulePurgeDropdownType == 'videos' && (
        <div>
          <div className="w-full mt-3 font-bold text-title text-txt flex items-center mb-2">
            My Videos
          </div>

          <div className="mb-3 w-full grid grid-cols-3 gap-[9px]">
            {schedulePurgeSearchResults.map((video) => {
              return (
                <CVideoBox
                  key={video.videoID}
                  img={video.thumbnail}
                  title={video.videoTitle}
                  type={isScheduled ? 'scheduled' : 'schedule'}
                  schedulePurge={video.schedulePurge}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Playlis */}
      {schedulePurgeDropdownType == 'playlist' && (
        <div>
          <div className="w-full mt-3 font-bold text-title text-txt flex justify-between items-center mb-2">
            <span>My Playlist</span>
            {isScheduled && (
              <span>
                <CDropdownButton
                  buttonStyle="alt"
                  style={{
                    width: '90px',
                  }}
                  text="Scheduled"
                  menuOptions={[
                    {
                      key: 'scheduled',
                      title: 'Scheduled',
                    },
                    {
                      key: 'paused',
                      title: 'Paused',
                    },
                    {
                      key: 'cancelled',
                      title: 'Cancelled',
                    },
                  ]}
                />
              </span>
            )}
          </div>

          <div className="mb-3 w-full grid grid-cols-3 gap-[9px]">
            {schedulePurgePlaylistSearchResults.map((playlist) => {
              return (
                <CPlaylistBox
                  key={playlist.title}
                  img={playlist.thumbnail}
                  title={playlist.title}
                  type={isScheduled ? 'scheduled' : 'schedule'}
                  count={playlist.count}
                  schedulePurge={playlist.schedulePurge}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

CSchedulePurgePage.defaultProps = defaultProps
export default CSchedulePurgePage

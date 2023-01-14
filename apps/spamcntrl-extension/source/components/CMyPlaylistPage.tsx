import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { AppContext } from '../context'
import { getMyPlaylistSearchResults } from '../store/slices/myPlaylistSlice'

import { getURL } from '../utils'
import CButton from './CButton'
import CDropdownButton from './CDropdownButton'
import CIconButton from './CIconButton'
import CPlaylistBox from './CPlaylistBox'

interface CMyPlaylistPageProps {}
const defaultProps: CMyPlaylistPageProps = {}

const CMyPlaylistPage: React.FC<CMyPlaylistPageProps> = ({}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)

  const myPlaylistSearchResults = getMyPlaylistSearchResults()

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
            My Playlist
          </span>
        </span>
        <span>
          <CDropdownButton
            style={{
              width: '120px',
            }}
            buttonStyle="alt"
            text={'Custom Playlist'}
            menuOptions={[
              { key: 'custom-playlist', title: 'Custom Playlist' },
              { key: 'youtube-playlist', title: 'Youtube Playlist' },
            ]}
          />
        </span>
      </div>

      {/* My Playlist */}
      <div className="mt-3 w-full grid grid-cols-3 gap-[9px]">
        {myPlaylistSearchResults.map((playlist) => {
          return (
            <CPlaylistBox
              key={playlist.title}
              count={playlist.count}
              img={playlist.thumbnail}
              title={playlist.title}
              type="normal"
              hasDelete
            />
          )
        })}
      </div>

      <div className="mt-4 flex justify-center items-center">
        <CButton
          buttonStyle="primary"
          text="+ Create Playlist"
          style={{ width: '100px' }}
          onClick={() => {
            setActiveNavbarKey && setActiveNavbarKey('create-playlist')
          }}
        />
      </div>
    </div>
  )
}

CMyPlaylistPage.defaultProps = defaultProps
export default CMyPlaylistPage

import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useDispatch } from 'react-redux'
import { AppContext } from '../context'
import {
  getCreatePlaylistData,
  getCreatePlaylistIsEdit,
  getCreatePlaylistTitle,
  setCreatePlaylistDefault,
  setCreatePlaylistTitle,
} from '../store/slices/createPlaylistSlice'

import { getURL } from '../utils'
import CButton from './CButton'
import CIconButton from './CIconButton'
import CInput from './CInput'
import CVideoBox from './CVideoBox'
import CVideoPicker from './CVideoPicker'

interface CCreatePlaylistPageProps {}
const defaultProps: CCreatePlaylistPageProps = {}

const CCreatePlaylistPage: React.FC<CCreatePlaylistPageProps> = ({}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)

  const isEdit = getCreatePlaylistIsEdit()
  const playlistData = getCreatePlaylistData()
  const playlistTitle = getCreatePlaylistTitle()

  const dispatch = useDispatch()

  React.useEffect(() => {
    return () => {
      dispatch(setCreatePlaylistDefault())
    }
  }, [])

  function onChangePlaylistTitle(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setCreatePlaylistTitle(e.target.value))
  }

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
            Create Playlist
          </span>
        </span>
      </div>

      <div className="mt-3 flex justify-between">
        <CInput
          style={{
            width: '200px',
          }}
          placeholder={'Playlist Name'}
          value={playlistTitle}
          onChange={onChangePlaylistTitle}
        />
        {isEdit ? (
          <CButton
            style={{
              width: '108px',
              height: '32px',
            }}
            buttonStyle="primary"
            icon={<img src={getURL('assets/icons/edit.svg')} />}
            text={'Edit'}
          />
        ) : (
          <CButton
            style={{
              width: '108px',
              height: '32px',
            }}
            buttonStyle="primary"
            text="+ Create"
          />
        )}
      </div>

      <div className="my-3">
        <CVideoPicker />
      </div>

      {/* My Playlist */}
      <div className="font-bold text-title text-txt flex items-center h-full mt-3 mb-2">
        Playlist Videos - {playlistData.length}
      </div>

      <div className="my-3 w-full grid grid-cols-3 gap-[9px]">
        {playlistData.map((video) => {
          return (
            <CVideoBox
              key={video.videoID}
              img={video.thumbnail}
              title={video.videoTitle}
              hasDelete
            />
          )
        })}
      </div>

      <div className="mt-4 flex justify-center items-center w-full">
        <CButton
          style={{ width: '120px', marginRight: '8px' }}
          text="Schedule Playlist"
          buttonStyle="alt-txt"
        />
        <CButton
          style={{ width: '120px' }}
          text="Purge Playlist"
          buttonStyle="primary"
        />
      </div>
    </div>
  )
}

CCreatePlaylistPage.defaultProps = defaultProps
export default CCreatePlaylistPage

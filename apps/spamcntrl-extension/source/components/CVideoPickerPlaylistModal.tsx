import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppContext } from '../context'
import { IVideo } from '../models'
import { RootState } from '../store'
import {
  addToTempPlaylist,
  removeFromTempPlaylist,
  savePlaylistFromTemp,
  copyPlaylistToTemp,
  stopScheduledPlaylist,
  runScheduledPlaylist,
} from '../store/slices/videoPickerPlaylistSlice'
import { getYoutubeImageFromVideoId } from '../utils'
import { lastNVideos } from '../utils/api'
import CButton from './CButton'
import CInput from './CInput'
import CLoader from './CLoader'
import CModal, { CModalProps } from './CModal'

interface CVideoPickerPlaylistModalProps {}
const defaultProps: CVideoPickerPlaylistModalProps = {}

const CVideoPickerPlaylistModal: React.FC<CVideoPickerPlaylistModalProps> =
  ({}) => {
    const dispatch = useDispatch()
    const { user } = useContext(AppContext)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [videos, setVideos] = useState<IVideo[] | undefined>(undefined)
    const [searchText, setSearchText] = useState<string>('')

    const [confirmModalData, setConfirmModalData] = useState<CModalProps>({
      title: '',
      content: '',
    })

    useEffect(() => {
      if (user && user.uuid && showModal) {
        lastNVideos(user.uuid, 1000).then((yVideos) => {
          setVideos(yVideos)
        })
      }

      return () => {
        setVideos(undefined)
        setSearchText('')
      }
    }, [showModal])

    const videoPickerPlaylistData = useSelector(
      (state: RootState) => state.videoPickerPlaylist
    )

    function onOpenEditPlaylistModal() {
      dispatch(copyPlaylistToTemp())
      setShowModal(true)
    }

    async function onCloseEditPlaylistModal() {
      setShowModal(false)
    }

    async function onSaveEditPlaylistModal() {
      dispatch(savePlaylistFromTemp())
      setShowModal(false)
    }

    function _onSearchVideo(e: React.ChangeEvent<HTMLInputElement>) {
      setSearchText(e.target.value)
    }

    function hideConfirmModal() {
      setConfirmModalData({
        title: '',
        content: '',
        show: false,
      })
    }

    function onClickRunStopScheduledPlaylist() {
      if (videoPickerPlaylistData.running) {
        setConfirmModalData({
          title: 'Stop Scheduled Playlist?',
          content: 'Are you sure you want to stop the scheduled playlist?',
          show: true,
          okText: 'Stop',
          ok: async () => {
            hideConfirmModal()
            dispatch(stopScheduledPlaylist())
          },
          cancel: async () => {
            hideConfirmModal()
          },
        })
      } else {
        setConfirmModalData({
          title: 'Run Scheduled Playlist?',
          content:
            'Are you sure you want to run the scheduled playlist on background?',
          show: true,
          okText: 'Run',
          ok: async () => {
            hideConfirmModal()
            dispatch(runScheduledPlaylist())
          },
          cancel: async () => {
            hideConfirmModal()
          },
        })
      }
    }

    return (
      <div>
        {videoPickerPlaylistData.playlist.length > 0 && (
          <div className="mb-4">
            <div className="flex -space-x-4">
              {videoPickerPlaylistData.playlist.slice(0, 3).map((video) => {
                return (
                  <img
                    className="w-10 h-10 rounded-md border-2 border-white dark:border-gray-800"
                    src={getYoutubeImageFromVideoId(video.videoID)}
                    alt=""
                  />
                )
              })}
              {videoPickerPlaylistData.playlist.length > 3 && (
                <a
                  className="flex justify-center items-center w-10 h-10 text-xs font-medium text-white bg-gray-700 rounded-md border-2 border-white hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +{videoPickerPlaylistData.playlist.length}
                </a>
              )}
            </div>
          </div>
        )}
        <div className="flex">
          <CButton
            text={'Edit playlist'}
            mini
            center
            className="w-auto text-xs p-2 mr-2"
            icon={null}
            onClick={onOpenEditPlaylistModal}
          />
          {videoPickerPlaylistData.playlist.length > 0 && (
            <CButton
              text={videoPickerPlaylistData.running ? 'Stop' : 'Run'}
              mini
              center
              className="w-auto text-xs p-2 mr-2"
              icon={null}
              onClick={onClickRunStopScheduledPlaylist}
            />
          )}
        </div>
        <CModal
          show={showModal}
          title="Edit Playlist"
          content={
            <div>
              <div>
                <div className="text-base font-bold">
                  Selected Videos ({videoPickerPlaylistData.tempPlaylist.length}
                  )
                </div>
                <div className="max-h-24 overflow-y-auto p-2">
                  {videoPickerPlaylistData.tempPlaylist.length == 0 ? (
                    <>
                      <h2 className="text-2xl font-bold text-primary-400">
                        Empty Playlist!
                      </h2>
                      <p className="mt-1 font-semibold text-sm text-primary-300">
                        Add videos to playlist.
                      </p>
                    </>
                  ) : (
                    videos &&
                    videoPickerPlaylistData.tempPlaylist.map((video, index) => {
                      return (
                        <div
                          key={video.videoID}
                          className={classNames(
                            'flex p-1 cursor-pointer hover:bg-primary-100',
                            'border-gray-100',
                            index == videos.length - 1 ? '' : 'border-b-1'
                          )}
                        >
                          <span className="flex-initial mr-2 w-12 flex items-center h-10">
                            <img
                              className="w-10 h-6 rounded-md"
                              src={getYoutubeImageFromVideoId(video.videoID)}
                            />
                          </span>
                          <span className="flex-1 flex flex-col items-start justify-center">
                            <div className="text-xs font-bold text-gray-600 line-clamp-2">
                              {video.videoTitle}
                            </div>
                          </span>
                          <span
                            onClick={() =>
                              dispatch(removeFromTempPlaylist(video))
                            }
                            className="text-red-400 hover:text-red-500 flex-initial items-center h-10 flex"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              <div className="mt-4">
                {videos === undefined ? (
                  <></>
                ) : (
                  <div>
                    <CInput
                      placeholder="Search Video Name"
                      value={searchText}
                      onChange={_onSearchVideo}
                    />
                  </div>
                )}
                <div className="max-h-24 overflow-y-auto p-2">
                  {videos === undefined ? (
                    <CLoader inline show />
                  ) : (
                    videos
                      ?.filter((video) => {
                        if (
                          videoPickerPlaylistData.tempPlaylist.find((v) => {
                            return v.videoID == video.videoID
                          })
                        ) {
                          return false
                        }

                        if (video) {
                          return (
                            searchText.trim() == '' ||
                            video.videoTitle
                              .toLowerCase()
                              .includes(searchText.trim().toLowerCase())
                          )
                        } else {
                          return false
                        }
                      })
                      .map((video, index) => {
                        return (
                          <div
                            key={video.videoID}
                            onClick={() => dispatch(addToTempPlaylist(video))}
                            className={classNames(
                              'flex  p-1 cursor-pointer hover:bg-primary-100',
                              'border-gray-100',
                              index == videos.length - 1 ? '' : 'border-b-1'
                            )}
                          >
                            <span className="flex-initial mr-2 w-12 flex items-center h-10">
                              <img
                                className="w-10 h-6 rounded-md"
                                src={getYoutubeImageFromVideoId(video.videoID)}
                              />
                            </span>
                            <span className="flex-1 flex flex-col items-start justify-center">
                              <div className="text-xs font-bold text-gray-600 line-clamp-2">
                                {video.videoTitle}
                              </div>
                            </span>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>
            </div>
          }
          okText={'Save'}
          cancelText="Cancel"
          ok={onSaveEditPlaylistModal}
          cancel={onCloseEditPlaylistModal}
        />
        <CModal {...confirmModalData} />
      </div>
    )
  }

CVideoPickerPlaylistModal.defaultProps = defaultProps
export default CVideoPickerPlaylistModal

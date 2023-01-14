import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { PER_VIDEO } from '../constants/PaymentConstants'
import { AppContext } from '../context'
import { IVideo } from '../models'
import { getYoutubeImageFromVideoId, searchByVideoNameOrLink } from '../utils'
import { lastNVideos } from '../utils/api'
import CInput from './CInput'
import CLoader from './CLoader'
import CModal from './CModal'

interface CPurgeVideoModalProps {
  show: Boolean
  onClose?: () => Promise<void>
  onPurge?: () => Promise<void>
  hasDiscount?: Boolean
}

const defaultProps: CPurgeVideoModalProps = {
  show: false,
  hasDiscount: false,
}

const CPurgeVideoModal: React.FC<CPurgeVideoModalProps> = ({
  show,
  onClose,
  onPurge,
  hasDiscount,
}) => {
  const { user } = useContext(AppContext)
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null)
  const [videos, setVideos] = useState<IVideo[] | undefined>(undefined)
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    if (user && user.uuid && show) {
      lastNVideos(user.uuid, 1000).then((yVideos) => {
        setVideos(yVideos)
      })
    }

    return () => {
      setSelectedVideo(null)
      setVideos(undefined)
      setSearchText('')
    }
  }, [show])

  async function _onPurge() {
    onPurge && onPurge()
    onClose && onClose()
  }

  function _onSearchVideo(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedVideo(null)
    setSearchText(e.target.value)
  }

  return (
    <CModal
      show={show}
      title="Purge Youtube Video"
      content={
        <div>
          <div>
            Please pick the youtube video that you want to purge for{' '}
            <span className="font-bold text-red-400">
              ${hasDiscount ? PER_VIDEO?.discountAmount : PER_VIDEO?.amount}
            </span>
            .
          </div>
          <div className="mt-8">
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
            <div className="max-h-48 overflow-y-auto p-2">
              {videos === undefined ? (
                <CLoader inline show />
              ) : (
                videos
                  ?.filter((video) => {
                    if (video) {
                      return searchByVideoNameOrLink(
                        video.videoTitle,
                        video.videoID,
                        searchText
                      )
                    } else {
                      return false
                    }
                  })
                  .map((video, index) => {
                    const isSelected =
                      (selectedVideo as IVideo)?.videoID == video.videoID
                    return (
                      <div
                        key={video.videoID}
                        onClick={() => setSelectedVideo(video)}
                        className={classNames(
                          'flex  p-3 cursor-pointer hover:bg-primary-100',
                          selectedVideo && isSelected
                            ? ' border-2 border-primary-400 rounded-lg'
                            : '',
                          isSelected ? 'bg-primary-100' : 'border-gray-100',
                          index == videos.length - 1 ? '' : 'border-b-2'
                        )}
                      >
                        <span className="flex-initial mr-2 w-12 h-8 flex items-center">
                          <img
                            className="w-12 h-8 rounded-md"
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
      okText="Purge"
      cancelText="Cancel"
      ok={_onPurge}
      cancel={onClose}
      okDisabled={selectedVideo == null}
    />
  )
}

CPurgeVideoModal.defaultProps = defaultProps
export default CPurgeVideoModal

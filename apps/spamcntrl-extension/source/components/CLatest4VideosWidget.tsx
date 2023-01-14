import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context'
import { IVideo } from '../models'
import { getYoutubeImageFromVideoId } from '../utils'
import { lastNVideos } from '../utils/api'
import CLinkButton from './CLinkButton'
import CLoader from './CLoader'
import CYTVideoStatus from './CYTVideoStatus'

interface CLatest4VideosWidgetProps {}
const defaultProps: CLatest4VideosWidgetProps = {}

const CLatest4VideosWidget: React.FC<CLatest4VideosWidgetProps> = ({}) => {
  const { user } = useContext(AppContext)
  const { setActiveNavbarKey } = useContext(AppContext)

  const [videos, setVideos] = useState<IVideo[] | undefined>(undefined)

  useEffect(() => {
    if (user && user.uuid) {
      lastNVideos(user.uuid, 4).then((yVideos) => {
        setVideos(yVideos)
      })
    }
  }, [])

  function onClickSeePurgingHistory() {
    setActiveNavbarKey && setActiveNavbarKey('purging')
  }

  const loadingYoutubeVideos = videos === undefined

  return (
    <>
      <div className="px-5 pt-5 flex flex-col justify-start">
        <div className="text-base font-bold">Latest 4 videos</div>
      </div>

      {loadingYoutubeVideos ? (
        <CLoader show inline />
      ) : (
        <>
          {videos && videos.length > 0 ? (
            <div>
              <div className="flex px-4 w-full flex-wrap justify-around items-center">
                {videos.map((video, i) => {
                  return (
                    <CYTVideoStatus
                      key={i}
                      completed={video.completed}
                      thumbnail={getYoutubeImageFromVideoId(video.videoID)}
                      name={video.videoTitle}
                    />
                  )
                })}
              </div>
              <div className="px-4 flex justify-end mb-8 mt-2">
                <CLinkButton onClick={onClickSeePurgingHistory}>
                  ...See your purging history here
                </CLinkButton>
              </div>
            </div>
          ) : (
            <div className="px-5 mb-8">
              <h2 className="text-2xl font-bold text-primary-400">
                No Videos Found!
              </h2>
              <p className="mt-1 font-semibold text-sm text-primary-300">
                There's nothing to purge.
              </p>
            </div>
          )}
        </>
      )}
    </>
  )
}

CLatest4VideosWidget.defaultProps = defaultProps
export default CLatest4VideosWidget

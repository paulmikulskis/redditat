import classNames from 'classnames'
import React from 'react'
import { CLMyStats } from '../models/CLMyStats'
import CPieChart from './CPieChart'
import CYoutubeComments from './CYoutubeComment'
import _ from 'lodash'
import { CLComment } from '../models/CLComment'
import { CLVideo } from '../models/CLVideo'

export interface CSpamalyticsStatsProps {
  title?: string
  stats?: CLMyStats | null
  videos: CLVideo[]
}
const defaultProps: CSpamalyticsStatsProps = {
  videos: [],
}

const CSpamalyticsStats: React.FC<CSpamalyticsStatsProps> = ({
  title,
  stats,
  videos,
}) => {
  const videosExampleSpamComments: CLComment[] = []
  videos.forEach((video) => {
    const spams = _.chain(video.commentHighlights)
      .filter((v) => {
        return v.isSpam
      })
      .sortBy((video) => {
        return -video.spamComments
      })
      .value()

    if (spams && spams.length > 0) {
      videosExampleSpamComments.push(spams[0])
    }
  })

  return (
    <div>
      <div className="mt-16">
        <div className="text-[24px] text-center font-medium text-txt">
          {title}
        </div>

        <div className="mt-4 space-y-10">
          {videos.map((video) => {
            return (
              <div
                key={video.videoId}
                className={classNames(
                  'mt-2 grid grid-cols-1 place-items-center',
                  'xl:flex xl:justify-between'
                )}
              >
                <span
                  className={classNames(
                    'inline-block max-w-[300px]',
                    'xl:w-[300px]'
                  )}
                >
                  <img
                    className={classNames(
                      'w-full max-w-[295.99px] max-h-[166.08px] rounded-databox'
                    )}
                    src={`https://i.ytimg.com/vi/${video.videoId}/hq720.jpg`}
                  />
                  <div className="mt-2 font-semibold">{video.videoTitle}</div>
                </span>

                <span
                  className={classNames(
                    'h-[200px] flex-col justify-center mr-[-100px] hidden',
                    'xl:flex'
                  )}
                >
                  <img src={'icons/long-arrow-right.svg'} className="w-6" />
                </span>

                <span className="flex h-[40px] flex-col justify-center xl:hidden">
                  <img src={'icons/long-arrow-down.svg'} className="w-6" />
                </span>

                <span>
                  <div
                    className={classNames(
                      'w-[400px] h-[200px]',
                      'xl:mr-[-100px]'
                    )}
                  >
                    <CPieChart
                      data={[
                        {
                          id: 'Spam',
                          label: 'Spam',
                          value: video.spamComments,
                          color: 'hsl(54, 100%, 62%)',
                        },
                        {
                          id: 'Not Spam',
                          label: 'Not Spam',
                          value: video.notSpamComments,
                          color: 'hsl(207, 90%, 54%)',
                        },
                      ]}
                    />
                  </div>
                  <div
                    className={classNames(
                      'text-center text-[20px]',
                      'xl:mr-[-100px]'
                    )}
                  >
                    <span className="text-[#FFEC3D]">{`${video.getSpamPercentString()}%`}</span>{' '}
                    /{' '}
                    <span className="text-[#2094F3]">{`${video.getNotSpamPercentString()}%`}</span>
                  </div>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {videosExampleSpamComments && videosExampleSpamComments.length > 0 ? (
        <>
          <div className="mt-16">
            <div className="font-medium text-[18px] text-center text-txt">
              Here are some screenshots of example spam comments on these videos
            </div>

            <div className="mt-4 space-y-[30px]">
              {videosExampleSpamComments.map((comment) => {
                return (
                  <CYoutubeComments
                    key={comment.commentText}
                    author={comment.authorChannelName}
                    comment={comment.commentText}
                    // date={subDays(new Date(), 4)}
                  />
                )
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

CSpamalyticsStats.defaultProps = defaultProps
export default CSpamalyticsStats

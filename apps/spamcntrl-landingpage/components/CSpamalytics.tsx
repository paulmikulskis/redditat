import classNames from 'classnames'
import React from 'react'
import { CLMyStats } from '../models/CLMyStats'
import CPieChart from './CPieChart'
import CSpamalyticsHeader from './CSpamalyticsHeader'
import { useAuth } from '../contexts/AuthContext'
import _ from 'lodash'
import CYoutubeComments from './CYoutubeComment'
import { subDays } from 'date-fns'
import CSpamalyticsStats from './CSpamalyticsStats'
import CSpamalyticsSummary from './CSpamalyticsSummary'
import { User } from 'firebase/auth'

export interface CSpamalyticsHeaderProps {
  stats?: CLMyStats | null
  user?: User | null
  hasHeadersEmail?: string | null
}
const defaultProps: CSpamalyticsHeaderProps = {}

const CSpamalytics: React.FC<CSpamalyticsHeaderProps> = ({
  stats,
  user,
  hasHeadersEmail,
}) => {
  function getSortedVideos() {
    return stats && stats.videos && stats.videos.length > 0
      ? _.chain(stats.videos)
          .filter((video) => {
            return video.spamComments > 0
          })
          .sortBy((v) => {
            return -v.spamComments / v.totalComments
          })
          .value()
          .slice(0, 3)
      : []
  }

  const sortedVideos = getSortedVideos()
  const recentVideos =
    stats && stats.videos && stats.videos.length > 0
      ? _.chain(stats.videos)
          .filter((video) => {
            return video.spamComments > 0
          })
          .value()
          .slice(0, 3)
      : []

  const displayName = user ? user.displayName : hasHeadersEmail
  const photoURL = user ? user.photoURL : ''

  return (
    <div className={classNames('px-8 mb-20', 'xl:max-w-[900px]')}>
      {(user != null || hasHeadersEmail) && stats === null ? (
        <>
          <CSpamalyticsHeader displayName={displayName} photoURL={photoURL} />
          <div className="text-center text-txt mt-4 text-[20px]">
            Sorry! There are no scans found on your youtube channel. Please
            contact support.
          </div>
        </>
      ) : null}

      {(user != null || hasHeadersEmail) && stats ? (
        <div>
          <CSpamalyticsHeader displayName={displayName} photoURL={photoURL} />
          <CSpamalyticsSummary stats={stats} />
          <CSpamalyticsStats
            title="Videos with the most spam to non-spam ratio"
            videos={sortedVideos}
            stats={stats}
          />

          <CSpamalyticsStats
            title="Recent videos' spam to non-spam ratio"
            videos={recentVideos}
            stats={stats}
          />
        </div>
      ) : null}
    </div>
  )
}

CSpamalytics.defaultProps = defaultProps
export default CSpamalytics

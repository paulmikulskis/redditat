import React from 'react'
import CLatestVideos from './CLatestVideos'
import CPurgingOverview from './CPurgingOverview'

interface CDashboardPageProps {}
const defaultProps: CDashboardPageProps = {}

const CDashboardPage: React.FC<CDashboardPageProps> = ({}) => {
  return (
    <div className="max-w-md w-full">
      <CPurgingOverview />
      <CLatestVideos />
    </div>
  )
}

CDashboardPage.defaultProps = defaultProps
export default CDashboardPage

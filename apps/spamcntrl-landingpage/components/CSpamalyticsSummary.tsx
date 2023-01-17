import classNames from 'classnames'
import { User } from 'firebase/auth'
import React from 'react'
import { CLMyStats } from '../models/CLMyStats'

export interface CSpamalyticsSummaryProps {
  stats?: CLMyStats
}
const defaultProps: CSpamalyticsSummaryProps = {}

const CSpamalyticsSummary: React.FC<CSpamalyticsSummaryProps> = ({ stats }) => {
  return (
    <div className="mt-4 text-[20px] text-center text-lnk font-medium">
      <div>
        Summary: Average spam to non spam ratio of your channel is{' '}
        <span className="font-bold text-primary">
          {stats?.getSpamPercentString()}%
        </span>{' '}
        /{' '}
        <span className="font-bold text-primary">
          {stats?.getNotSpamPercentString()}%
        </span>
      </div>
      <div>
        To put it into perspective for every{' '}
        <span className="font-bold text-primary">100 Comments</span> you will
        have{' '}
        <span className="font-bold text-primary">
          {stats?.getSpamPercentString(0)} Spam Comments
        </span>
        .
      </div>
      <div>Let&apos;s take a look at the statistics below.</div>
    </div>
  )
}

CSpamalyticsSummary.defaultProps = defaultProps
export default CSpamalyticsSummary

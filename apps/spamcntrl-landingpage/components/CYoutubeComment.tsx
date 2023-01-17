import React from 'react'
import Avatar from 'react-avatar'
import { formatDistanceToNowStrict } from 'date-fns'

export interface CYoutubeCommentsProps {
  author: string
  comment: string
  date?: Date
}
const defaultProps: CYoutubeCommentsProps = {
  author: '',
  comment: '',
}

const CYoutubeComments: React.FC<CYoutubeCommentsProps> = ({
  author,
  comment,
  date,
}) => {
  return (
    <div className="flex">
      {/* <img src="ad" className="w-10 h-10 mr-4 rounded-full" /> */}
      <span className="mr-4 rounded-full">
        <Avatar name={author} size="40" round={'100%'} />
      </span>
      <div>
        <div className="mb-2 text-[13px] leading-[15px] font-roboto font-[500] text-[#0f0f0f]">
          <span>{author}</span>
          {date ? (
            <span className="ml-1 text-[#606060] font-normal">
              {formatDistanceToNowStrict(date, { addSuffix: true })}
            </span>
          ) : null}
        </div>
        <div className="text-[16px] leading-[20px] font-[400] text-[#0f0f0f]">
          {comment}
        </div>
        <div className="flex mt-[6px] ml-[-6px] items-center">
          <span className="mr-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 fill-[#0D0D0D]"
            >
              <path d="M17.45 20H7.425V9L13.7 2.8l.425.45q.15.125.238.35.087.225.087.4v.15L13.425 9h6.95Q21 9 21.5 9.5t.5 1.125v1.225q0 .125-.025.287-.025.163-.075.313l-2.75 6.475q-.2.45-.688.763-.487.312-1.012.312Zm-9.025-1h9.025q.225 0 .45-.113.225-.112.325-.387L21 12v-1.375q0-.275-.175-.45t-.45-.175H12.2l1.15-5.45-4.925 4.875Zm0-9.575V19Zm-1-.425v1H4v9h3.425v1H3V9Z" />
            </svg>
          </span>

          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 fill-[#0D0D0D]"
            >
              <path d="M6.55 4.8h10.025v11L10.3 22l-.425-.45q-.15-.125-.237-.338-.088-.212-.088-.387v-.175l1.025-4.85h-6.95Q3 15.8 2.5 15.312 2 14.825 2 14.2v-1.25q0-.125.025-.288.025-.162.075-.287L4.85 5.9q.2-.475.688-.788Q6.025 4.8 6.55 4.8Zm9.025 1H6.55q-.225 0-.45.125t-.325.375L3 12.8v1.4q0 .25.175.425t.45.175H11.8l-1.15 5.475 4.925-4.9Zm0 9.575V5.8Zm1 .425v-1H20v-9h-3.425v-1H21v11Z" />
            </svg>
          </span>

          <span className="text-[12px] ml-[23px] font-roboto font-medium text-[#0D0D0D]">
            Reply
          </span>
        </div>
      </div>
    </div>
  )
}

CYoutubeComments.defaultProps = defaultProps
export default CYoutubeComments

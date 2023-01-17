import classNames from 'classnames'
import React from 'react'
import CRating from './CRating'
import CStarIcon from './CStarIcon'

export interface CReviewsProps {}
const defaultProps: CReviewsProps = {}

const CReviews: React.FC<CReviewsProps> = ({}) => {
  return (
    <div
      className={classNames(
        'grid grid-cols-1 px-8 place-items-center',
        'xl:flex xl:justify-center xl:space-x-[108.84px] xl:pl-[104px] xl:pr-[139px]'
      )}
    >
      <div className="relative">
        <img
          className="w-[505px] max-h-[498px] object-scale-down"
          src="/images/marqus.png"
        />

        <img
          className="right-[-26.88px] top-[197.65px] absolute"
          src="/images/review-decor.png"
        />
      </div>
      <div className={classNames('max-w-[578px]')}>
        <div className="mt-[56px]">
          <img className="w-[43px] h-[38px]" src="/icons/quote-left.svg" />
        </div>

        <div
          className={classNames(
            'mt-6 font-normal text-[28px] leading-[46px] text-[#151517] text-center',
            'xl:text-left xl:text-[32px]'
          )}
        >
          “Lorem ipsum dolor sit consectetur adipiscing elit iaculis nam potenti
          utol at nunc tellus masssa“
        </div>

        <div
          className={classNames(
            'mt-10 h-[20.28px] flex justify-center',
            'xl:justify-start'
          )}
        >
          <CRating rating={4.5} />
        </div>

        <div
          className={classNames(
            'mt-[8.72px] font-semibold text-[24px] leading-[32px] text-[#151517] text-center',
            'xl:text-left'
          )}
        >
          Marqus Brownley
        </div>

        <div
          className={classNames(
            'mt-2 font-medium text-base leading-[28px] text-lnk text-center',
            'xl:text-left'
          )}
        >
          MKBHD
        </div>

        <div
          className={classNames(
            'mt-10 space-x-[20px] flex justify-center',
            'xl:justify-start'
          )}
        >
          <span className="rounded-little w-[30px] h-[10px] bg-[#33C286] inline-block"></span>
          <span className="rounded-little w-[10px] h-[10px] bg-[#33C286] bg-opacity-20 inline-block cursor-pointer"></span>
          <span className="rounded-little w-[10px] h-[10px] bg-[#33C286] bg-opacity-20 inline-block cursor-pointer"></span>
          <span className="rounded-little w-[10px] h-[10px] bg-[#33C286] bg-opacity-20 inline-block cursor-pointer"></span>
          <span className="rounded-little w-[10px] h-[10px] bg-[#33C286] bg-opacity-20 inline-block cursor-pointer"></span>
        </div>
      </div>
    </div>
  )
}

CReviews.defaultProps = defaultProps
export default CReviews

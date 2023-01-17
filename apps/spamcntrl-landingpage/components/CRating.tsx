import classNames from 'classnames'
import React from 'react'
import CStarIcon from './CStarIcon'

export interface CRatingProps {
  rating: number
}
const defaultProps: CRatingProps = {
  rating: 0,
}

const CRating: React.FC<CRatingProps> = ({ rating }) => {
  let toRate = rating

  let _1st = 0
  let _2nd = 0
  let _3rd = 0
  let _4th = 0
  let _5th = 0

  if (toRate >= 1) {
    _1st = 1
    toRate--
  } else {
    _1st = toRate
    toRate -= toRate
  }

  if (toRate >= 1) {
    _2nd = 1
    toRate--
  } else {
    _2nd = toRate
    toRate -= toRate
  }

  if (toRate >= 1) {
    _3rd = 1
    toRate--
  } else {
    _3rd = toRate
    toRate -= toRate
  }

  if (toRate >= 1) {
    _4th = 1
    toRate--
  } else {
    _4th = toRate
    toRate -= toRate
  }

  if (toRate >= 1) {
    _5th = 1
    toRate--
  } else {
    _5th = toRate
    toRate -= toRate
  }

  return (
    <div className="flex space-x-[10.14px]">
      <CStarIcon percent={_1st} />
      <CStarIcon percent={_2nd} />
      <CStarIcon percent={_3rd} />
      <CStarIcon percent={_4th} />
      <CStarIcon percent={_5th} />
    </div>
  )
}

CRating.defaultProps = defaultProps
export default CRating

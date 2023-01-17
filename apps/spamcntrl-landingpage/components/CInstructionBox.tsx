import React from 'react'
import Head from 'next/head'
import CButton from './CButton'
import classNames from 'classnames'

export interface CInstructionBoxProps {
  title: string
  description: string
  image: string
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void
  onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void
}
const defaultProps: CInstructionBoxProps = {
  title: '',
  description: '',
  image: '',
}

const CInstructionBox: React.FC<CInstructionBoxProps> = ({
  title,
  description,
  image,
  onTouchMove,
  onTouchStart,
  onTouchEnd,
}) => {
  return (
    <div
      className="w-[389.69px]"
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        className="w-[389.69px] max-h-[366.97px] object-scale-down"
        src={image}
      />
      <div
        className={classNames(
          'mt-8 text-[32px] leading-[40px] font-medium text-txt text-center',
          'xl:mt-[48px] xl:text-left xl:leading-[27px]'
        )}
      >
        {title}
      </div>
      <div
        className={classNames(
          'mt-4 text-[16px] leading-[28px] font-regular text-lnk text-center',
          'xl:text-left'
        )}
      >
        {description}
      </div>
    </div>
  )
}

CInstructionBox.defaultProps = defaultProps
export default CInstructionBox

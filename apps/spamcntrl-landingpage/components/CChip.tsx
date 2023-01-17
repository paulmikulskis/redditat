import React from 'react'
import classNames from 'classnames'

export interface CChipProps {
  className?: string
  style?: Object
  children?: React.ReactNode
}
const defaultProps: CChipProps = {}

const CChip: React.FC<CChipProps> = ({ className, style, children }) => {
  return (
    <span
      className={classNames(
        'w-[213px] h-[40px] rounded-[29px] flex justify-center items-center',
        'font-semibold text-[17px] font-poppins',
        className
      )}
      style={style}
    >
      {children}
    </span>
  )
}

CChip.defaultProps = defaultProps
export default CChip

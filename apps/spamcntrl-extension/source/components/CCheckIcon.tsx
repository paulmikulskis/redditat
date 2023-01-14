import React from 'react'

interface CCheckIconProps {
  className?: string
  width?: number
  height?: number
}
const defaultProps: CCheckIconProps = {
  width: 17,
  height: 13,
}

const CCheckIcon: React.FC<CCheckIconProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 17 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 7L6 11L15 2"
        stroke="#33C286"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

CCheckIcon.defaultProps = defaultProps
export default CCheckIcon

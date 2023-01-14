import React from 'react'

interface CCrossIconProps {
  className?: string
  size?: number
}
const defaultProps: CCrossIconProps = {
  size: 8,
}

const CCrossIcon: React.FC<CCrossIconProps> = ({ className, size }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 3.11125L7.11125 0L8 0.888749L4.88875 4L8 7.11125L7.11125 8L4 4.88875L0.888749 8L0 7.11125L3.11125 4L0 0.888749L0.888749 0L4 3.11125Z" />
    </svg>
  )
}

CCrossIcon.defaultProps = defaultProps
export default CCrossIcon

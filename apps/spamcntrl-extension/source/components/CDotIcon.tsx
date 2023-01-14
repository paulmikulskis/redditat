import React from 'react'

interface CDotIconProps {
  className?: string
  size?: number
}
const defaultProps: CDotIconProps = {
  size: 4,
}

const CDotIcon: React.FC<CDotIconProps> = ({ className, size }) => {
  return (
    <svg
      className={className ? className : 'fill-primary'}
      width={size}
      height={size}
      viewBox="0 0 4 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2" cy="2" r="2" fill="#6022FF" />
    </svg>
  )
}

CDotIcon.defaultProps = defaultProps
export default CDotIcon

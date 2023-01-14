import React from 'react'

export interface CTrashIcon2Props {
  className?: string
  size?: number
}
const defaultProps: CTrashIcon2Props = {
  className: '',
  size: 8,
}

const CTrashIcon2: React.FC<CTrashIcon2Props> = ({ className, size }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.8 2.4H7.2V7.6C7.2 7.70609 7.15786 7.80783 7.08284 7.88284C7.00783 7.95786 6.90609 8 6.8 8H1.2C1.09391 8 0.992172 7.95786 0.917157 7.88284C0.842143 7.80783 0.8 7.70609 0.8 7.6V2.4ZM2 1.2V0.4C2 0.293913 2.04214 0.192172 2.11716 0.117157C2.19217 0.0421427 2.29391 0 2.4 0H5.6C5.70609 0 5.80783 0.0421427 5.88284 0.117157C5.95786 0.192172 6 0.293913 6 0.4V1.2H8V2H0V1.2H2ZM2.8 0.8V1.2H5.2V0.8H2.8ZM2.8 4V6.4H3.6V4H2.8ZM4.4 4V6.4H5.2V4H4.4Z" />
    </svg>
  )
}

CTrashIcon2.defaultProps = defaultProps
export default CTrashIcon2

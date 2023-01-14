import React from 'react'

interface CSearchIconProps {
  className?: string
  size?: number
}
const defaultProps: CSearchIconProps = {
  size: 12,
}

const CSearchIcon: React.FC<CSearchIconProps> = ({ className, size }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.44445 9.88889C7.89905 9.88889 9.88889 7.89905 9.88889 5.44445C9.88889 2.98985 7.89905 1 5.44445 1C2.98985 1 1 2.98985 1 5.44445C1 7.89905 2.98985 9.88889 5.44445 9.88889Z"
        stroke="#858B98"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 11L8.58337 8.58334"
        stroke="#858B98"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

CSearchIcon.defaultProps = defaultProps
export default CSearchIcon

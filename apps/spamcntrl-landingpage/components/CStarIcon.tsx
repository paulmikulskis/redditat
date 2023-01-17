import React, { useEffect } from 'react'
import shortid from 'shortid'

interface CStarIconProps {
  className?: string
  width?: number
  height?: number
  percent: number
}
const defaultProps: CStarIconProps = {
  width: 22,
  height: 21,
  percent: 0,
}

const CStarIcon: React.FC<CStarIconProps> = ({
  className,
  width,
  height,
  percent,
}) => {
  const [id, setId] = React.useState<string>('')

  useEffect(() => {
    setId(shortid.generate())
  }, [])

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="0" y1="0" x2="100%" y2="0" id={`${id}`}>
          <stop stopOpacity="1" offset="0%" stopColor="#FFB72B" />
          <stop
            stopOpacity="1"
            offset={`${percent * 100}%`}
            stopColor="#FFB72B"
          />
          <stop
            stopOpacity="1"
            offset={`${percent * 100}%`}
            stopColor="#CED1D6"
          />
          <stop stopOpacity="1" offset="100%" stopColor="#CED1D6" />
        </linearGradient>
      </defs>
      <path
        d="M10.2136 0.709342L7.61511 5.95187L1.8013 6.79527C0.758708 6.94574 0.340878 8.22469 1.09695 8.95722L5.30311 13.0356L4.30828 18.7969C4.12921 19.8382 5.23149 20.6183 6.15469 20.1313L11.3557 17.411L16.5567 20.1313C17.4799 20.6143 18.5822 19.8382 18.4031 18.7969L17.4083 13.0356L21.6144 8.95722C22.3705 8.22469 21.9527 6.94574 20.9101 6.79527L15.0963 5.95187L12.4978 0.709342C12.0322 -0.225127 10.6832 -0.237006 10.2136 0.709342Z"
        fill={`url(#${id})`}
      />
    </svg>
  )
}

CStarIcon.defaultProps = defaultProps
export default CStarIcon

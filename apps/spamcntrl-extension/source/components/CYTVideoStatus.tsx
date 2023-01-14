import React from 'react'

interface CYTVideoStatusProps {
  completed: Boolean
  thumbnail: string
  name: string
}
const defaultProps: CYTVideoStatusProps = {
  completed: false,
  thumbnail: '',
  name: '',
}

const CYTVideoStatus: React.FC<CYTVideoStatusProps> = ({
  completed,
  thumbnail,
  name,
}) => {
  return (
    <div className="flex flex-col my-2">
      <div
        className="relative w-36 h-16 rounded-md bg-cover bg-center"
        style={{
          backgroundImage: `url(${thumbnail})`,
        }}
      >
        <span
          className={`absolute bottom-1 left-1 px-2 py-1 bg-black rounded-md text-xs font-semibold ${
            completed ? 'text-green-500' : 'text-orange-500'
          }`}
        >
          {completed ? 'Purged' : 'Purging'}
        </span>
      </div>
      <div className="font-bold truncate w-36 text-xs mt-1">{name}</div>
    </div>
  )
}

CYTVideoStatus.defaultProps = defaultProps
export default CYTVideoStatus

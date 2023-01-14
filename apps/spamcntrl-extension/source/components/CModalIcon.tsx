import classNames from 'classnames'
import React from 'react'

type TModalIconType = 'info' | 'success' | 'error'

interface CModalIconProps {
  icon: React.ReactNode
  type?: TModalIconType
}
const defaultProps: CModalIconProps = {
  icon: null,
  type: 'info',
}

const CModalIcon: React.FC<CModalIconProps> = ({ icon, type }) => {
  return (
    <span
      className={classNames(
        'w-10 h-10 rounded-full flex items-center justify-center',

        type == 'info' && 'bg-[#EFE9FF]',
        type == 'success' && 'bg-[#EBF9F3]',
        type == 'error' && 'bg-[#FDE9F1]'
      )}
    >
      {icon}
    </span>
  )
}

CModalIcon.defaultProps = defaultProps
export default CModalIcon

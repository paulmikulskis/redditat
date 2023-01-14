import React from 'react'

export interface CTrashIconProps {
  className?: string
  size?: number
}
const defaultProps: CTrashIconProps = {
  className: '',
  size: 12,
}

const CTrashIcon: React.FC<CTrashIconProps> = ({ className, size }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 2.4H12V3.6H10.8V11.4C10.8 11.5591 10.7368 11.7117 10.6243 11.8243C10.5117 11.9368 10.3591 12 10.2 12H1.8C1.64087 12 1.48826 11.9368 1.37574 11.8243C1.26321 11.7117 1.2 11.5591 1.2 11.4V3.6H0V2.4H3V0.6C3 0.44087 3.06321 0.288258 3.17574 0.175736C3.28826 0.0632141 3.44087 0 3.6 0H8.4C8.55913 0 8.71174 0.0632141 8.82426 0.175736C8.93679 0.288258 9 0.44087 9 0.6V2.4ZM9.6 3.6H2.4V10.8H9.6V3.6ZM4.2 5.4H5.4V9H4.2V5.4ZM6.6 5.4H7.8V9H6.6V5.4ZM4.2 1.2V2.4H7.8V1.2H4.2Z" />
    </svg>
  )
}

CTrashIcon.defaultProps = defaultProps
export default CTrashIcon

import classNames from 'classnames'
import React from 'react'

export interface CIconButtonProps {
  className?: string
  styleClassName?: string
  buttonRef?: React.MutableRefObject<null>
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  style?: object
}
const defaultProps: CIconButtonProps = {
  icon: null,
}

const CIconButton: React.FC<CIconButtonProps> = ({
  className,
  styleClassName,
  buttonRef,
  icon,
  ...props
}) => {
  return (
    <button
      {...props}
      ref={buttonRef}
      className={classNames(
        'cursor-pointer h-auto w-auto',
        styleClassName,
        className
      )}
    >
      {icon}
    </button>
  )
}

CIconButton.defaultProps = defaultProps
export default CIconButton

import classNames from 'classnames'
import React from 'react'

type LinkButtonStyle = 'black' | 'primary'

export interface CLinkButtonProps {
  className?: string
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  linkButtonStyle?: LinkButtonStyle
}
const defaultProps: CLinkButtonProps = {
  linkButtonStyle: 'primary',
}

const CLinkButton: React.FC<CLinkButtonProps> = ({
  children,
  className,
  linkButtonStyle,
  ...props
}) => {
  return (
    <span
      {...props}
      className={classNames(
        'cursor-pointer mx-1 text-lsm font-bold',
        linkButtonStyle == 'primary' ? 'text-primary' : '',
        linkButtonStyle == 'black' ? 'text-txt' : '',
        className
      )}
    >
      {children}
    </span>
  )
}

CLinkButton.defaultProps = defaultProps
export default CLinkButton

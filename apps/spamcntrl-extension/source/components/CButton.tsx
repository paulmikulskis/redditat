import classNames from 'classnames'
import React from 'react'

type TCButtonStyle =
  | 'alt'
  | 'primary'
  | 'alt-primary'
  | 'tab'
  | 'tab-primary'
  | 'alt-lnk'
  | 'pcard-primary'
  | 'none-primary'
  | 'none'
  | 'pcard'
  | 'alt-txt'

export interface CButtonProps {
  className?: string
  styleClassName?: string
  buttonRef?: React.MutableRefObject<null>
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text?: React.ReactNode
  center?: boolean
  mini?: boolean
  disabled?: boolean
  fullWidth?: boolean
  buttonStyle?: TCButtonStyle
  style?: object
}
const defaultProps: CButtonProps = {
  fullWidth: true,
  mini: false,
  center: false,
  styleClassName: 'h-6',
  icon: null,
  buttonStyle: 'primary',
}

const CButton: React.FC<CButtonProps> = ({
  className,
  styleClassName,
  buttonRef,
  mini,
  icon,
  text,
  center,
  disabled,
  fullWidth,
  buttonStyle,
  style,
  ...props
}) => {
  return (
    <button
      style={{
        paddingLeft: '10px',
        paddingRight: '10px',
        ...style,
      }}
      {...props}
      disabled={disabled}
      ref={buttonRef}
      className={classNames(
        buttonStyle == 'tab' ? 'text-primary bg-tabs' : '',
        buttonStyle == 'tab-primary'
          ? 'text-primary bg-bgc2 hover:text-alt hover:bg-primary'
          : '',

        buttonStyle == 'primary' ? 'bg-primary text-alt' : '',
        buttonStyle == 'alt-primary'
          ? 'bg-bgc2 text-primary hover:bg-primary hover:text-alt'
          : '',
        buttonStyle == 'alt' ? 'bg-alt text-primary' : '',
        buttonStyle == 'alt-txt' ? 'bg-alt text-txt' : '',
        buttonStyle == 'alt-lnk' ? 'bg-[#F3F3F5] text-txt' : '',

        buttonStyle == 'pcard' && 'bg-[#EFE9FF] text-primary',
        buttonStyle == 'pcard-primary'
          ? 'bg-[#EFE9FF] text-primary hover:bg-primary hover:text-alt group-hover:bg-primary group-hover:text-alt'
          : '',

        buttonStyle == 'none-primary' &&
          'bg-transparent text-lnk hover:bg-primary hover:text-alt',

        buttonStyle == 'none' && 'bg-transparent text-lnk',

        'font-bold text-xsm flex justify-center items-center rounded-little',
        styleClassName,
        className
      )}
    >
      {icon && (
        <span className="flex justify-center items-center h-full">{icon}</span>
      )}
      <span
        className={classNames(
          'flex justify-center items-center',
          icon ? 'ml-1' : ''
        )}
        style={{
          lineHeight: '10px',
        }}
      >
        {text}
      </span>
    </button>
  )
}

CButton.defaultProps = defaultProps
export default CButton

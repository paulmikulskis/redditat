import classNames from 'classnames'
import React from 'react'

export interface CButtonFixedBottomProps {
  className?: string
  styleClassName?: string
  buttonRef?: React.MutableRefObject<null>
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text?: string
  center?: boolean
  disabled?: boolean
}
const defaultProps: CButtonFixedBottomProps = {
  center: false,
  styleClassName:
    'bg-gradient-to-r from-primary-400 to-primary-300 text-white shadow-primary-200',
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
}

const CButtonFixedBottom: React.FC<CButtonFixedBottomProps> = ({
  className,
  styleClassName,
  buttonRef,
  icon,
  text,
  center,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      ref={buttonRef}
      className={classNames(
        `hover:underline shadow-xl w-full text-sm font-bold transition duration-200 ${
          center ? 'justify-center' : 'justify-between'
        } flex p-5 items-center ${'absolute bottom-0'}`,
        disabled
          ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-white shadow-gray-200 cursor-not-allowed'
          : styleClassName,
        className
      )}
    >
      <span>{text}</span>
      {icon && (
        <span className="flex w-6 justify-center items-center">{icon}</span>
      )}
    </button>
  )
}

CButtonFixedBottom.defaultProps = defaultProps
export default CButtonFixedBottom

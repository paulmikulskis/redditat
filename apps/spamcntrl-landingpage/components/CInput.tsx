import classNames from 'classnames'
import React from 'react'

type TInputType = 'modal' | 'normal'

interface CInputProps {
  name?: string
  type?: TInputType
  className?: string
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number | readonly string[] | undefined
  icon?: React.ReactNode
  style?: object
  label?: string
  customAddons?: React.ReactNode
  removeBottomBorderOnFocus?: boolean
  onClickClear?: () => void
}
const defaultProps: CInputProps = {
  placeholder: 'Search Videos...',
  type: 'normal',
  name: 'name',
  icon: null,
  removeBottomBorderOnFocus: false,
}

const CInput: React.FC<CInputProps> = ({
  icon,
  style,
  type,
  label,
  customAddons,
  removeBottomBorderOnFocus,
  onClickClear,
  ...props
}) => {
  const isNormal = type == 'normal'
  const isModal = type == 'modal'

  return (
    <>
      {isModal && (
        <div className="text-lnk text-base mb-2 w-full text-left">{label}</div>
      )}
      <div
        className={classNames(
          'h-auto relative w-full rounded-little bg-white flex flex-col',

          removeBottomBorderOnFocus &&
            'focus-within:rounded-b-none hover:rounded-b-none focus-within:z-10 hover:z-10',

          isModal &&
            'bg-bgc border border-bgc focus-within:border-primary focus-within:bg-alt'
        )}
        style={style}
      >
        <div
          className={classNames(
            'w-full h-full flex items-center peer',
            isNormal && 'h-8 text-sm px-[14px]',
            isModal && 'h-[44px] text-base'
          )}
        >
          {icon && (
            <span className="mr-2 flex h-full items-center">{icon}</span>
          )}
          <input
            className={classNames(
              'w-full h-full outline-none bg-transparent placeholder:font-[450] text-txt font-bold placeholder:text-lnk',

              isNormal && 'placeholder:text-sm',
              isModal && 'placeholder:text-base px-3 py-[6px]'
            )}
            {...props}
          />

          {onClickClear && (
            <span
              onClick={onClickClear}
              className="absolute right-4 mt-[0px] mb-[0px] cursor-pointer"
            >
              <img src={'assets/icons/cross.png'} />
            </span>
          )}
        </div>

        {customAddons}
      </div>
    </>
  )
}

CInput.defaultProps = defaultProps
export default CInput

import classNames from 'classnames'
import React from 'react'
import { useComponentVisible } from '../hooks'

type TCDropdownButtonStyle =
  | 'alt'
  | 'primary'
  | 'alt-primary'
  | 'box-alt'
  | 'transparent'
  | 'modal'

export interface IDropdownMenuOption {
  key: string
  title: string
}

interface DropdownMenuProps {
  menuOptions: IDropdownMenuOption[]
  menuRef?: React.MutableRefObject<null> | undefined
  menuStyle?: string
  onCLickMenuOption?: (option: IDropdownMenuOption) => void
  style?: object
  menuOptionsStyle?: object
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  menuOptions,
  menuRef,
  onCLickMenuOption,
  style,
  menuOptionsStyle,
}) => {
  function _onCLickMenuOption(option: IDropdownMenuOption) {
    onCLickMenuOption && onCLickMenuOption(option)
  }

  return (
    <div
      className={classNames(
        'absolute rounded-little bg-alt min-w-full min-h-full w-auto right-0 top-5 z-10 mb-1',
        'shadow-dropdown'
      )}
      style={style}
      ref={menuRef}
    >
      <svg
        className="w-2 h-2 absolute fill-white"
        viewBox="0 0 100 100"
        style={{
          right: '9px',
          position: 'absolute',
          top: ' -7.9px',
        }}
      >
        <polygon points="50 30, 100 100, 0 100" />
      </svg>
      <div className="py-2 text-xsm">
        {menuOptions.map((m: IDropdownMenuOption) => {
          return (
            <div
              onClick={() => _onCLickMenuOption(m)}
              className={classNames(
                'px-2 cursor-pointer text-lnk hover:text-txt font-[450] hover:font-bold whitespace-nowrap text-left'
              )}
              style={menuOptionsStyle}
            >
              {m.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export interface CDropdownButtonProps {
  className?: string
  styleClassName?: string
  buttonRef?: React.MutableRefObject<null>
  icon?: React.ReactNode
  onClick?: (option: IDropdownMenuOption) => void
  text?: React.ReactNode
  style?: object
  buttonStyle?: TCDropdownButtonStyle
  menuOptions: IDropdownMenuOption[]
  popupMenuStyle?: object
  menuOptionsStyle?: object
  label?: React.ReactNode
}
const defaultProps: CDropdownButtonProps = {
  icon: null,
  style: {
    minWidth: '72px',
  },
  buttonStyle: 'alt-primary',
  menuOptions: [],
  menuOptionsStyle: { lineHeight: '20px' },
}

const CDropdownButton: React.FC<CDropdownButtonProps> = ({
  className,
  buttonRef,
  icon,
  text,
  style,
  buttonStyle,
  menuOptions,
  menuOptionsStyle,
  onClick,
  popupMenuStyle,
  label,
  ...props
}) => {
  const [menuRef, isMenuOpen, setIsMenuOpen] = useComponentVisible(false)

  function onClickDropdownButton() {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {label && <div className="text-lnk text-xsm mb-2 text-left">{label}</div>}
      <button
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
          ...style,
        }}
        {...props}
        onClick={onClickDropdownButton}
        ref={buttonRef}
        className={classNames(
          buttonStyle == 'transparent' ? '' : '',

          buttonStyle == 'primary' ? 'bg-primary text-alt fill-alt' : '',

          buttonStyle == 'alt-primary' &&
            (isMenuOpen
              ? 'bg-primary text-alt fill-alt'
              : 'bg-bgc2 text-primary fill-primary hover:bg-primary hover:text-alt hover:fill-alt'),

          buttonStyle == 'alt' && 'bg-alt text-txt fill-txt',

          buttonStyle == 'box-alt' ? 'bg-bgc2 text-txt fill-txt' : '',

          buttonStyle == 'modal' && 'bg-bgc text-txt',

          'h-6 font-bold text-xsm flex justify-between items-center rounded relative',
          className
        )}
      >
        <span
          className={classNames('flex items-center h-full w-full')}
          style={{ lineHeight: '12.65px' }}
        >
          {text}
        </span>

        <span
          className={classNames(
            'flex flex-end items-center h-full',
            buttonStyle && ['transparent', 'alt-primary'].includes(buttonStyle)
              ? ''
              : 'ml-3'
          )}
          style={{
            width: '11px',
            marginTop: '-1px',
            marginRight: '-2px',
          }}
        >
          <img src="assets/icons/arrow-down.svg" />
        </span>

        {isMenuOpen && (
          <DropdownMenu
            style={popupMenuStyle}
            menuOptionsStyle={menuOptionsStyle}
            onCLickMenuOption={onClick}
            menuOptions={menuOptions}
            menuRef={menuRef}
          />
        )}
      </button>
    </>
  )
}

CDropdownButton.defaultProps = defaultProps
export default CDropdownButton

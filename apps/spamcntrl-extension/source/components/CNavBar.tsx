import classNames from 'classnames'
import React, { useEffect } from 'react'
import { AppContext } from '../context'
import { IUser } from '../models'
import { getNavbarHiddenItems } from '../store/slices/appSlice'
import CDotIcon from './CDotIcon'
import CDropdownButton, { IDropdownMenuOption } from './CDropdownButton'

interface CNavbarProps {
  user?: IUser | null
  onClickLogout?: () => void

  activeNavBarKey?: string
  navbarItems?: IDropdownMenuOption[]
  onClickNavbarItem?: (navbarItem: IDropdownMenuOption) => void
}
const defaultProps: CNavbarProps = {
  activeNavBarKey: 'dashboard',
  navbarItems: [],
}

const CNavbar: React.FC<CNavbarProps> = ({
  navbarItems,
  activeNavBarKey,
  onClickNavbarItem,
  onClickLogout,
}) => {
  const { user, setActiveNavbarKey } = React.useContext(AppContext)

  console.log('log: user', user)

  useEffect(() => {
    if (user) {
      setActiveNavbarKey && setActiveNavbarKey('dashboard')
    }
  }, [user])

  function _onClickNavbarItem(navbar: IDropdownMenuOption) {
    onClickNavbarItem && onClickNavbarItem(navbar)
  }

  function onClickMenuOption(option: IDropdownMenuOption) {
    if (option.key == 'logout') {
      onClickLogout && onClickLogout()
    } else {
      onClickNavbarItem && onClickNavbarItem(option)
    }
  }

  return (
    <div className="c-navbar bg-alt w-full px-4 flex justify-between text-sm items-center">
      {navbarItems
        ? navbarItems.map((navbar) => {
            const isActive = activeNavBarKey == navbar.key

            return (
              <span
                onClick={() => _onClickNavbarItem(navbar)}
                className={classNames(
                  'h-full flex items-center justify-center cursor-pointer relative',
                  isActive ? 'text-primary font-bold' : 'text-lnk font-[450]'
                )}
              >
                {navbar.title}

                {isActive && (
                  <span
                    className="absolute"
                    style={{
                      bottom: '6px',
                    }}
                  >
                    <CDotIcon size={3} />
                  </span>
                )}
              </span>
            )
          })
        : null}

      <CDropdownButton
        onClick={onClickMenuOption}
        menuOptions={getNavbarHiddenItems()}
        buttonStyle="transparent"
        style={{
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
        menuOptionsStyle={{
          marginTop: '8px',
          marginBottom: '8px',
        }}
        popupMenuStyle={{
          width: '88px',
          paddingLeft: '4px',
          paddingRight: '4px',
          right: '-10px',
          top: '29px',
        }}
        text={
          <span className="mr-1">
            {user && user.photoURL ? (
              <img
                className="w-6 h-6 rounded-full"
                src={user.photoURL}
                alt="Avatar"
              />
            ) : (
              <div className="overflow-hidden relative w-6 h-6 rounded-full">
                <svg
                  className="w-6 h-6 bg-gray-100 text-gray-400 border rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            )}
          </span>
        }
      />
    </div>
  )
}

CNavbar.defaultProps = defaultProps
export default CNavbar

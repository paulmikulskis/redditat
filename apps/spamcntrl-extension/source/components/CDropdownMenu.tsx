import classNames from 'classnames'
import React, { useContext } from 'react'
import { AppContext } from '../context'
import { useComponentVisible } from '../hooks'
import { IDropdownMenuItem } from '../models'
import {
  getSubscriptionLabelFromUser,
  getSubscriptionTypeFromUser,
} from '../utils'

export interface CDropdownMenuProps {
  onClickLogout?: () => void
  menuItems?: IDropdownMenuItem[]
}
const defaultProps: CDropdownMenuProps = {
  menuItems: [
    {
      key: 'dashboard',
      title: 'Dashboard',
    },
    {
      key: 'settings',
      title: 'Settings',
    },
  ],
}

const CDropdownMenu: React.FC<CDropdownMenuProps> = ({
  menuItems,
  onClickLogout,
}) => {
  const { user } = useContext(AppContext)

  const [dropdownRef, open, setOpen] = useComponentVisible(false)

  function onClickAvatar(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    setOpen(!open)
    e.preventDefault()
    e.stopPropagation()
  }

  function closeDropdown() {
    setOpen(false)
  }

  function _onClickLogout() {
    onClickLogout && onClickLogout()
  }

  function _onClickMenuItem() {
    closeDropdown()
  }

  const subscriptionType = getSubscriptionTypeFromUser(user)
  const subscriptionLabel = getSubscriptionLabelFromUser(user)

  function getSubscriptionColor() {
    switch (subscriptionType) {
      case 'freeTrial':
        return 'text-orange-600'
      case 'premium':
        return 'text-purple-600'
      default:
      case 'basic':
        return 'text-blue-600'
    }
  }

  return (
    user && (
      <div className="flex justify-center items-center h-full relative">
        <span
          className={classNames(
            'flex h-5 items-center px-2 text-xs font-semibold absolute bottom-2',
            getSubscriptionColor()
          )}
        >
          {subscriptionLabel}
        </span>

        <span
          className={classNames('c-dropdown-menu relative flex items-center')}
        >
          <span className="rounded-full cursor-pointer">
            <span className="h-full w-full" onClick={onClickAvatar}>
              {user.photoURL ? (
                <img
                  className="w-7 h-7 rounded-full"
                  src={user.photoURL}
                  alt="Avatar"
                />
              ) : (
                <div className="overflow-hidden relative w-7 h-7 rounded-full">
                  <svg
                    className="w-7 h-7 bg-gray-100 text-gray-400 border rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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

            <div
              ref={dropdownRef}
              className={`c-dropdown-menu_content absolute top-10 right-0 z-10 w-44 bg-white rounded shadow-xl shadow-gray-300 ${
                open ? 'block' : 'hidden'
              }`}
              data-popper-placement="bottom"
            >
              <div className="w-full h-full relative divide-y divide-primary-100">
                <div className="py-3 px-4 text-xs text-gray-600">
                  <div className="font-semibold">{user.displayName}</div>
                  {user.email && (
                    <div className="font-bold truncate">{user.email}</div>
                  )}
                </div>
                {menuItems && menuItems.length > 0 && (
                  <ul className="py-1 text-xs text-gray-600 font-semibold">
                    {menuItems?.map((menuItem) => {
                      return (
                        <li key={menuItem.key} onClick={_onClickMenuItem}>
                          <a
                            href="#"
                            className="block py-2 px-4 hover:bg-primary-100 hover:font-bold"
                          >
                            {menuItem.title}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
                <div className="py-1">
                  <a
                    href="#"
                    className="block py-2 px-4 text-xs text-gray-600 font-semibold hover:bg-primary-100 hover:font-bold"
                    onClick={_onClickLogout}
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </span>
        </span>
      </div>
    )
  )
}

CDropdownMenu.defaultProps = defaultProps
export default CDropdownMenu

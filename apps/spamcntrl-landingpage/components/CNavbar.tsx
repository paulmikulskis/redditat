import React from 'react'
import CButton from './CButton'
import classNames from 'classnames'
import CIconButton from './CIconButton'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export type TNavbarStyle = 'primary' | 'alt'

export interface INavbarItem {
  key: string
  title: string
  path: string
}

export interface CNavbarProps {
  navbarItems?: INavbarItem[]
  navbarStyle?: TNavbarStyle
}
const defaultProps: CNavbarProps = {
  navbarStyle: 'primary',
  navbarItems: [
    { key: 'home', title: 'Home', path: '/' },
    { key: 'contact', title: 'Contact', path: '/contact' },
    { key: 'about', title: 'About', path: '/about' },
  ],
}

const CNavbar: React.FC<CNavbarProps> = ({ navbarItems, navbarStyle }) => {
  const { user, login, logout } = useAuth()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)

  function onClickDropdownMenu() {
    setIsMenuOpen(true)
  }

  function onClickCloseDropdownMenu() {
    setIsMenuOpen(false)
  }

  function onClickLoginLogout() {
    if (user == null) {
      login()
    } else {
      logout()
    }
  }

  return (
    <div
      className={classNames(
        'w-full flex justify-between px-8 pt-[43px] items-center',
        'xl:px-[104px]'
      )}
    >
      <span
        className={classNames(
          'font-semibold font-poppins text-[34px] leading-[34.35px] cursor-pointer',
          navbarStyle === 'primary' && 'text-alt',
          navbarStyle === 'alt' && 'text-primary'
        )}
      >
        {navbarStyle === 'primary' && (
          <img
            src="logo/horizontal-logo-white.png"
            className="mt-[-20px] mb-[-20px] h-[100px]"
          />
        )}
        {navbarStyle === 'alt' && (
          <img
            src="logo/horizontal-logo.png"
            className="mt-[-20px] mb-[-20px] h-[100px]"
          />
        )}
      </span>
      <span
        className={classNames(
          'font-medium font-poppins items-center text-title hidden',
          'md:flex'
        )}
      >
        {navbarItems &&
          navbarItems.map((ni, index) => {
            const isActive = router.asPath == ni.path
            const isLast = index == navbarItems.length - 1
            return (
              <Link
                key={ni.key}
                className={classNames(
                  // isLast ? 'mr-[32px]' : 'mr-[47px]',
                  'mr-[47px]',
                  isActive ? 'font-bold' : 'font-medium',
                  navbarStyle === 'primary' && 'text-alt',
                  navbarStyle === 'alt' &&
                    (isActive ? 'text-txt' : 'text-lnk hover:text-txt'),
                  'relative leading-[21px] cursor-pointer'
                )}
                href={ni.path}
              >
                {ni.title}

                {isActive && (
                  <span
                    className={classNames(
                      'absolute left-0 right-0 mx-auto bottom-[-14px] w-[5px] h-[5px] rounded-full',
                      navbarStyle === 'primary' && 'bg-alt',
                      navbarStyle === 'alt' && 'bg-primary'
                    )}
                  ></span>
                )}
              </Link>
            )
          })}
        <span
          className={classNames(
            'mr-[32px]',
            navbarStyle === 'primary' && 'text-alt',
            navbarStyle === 'alt' && 'text-lnk hover:text-txt',
            'relative leading-[21px] cursor-pointer'
          )}
          onClick={onClickLoginLogout}
        >
          {user == null ? 'Log In' : 'Log Out'}
        </span>
        <span>
          <CButton
            text="Get Started"
            buttonStyle={navbarStyle === 'alt' ? 'primary' : 'alt'}
          />
        </span>
      </span>

      {/* Menu Dropdown for mobile*/}
      <span className={classNames('inline-block', 'md:hidden')}>
        <CButton
          text={<img src="/icons/menu.svg" />}
          buttonStyle="alt"
          style={{ width: '44px' }}
          onClick={onClickDropdownMenu}
        />
        {isMenuOpen && (
          <div className="bg-alt shadow-2xl rounded-l-databox fixed w-4/5 h-screen top-0 right-0 z-20">
            <div className="w-full flex justify-end mt-4 px-4">
              <CIconButton
                icon={<img src="/icons/cross.png" />}
                onClick={onClickCloseDropdownMenu}
              />
            </div>

            <div className="mt-4 px-4 flex flex-col">
              {navbarItems &&
                navbarItems.map((ni, index) => {
                  const isActive = router.asPath == ni.path
                  const isLast = index == navbarItems.length - 1
                  return (
                    <>
                      <Link
                        key={ni.key}
                        className={classNames(
                          isLast ? 'mr-[32px]' : 'mr-[47px]',
                          isActive ? 'font-bold' : 'font-medium',
                          'text-[24px] font-poppins relative leading-[21px] cursor-pointer text-txt'
                        )}
                        href={ni.path}
                      >
                        {ni.title}
                      </Link>

                      {!isLast && (
                        <span className="my-4 border-t border-t-[#cdcdcd] w-full"></span>
                      )}
                    </>
                  )
                })}
            </div>
          </div>
        )}
      </span>
    </div>
  )
}

CNavbar.defaultProps = defaultProps
export default CNavbar

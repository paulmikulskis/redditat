import React from 'react'
import { AppContext } from '../context'
import { IUser } from '../models'
import { getURL } from '../utils'
import CButton from './CButton'
import { IDropdownMenuOption } from './CDropdownButton'
import CIconButton from './CIconButton'

interface CHeaderProps {
  user?: IUser | null
  onClickLogout?: () => void

  activeNavBarKey?: string | null
  navbarItems?: IDropdownMenuOption[]
  onClickNavbarItem?: (navbarItem: IDropdownMenuOption) => void
}
const defaultProps: CHeaderProps = {
  activeNavBarKey: 'home',
  user: null,
  navbarItems: [],
}

const CHeader: React.FC<CHeaderProps> = ({}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)

  return (
    <div className="c-header bg-primary w-full">
      <span className="flex justify-between px-4 h-10">
        <span className="flex items-center">
          <span className="text-alt font-black text-title">
            <img
              src={getURL('assets/images/horizontal-logo-white.png')}
              className="h-[47px]"
            />
          </span>
        </span>
        <span className="space-x-4 flex items-center">
          <span>
            <CButton
              icon={<img src={getURL('assets/icons/crown.svg')} />}
              buttonStyle="alt"
              text="Upgrade"
              style={{
                borderRadius: '3px',
              }}
            />
          </span>
          <span className="h-full flex items-center">
            <CIconButton
              icon={<img src={getURL('assets/icons/bell.svg')} />}
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey('notifications')
              }}
            />
          </span>
          <span className="h-full flex items-center">
            <CIconButton
              icon={<img src={getURL('assets/icons/x-cross.svg')} />}
              onClick={() => {
                window.close()
              }}
            />
          </span>
        </span>
      </span>
    </div>
  )
}

CHeader.defaultProps = defaultProps
export default CHeader

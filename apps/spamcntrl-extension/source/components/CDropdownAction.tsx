import classNames from 'classnames'
import React from 'react'
import { useComponentVisible } from '../hooks'
import { IDropdownMenuItem } from '../models'

export interface CDropdownActionProps {
  icon: React.ReactNode
  actions: IDropdownMenuItem[]
  onClickDropdown?: (action: IDropdownMenuItem) => void
  selected?: string | number | undefined | null
}
const defaultProps: CDropdownActionProps = {
  icon: null,
  actions: [],
}

const CDropdownAction: React.FC<CDropdownActionProps> = ({
  icon,
  actions,
  onClickDropdown,
  selected,
}) => {
  const [dropdownRef, open, setOpen] = useComponentVisible(false)

  function _onClickAction(action: IDropdownMenuItem) {
    if (
      action.hideOnClick == null ||
      action.hideOnClick == undefined ||
      action.hideOnClick == true
    ) {
      setOpen(false)
    }

    onClickDropdown && onClickDropdown(action)
    action && action.onClick && action.onClick()
  }

  return (
    <span className="relative">
      <span className="cursor-pointer hover" onClick={() => setOpen(true)}>
        {icon}
      </span>
      <span
        ref={dropdownRef}
        className={classNames(
          open ? 'flex' : 'hidden',
          'z-10 w-44 h-auto flex-col absolute top-6 right-0 bg-white rounded shadow-xl shadow-gray-30 divide-y divide-primary-100'
        )}
      >
        {actions.map((action) => {
          return (
            <div
              key={action.key}
              className={classNames(
                selected == action.key
                  ? 'bg-primary-200 text-gray-600 font-bold'
                  : 'hover:bg-primary-100 text-gray-600 hover:font-bold',
                'w-full py-3 px-4 text-xs cursor-pointer'
              )}
              onClick={() => _onClickAction(action)}
            >
              {action.title}
            </div>
          )
        })}
      </span>
    </span>
  )
}

CDropdownAction.defaultProps = defaultProps
export default CDropdownAction

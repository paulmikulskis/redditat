import classNames from 'classnames'
import React from 'react'

export type TButtonTabKey =
  | 'my-videos'
  | 'schedule-purge'
  | 'ongoing-purge'
  | 'sp-schedule-videos'
  | 'sp-scheduled-videos'

export interface IButtonTab {
  key: TButtonTabKey
  label: string
}

export interface CButtonTabsProps {
  tabs: IButtonTab[]
  activeTabKey?: TButtonTabKey
  onClickTab?: (tab: IButtonTab) => void
  style?: object
  tabsStyle?: object
}
const defaultProps: CButtonTabsProps = {
  tabs: [],
  activeTabKey: 'my-videos',
}

const CButtonTabs: React.FC<CButtonTabsProps> = ({
  tabs,
  activeTabKey,
  onClickTab,
  style,
  tabsStyle,
}) => {
  function _onClickTab(tab: IButtonTab) {
    onClickTab && onClickTab(tab)
  }

  return (
    <div className="flex h-6 items-center justify-between" style={style}>
      {tabs.map((tab) => {
        const isActive = tab.key == activeTabKey

        return (
          <span
            onClick={() => _onClickTab(tab)}
            className={classNames(
              'text-lsm cursor-pointer flex justify-center items-center',

              isActive
                ? `font-bold text-primary rounded-little bg-tabs`
                : `font-[450] text-lnk`
            )}
            style={{
              width: '100px',
              height: '24px',
              ...tabsStyle,
            }}
          >
            {tab.label}
          </span>
        )
      })}
    </div>
  )
}

CButtonTabs.defaultProps = defaultProps
export default CButtonTabs

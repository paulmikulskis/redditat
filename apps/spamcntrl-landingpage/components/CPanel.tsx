import classNames from 'classnames'
import React from 'react'

export interface CPanelProps {
  className?: string
  children?: React.ReactNode
  style?: Object
}
const defaultProps: CPanelProps = {}

const CPanel: React.FC<CPanelProps> = ({ className, children, style }) => {
  return (
    <div className={classNames(className, 'w-full relative')} style={style}>
      {children}
    </div>
  )
}

CPanel.defaultProps = defaultProps
export default CPanel

import React from 'react'

interface IDropdownMenuItem {
  key: string
  title: React.ReactNode
  onClick?: () => void
  hideOnClick?: boolean
}

export default IDropdownMenuItem

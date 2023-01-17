import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'

export interface CIconLinkProps {
  className?: string
  icon: React.ReactNode
  style?: object
  href: string
}
const defaultProps: CIconLinkProps = {
  icon: null,
  href: '',
}

const CIconLink: React.FC<CIconLinkProps> = ({
  className,
  icon,
  href,
  ...props
}) => {
  return (
    <Link
      {...props}
      className={classNames('cursor-pointer h-auto w-auto', className)}
      href={href}
      target="_blank"
    >
      {icon}
    </Link>
  )
}

CIconLink.defaultProps = defaultProps
export default CIconLink

import classNames from 'classnames'
import React from 'react'

export interface CSpamalyticsHeaderProps {
  displayName?: string | null
  photoURL?: string | null
}
const defaultProps: CSpamalyticsHeaderProps = {
  displayName: '',
}

const CSpamalyticsHeader: React.FC<CSpamalyticsHeaderProps> = ({
  displayName,
  photoURL,
}) => {
  return (
    <div className={classNames('items-center', 'xl:flex')}>
      <span className={classNames('flex justify-center', 'xl:justify-start')}>
        {photoURL ? (
          <img
            src={photoURL}
            className={classNames('w-[100px] h-[100px]', 'xl:mr-4')}
          />
        ) : null}
      </span>
      <span
        className={classNames(
          'text-[32px] font-medium text-txt text-center flex',
          'xl:max-w-[900px] xl:text-[32px]'
        )}
      >
        {displayName}&apos;s Spamalytics (Spam Analytics)
      </span>
    </div>
  )
}

CSpamalyticsHeader.defaultProps = defaultProps
export default CSpamalyticsHeader

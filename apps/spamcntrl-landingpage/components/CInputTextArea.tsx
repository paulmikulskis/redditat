import classNames from 'classnames'
import React from 'react'

type TInputType = 'modal' | 'normal'

interface CInputTextAreaProps {
  placeholder?: string
  label?: string
}
const defaultProps: CInputTextAreaProps = {
  placeholder: 'Search Videos...',
}

const CInputTextArea: React.FC<CInputTextAreaProps> = ({ label, ...props }) => {
  return (
    <>
      {label && (
        <div className="text-lnk text-base mb-2 w-full text-left">{label}</div>
      )}

      <div
        className={classNames(
          'h-auto relative w-full rounded-little bg-white flex flex-col',
          'bg-bgc border border-bgc focus-within:border-primary focus-within:bg-alt'
        )}
      >
        <textarea
          className={classNames(
            'w-full h-full outline-none bg-transparent placeholder:font-[450] text-txt font-bold placeholder:text-lnk',
            'placeholder:text-base px-3 py-[6px]'
          )}
          rows={4}
          {...props}
        />
      </div>
    </>
  )
}

CInputTextArea.defaultProps = defaultProps
export default CInputTextArea

import classNames from 'classnames'
import React, { useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'

interface CAccordionProps {
  title?: string
  content?: string
}
const defaultProps: CAccordionProps = {
  title: '',
  content: '',
}

const CAccordion: React.FC<CAccordionProps> = ({ title, content }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex w-full flex-col bg-alt rounded-little px-3">
      <div
        onClick={() => setOpen(!open)}
        className={classNames(
          'font-semibold text-sm text-txt w-full cursor-pointer'
        )}
        style={{
          paddingTop: '10px',
          paddingBottom: open ? '10px' : '8px',
          lineHeight: '12px',
        }}
      >
        {title}
      </div>

      {open && (
        <div
          className="h-0 border-t w-full"
          style={{ borderColor: '#F2F4F6' }}
        ></div>
      )}

      {open && (
        <div className="w-full mt-2 mb-3 text-xxsm text-lnk font-[450]">
          {content}
        </div>
      )}
    </div>
  )
}

CAccordion.defaultProps = defaultProps
export default CAccordion

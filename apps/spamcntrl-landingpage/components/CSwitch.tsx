import classNames from 'classnames'
import React from 'react'

export interface CSwitchProps {
  label1?: string
  label2?: string
  value?: boolean
  onChange?: (bool: boolean) => void
}
const defaultProps: CSwitchProps = {}

const CSwitch: React.FC<CSwitchProps> = ({
  label1,
  label2,
  value,
  onChange,
}) => {
  function onChangeSwitch(e: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e.target.checked)
  }

  return (
    <span className="flex items-center">
      {label1 && (
        <span
          className={classNames(
            'cursor-pointer mr-5 text-base leading-[24px] font-medium',
            value ? 'text-lnk' : 'text-txt'
          )}
          onClick={() => {
            onChange && onChange(false)
          }}
        >
          {label1}
        </span>
      )}

      <label
        htmlFor="default-toggle"
        className="inline-flex relative items-center cursor-pointer"
      >
        <input
          type="checkbox"
          value=""
          id="default-toggle"
          className="sr-only peer"
          onChange={onChangeSwitch}
          checked={value}
        />
        <div className="w-[60px] h-[30px] bg-[#33C286] bg-opacity-[0.45] peer-focus:outline-none rounded-full peer peer-checked:after:right-[5px] peer-checked:after:left-[unset] after:content-[''] after:absolute after:top-[5px] after:left-[5px] after:bg-[#33C286] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:bg-opacity-[0.45] peer-checked:after:bg-primary"></div>
      </label>

      {label2 && (
        <span
          className={classNames(
            'cursor-pointer ml-5 text-base leading-[24px] font-medium',
            !value ? 'text-lnk' : 'text-txt'
          )}
          onClick={() => {
            onChange && onChange(true)
          }}
        >
          {label2}
        </span>
      )}
    </span>
  )
}

CSwitch.defaultProps = defaultProps
export default CSwitch

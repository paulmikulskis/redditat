import React from 'react'

interface CCheckboxProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  value?: boolean
  label?: string
}
const defaultProps: CCheckboxProps = {
  label: 'Select All',
}

const CCheckbox: React.FC<CCheckboxProps> = ({ onChange, value, label }) => {
  return (
    <label className="mr-1 text-lsm text-txt leading-[12.65px] font-bold flex items-center">
      <input
        className="mr-1"
        type="checkbox"
        checked={value != null ? value : undefined}
        onChange={onChange}
      />
      <span className="">{label}</span>
    </label>
  )
}

CCheckbox.defaultProps = defaultProps
export default CCheckbox

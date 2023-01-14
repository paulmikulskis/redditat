import classNames from 'classnames'
import React from 'react'

interface CInputCardExpiryDateFieldProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number | readonly string[] | undefined
  style?: object
  placeholder?: string
  maxLength?: number
}

const CInputCardExpiryDateField: React.FC<CInputCardExpiryDateFieldProps> = ({
  style,
  ...props
}) => {
  return (
    <input
      style={style}
      className={classNames(
        'w-full h-full outline-none bg-transparent placeholder:font-light text-txt font-bold placeholder:text-lnk',
        'placeholder:text-xsm py-[6px]'
      )}
      {...props}
    />
  )
}

interface CInputCardExpiryDateProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number | readonly string[] | undefined
  style?: object
  label?: string
}
const defaultProps: CInputCardExpiryDateProps = {}

const CInputCardExpiryDate: React.FC<CInputCardExpiryDateProps> = ({
  style,
  label,
}) => {
  return (
    <>
      <div className="text-lnk text-xsm mb-2 w-full text-left">{label}</div>
      <div
        className={classNames(
          'relative w-full rounded-little flex items-center bg-white',
          'px-3 h-6 text-xsm bg-bgc border border-bgc focus-within:border-primary focus-within:bg-alt'
        )}
        style={style}
      >
        <CInputCardExpiryDateField
          key="cardNumber-1"
          style={{ width: '12px' }}
          placeholder={'01'}
          maxLength={2}
        />
        <span className="mx-[14px]">/</span>
        <CInputCardExpiryDateField
          key="cardNumber-2"
          style={{ width: '25px' }}
          placeholder={'1969'}
          maxLength={4}
        />
      </div>
    </>
  )
}

CInputCardExpiryDate.defaultProps = defaultProps
export default CInputCardExpiryDate

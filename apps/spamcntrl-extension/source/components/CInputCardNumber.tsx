import classNames from 'classnames'
import React from 'react'

interface CInputCardNumberFieldProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number | readonly string[] | undefined
  style?: object
}

const CInputCardNumberField: React.FC<CInputCardNumberFieldProps> = ({
  style,
  ...props
}) => {
  return (
    <input
      style={style}
      className={classNames(
        'w-full h-full outline-none bg-transparent placeholder:font-light text-txt font-bold placeholder:text-lnk text-center',
        'placeholder:text-xsm py-[6px]'
      )}
      placeholder={'0000'}
      maxLength={4}
      {...props}
    />
  )
}

interface CInputCardNumberProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number | readonly string[] | undefined
  style?: object
  label?: string
}
const defaultProps: CInputCardNumberProps = {}

const CInputCardNumber: React.FC<CInputCardNumberProps> = ({
  style,
  label,
}) => {
  const inputStyle = {
    width: '29px',
  }
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
        <CInputCardNumberField key="cardNumber-1" style={inputStyle} />
        <span className="mx-3">-</span>
        <CInputCardNumberField key="cardNumber-2" style={inputStyle} />
        <span className="mx-3">-</span>
        <CInputCardNumberField key="cardNumber-3" style={inputStyle} />
        <span className="mx-3">-</span>
        <CInputCardNumberField key="cardNumber-4" style={inputStyle} />
      </div>
    </>
  )
}

CInputCardNumber.defaultProps = defaultProps
export default CInputCardNumber

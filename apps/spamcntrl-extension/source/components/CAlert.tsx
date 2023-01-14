import React, { useEffect } from 'react'
import { INotifData } from '../models'
import classnames from 'classnames'

export interface CAlertProps extends INotifData {
  timer?: number
}
const defaultProps: CAlertProps = {
  type: 'info',
  message: '',
  timer: 3000,
}

const CAlert: React.FC<CAlertProps> = ({ alertKey, type, message, timer }) => {
  const [showAlert, setShowAlert] = React.useState<Boolean>(false)

  useEffect(() => {
    const hasAlert = message && message.length > 0

    if (hasAlert) {
      setShowAlert(true)
    }

    const timeId = hasAlert
      ? setTimeout(() => {
          setShowAlert(false)
        }, timer)
      : undefined

    return () => {
      clearTimeout(timeId)
    }
  }, [alertKey])

  function onClickClose() {
    setShowAlert(false)
  }

  function getAlertClassName() {
    switch (type) {
      case 'success':
        return 'bg-teal-100 border-teal-500 text-teal-900'
      case 'error':
        return 'bg-rose-100 border-rose-500 text-rose-900'
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-900'
    }
  }

  function getIcon() {
    switch (type) {
      case 'success':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-teal-500 mr-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className="fill-current h-6 w-6 text-rose-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-blue-500 mr-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  function getHeader() {
    switch (type) {
      case 'success':
        return 'Success'
      case 'error':
        return 'Error'
      case 'info':
      default:
        return 'Info'
    }
  }

  return (
    showAlert && (
      <div
        className={classnames(
          'w-full border-l-4 rounded-b px-4 py-3 shadow-md fixed bottom-0 z-20',
          getAlertClassName()
        )}
        role="alert"
      >
        <div className="flex">
          <div className="py-1">{getIcon()}</div>
          <div className="w-full">
            <p className="text-sm font-bold">{getHeader()}</p>
            <p className="text-sm">{message}</p>
          </div>

          {/**Close */}
          <div className="py-1" onClick={onClickClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  )
}

CAlert.defaultProps = defaultProps
export default CAlert

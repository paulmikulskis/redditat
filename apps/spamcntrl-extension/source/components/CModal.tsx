import React from 'react'
import TModalType from '../models/TModalType'
import { getURL } from '../utils'
import CButton from './CButton'
import CIconButton from './CIconButton'

export interface CModalProps {
  title?: React.ReactNode
  content?: React.ReactNode
  type?: TModalType
  ok?: () => Promise<void> | null | undefined
  cancel?: () => Promise<void> | null | undefined
  okText?: string
  cancelText?: string
  show?: Boolean
  okDisabled?: boolean
  hasOkCancelButton?: boolean
  contentStyle?: object
}

export const cModalDefaultProps: CModalProps = {
  type: 'info',
  title: 'Deactivate account',
  content: (
    <p className="text-sm text-gray-500">
      Are you sure you want to deactivate your account? All of your data will be
      permanently removed. This action cannot be undone.
    </p>
  ),
  ok: undefined,
  cancel: undefined,
  okText: 'Yes',
  cancelText: 'No',
  show: false,
  okDisabled: false,
  hasOkCancelButton: true,
}

const CModal: React.FC<CModalProps> = ({
  title,
  content,
  ok,
  cancel,
  okText,
  cancelText,
  show,
  okDisabled,
  hasOkCancelButton,
  contentStyle,
}) => {
  if (!show) {
    return null
  }

  return (
    <div
      className="c-modal relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        style={{
          backdropFilter: 'blur(2px)',
          background: 'rgba(31, 41, 62, 0.2)',
        }}
      ></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex justify-center min-h-full text-center items-center">
          {/* Modal Container */}
          <div className=" p-4 relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-[280px]">
            <CIconButton
              className="absolute top-[17px] right-4"
              icon={<img src={getURL('assets/icons/xcross-black.svg')} />}
              onClick={cancel}
            />
            <div className="flex flex-col">
              {/* Modal Title */}
              <div className="flex justify-center items-center font-bold text-txt text-sm modal-title">
                {title}
              </div>

              {/* Modal Content */}
              <div className="mt-4 text-center" style={contentStyle}>
                <div className="c-modal-content max-h-80 overflow-y-auto font-medium text-sm text-txt">
                  {content}
                </div>
              </div>
            </div>

            {hasOkCancelButton && (ok || cancel) && (
              <div className="mt-4 flex justify-center items-center space-x-3">
                {cancel && (
                  <CButton
                    buttonStyle="alt-lnk"
                    center
                    onClick={cancel}
                    text={cancelText}
                    className="min-w-[90px] h-6"
                  />
                )}{' '}
                {ok && (
                  <CButton
                    buttonStyle="primary"
                    onClick={ok}
                    text={okText}
                    className="min-w-[90px] h-6"
                    disabled={okDisabled}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

CModal.defaultProps = cModalDefaultProps
export default CModal

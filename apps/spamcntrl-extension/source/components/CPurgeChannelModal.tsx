import React from 'react'
import { PER_CHANNEL } from '../constants/PaymentConstants'
import CModal from './CModal'

interface CPurgeChannelModalProps {
  show: Boolean
  onClose?: () => Promise<void>
  onPurge?: () => Promise<void>
  hasDiscount?: Boolean
}

const defaultProps: CPurgeChannelModalProps = {
  show: false,
  hasDiscount: false,
}

const CPurgeChannelModal: React.FC<CPurgeChannelModalProps> = ({
  show,
  onClose,
  onPurge,
  hasDiscount,
}) => {
  async function _onPurge() {
    onPurge && onPurge()
    onClose && onClose()
  }

  return (
    <CModal
      show={show}
      title="Purge Youtube Channel"
      content={
        <>
          Are you sure you want to purge your youtube channel for{' '}
          <span className="font-bold text-red-400">
            ${hasDiscount ? PER_CHANNEL?.discountAmount : PER_CHANNEL?.amount}
          </span>
          .
        </>
      }
      okText="Purge"
      cancelText="Cancel"
      ok={_onPurge}
      cancel={onClose}
    />
  )
}

CPurgeChannelModal.defaultProps = defaultProps
export default CPurgeChannelModal

import classNames from 'classnames'
import React from 'react'
import { getURL } from '../utils'
import CIconButton from './CIconButton'
import CModal from './CModal'
import CModalIcon from './CModalIcon'
import CTrashIcon from './CTrashIcon'

export type TCardStyle = 'normal' | 'modal'
export type TPaymentCardType = 'visa' | 'mastercard'

export interface CPaymentCardProps {
  name?: string
  last4?: string
  isDefault?: boolean
  type?: TPaymentCardType
  cardStyle?: TCardStyle
  isSelected?: boolean
  hasDelete?: boolean
  onClick?: () => void
}
const defaultProps: CPaymentCardProps = {
  isDefault: false,
  type: 'mastercard',
  cardStyle: 'normal',
  isSelected: false,
  hasDelete: false,
}

const CPaymentCard: React.FC<CPaymentCardProps> = ({
  name,
  last4,
  isDefault,
  type,
  cardStyle,
  isSelected,
  hasDelete,
  onClick,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] =
    React.useState<boolean>(false)

  function showDeleteModal() {
    setIsShowDeleteModal(true)
  }

  function hideDeleteModal() {
    setIsShowDeleteModal(false)
  }

  const isNormalStyle = cardStyle == 'normal'
  const isModalStyle = cardStyle == 'modal'

  return (
    <div
      onClick={onClick}
      className={classNames(
        'rounded-databox w-full flex items-center justify-between pl-3 pr-4 group',
        isNormalStyle && 'h-[44px] bg-alt',

        isModalStyle && 'h-10 border',
        isModalStyle &&
          (isSelected ? 'border-primary bg-alt' : 'border-transparent bg-bgc')
      )}
    >
      <span className="flex">
        <img
          className="w-[26px] mr-3"
          src={getURL(
            type == 'mastercard'
              ? 'assets/images/mastercard.svg'
              : 'assets/images/visa.svg'
          )}
        />
        <span className="text-txt text-lsm font-bold w-[74px] truncate mr-4">
          {name}
        </span>
        <span className="flex text-lnk text-lsm font-[450] w-[51px] truncate mr-4">
          <span className="mr-[2px]">**** </span>
          <span>{last4}</span>
        </span>
        {isNormalStyle && isDefault && (
          <span className="text-[#33C286] text-xsm italic flex items-center">
            Default
          </span>
        )}
      </span>
      {hasDelete && (
        <span className="hidden group-hover:inline-block">
          <CIconButton
            onClick={showDeleteModal}
            icon={<CTrashIcon size={12} className="fill-[#EC4D4D]" />}
          />
        </span>
      )}

      {/* Delete Modal */}
      <CModal
        show={isShowDeleteModal}
        title={
          <CModalIcon
            type="error"
            icon={<CTrashIcon size={12} className="fill-[#EC4D4D]" />}
          />
        }
        content="Are you sure you want to remove this payment card?"
        ok={async () => {
          hideDeleteModal()
        }}
        cancel={async () => {
          hideDeleteModal()
        }}
      />
    </div>
  )
}

CPaymentCard.defaultProps = defaultProps
export default CPaymentCard

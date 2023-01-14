import React from 'react'
import {
  getDefaultPaymentCard,
  getNotDefaultPaymentCards,
} from '../store/slices/subscriptionSlice'
import { getURL } from '../utils'
import CButton, { CButtonProps } from './CButton'
import CCheckIcon from './CCheckIcon'
import CModal, { CModalProps } from './CModal'
import CModalIcon from './CModalIcon'
import CPaymentCard, { CPaymentCardProps } from './CPaymentCard'

interface CCheckoutModalCardSelectionProps {
  confirmText?: string
  onClickPaymentPlan?: () => void
}

const CCheckoutModalCardSelection: React.FC<CCheckoutModalCardSelectionProps> =
  ({ confirmText, onClickPaymentPlan }) => {
    const defaultCard = getDefaultPaymentCard()
    const otherCards = getNotDefaultPaymentCards()

    const [selectedCard, setSelectedCard] =
      React.useState<CPaymentCardProps | null | undefined>(null)

    React.useEffect(() => {
      setSelectedCard(defaultCard)
    }, [defaultCard])

    function onClickCheckoutCard(card: CPaymentCardProps | null | undefined) {
      setSelectedCard(card)
    }

    return (
      <div className="flex flex-col">
        <div>
          <div className="text-xsm text-lnk text-left">Default Card</div>
          <div className="mt-2 cursor-pointer">
            <CPaymentCard
              cardStyle="modal"
              key={defaultCard?.last4}
              name={defaultCard?.name}
              last4={defaultCard?.last4}
              isDefault={defaultCard?.isDefault}
              type={defaultCard?.type}
              isSelected={
                selectedCard &&
                defaultCard &&
                selectedCard.last4 == defaultCard.last4
                  ? true
                  : false
              }
              onClick={() => onClickCheckoutCard(defaultCard)}
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xsm text-lnk text-left">Other Cards</div>
          <div className="mt-2 space-y-3">
            {otherCards.map((card) => {
              return (
                <div className="cursor-pointer">
                  <CPaymentCard
                    key={card.last4}
                    cardStyle="modal"
                    name={card?.name}
                    last4={card?.last4}
                    isDefault={card?.isDefault}
                    type={card?.type}
                    isSelected={
                      selectedCard && selectedCard.last4 == card.last4
                        ? true
                        : false
                    }
                    onClick={() => onClickCheckoutCard(card)}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <CButton
            text={confirmText}
            buttonStyle="primary"
            style={{ minWidth: '120px' }}
            onClick={onClickPaymentPlan}
          />
        </div>
      </div>
    )
  }

interface CCheckoutButtonProps extends CButtonProps {
  confirmText?: string
  confirmHeader?: string
  onClick?: () => void
}
const defaultProps: CCheckoutButtonProps = {
  confirmText: '',
  confirmHeader: '',
}

const CCheckoutButton: React.FC<CCheckoutButtonProps> = ({
  text,
  confirmText,
  confirmHeader,
  onClick,
  ...props
}) => {
  const defaultCard = getDefaultPaymentCard()
  const otherCards = getNotDefaultPaymentCards()

  function onClickPaymentPlan() {
    setConfirmationModalProps({
      show: true,
      title: (
        <div className="flex flex-col items-center">
          <div>
            <CModalIcon icon={<CCheckIcon />} type="success" />
          </div>
          <div className="mt-[13px] font-bold">Payment Successful</div>
        </div>
      ),
      content: (
        <span className="text-lnk text-xsm">
          Congrats! You have successfully purchase the Pro plan. Enjoy all the
          pro features.
        </span>
      ),
      contentStyle: {
        marginTop: '8px',
      },
      cancel: async () => {
        hideConfirmationModal()
      },
      hasOkCancelButton: false,
    })
  }

  const [confirmationModalProps, setConfirmationModalProps] =
    React.useState<CModalProps>({
      show: false,
      title: '',
      content: '',
    })

  function hideConfirmationModal() {
    setConfirmationModalProps({
      show: false,
      title: '',
      content: '',
    })
  }

  function _onClick() {
    // TODO: check if has payment card
    if (otherCards.length > 0 || defaultCard) {
      setConfirmationModalProps({
        show: true,
        title: confirmHeader,
        content: (
          <CCheckoutModalCardSelection
            onClickPaymentPlan={onClickPaymentPlan}
            confirmText={confirmText}
          />
        ),
        cancel: async () => {
          hideConfirmationModal()
        },
        hasOkCancelButton: false,
      })
    } else {
      setConfirmationModalProps({
        show: true,
        title: (
          <CModalIcon icon={<img src={getURL('assets/icons/card.svg')} />} />
        ),
        content: (
          <div className="flex flex-col">
            <div className="text-center">
              You don’t have any card added. Add a card to purchase Pro plan.
            </div>
            <div className="mt-4 flex justify-center">
              <CButton
                text="+ Add Card"
                buttonStyle="primary"
                style={{ width: '90px' }}
              />
            </div>
          </div>
        ),
        cancel: async () => {
          hideConfirmationModal()
        },
        hasOkCancelButton: false,
      })
    }
  }

  return (
    <>
      <CButton
        style={{
          minWidth: '100px',
        }}
        buttonStyle={'pcard-primary'}
        {...props}
        onClick={onClick ? onClick : _onClick}
        text={text}
      />

      <CModal {...confirmationModalProps} />
    </>
  )
}

CCheckoutButton.defaultProps = defaultProps
export default CCheckoutButton

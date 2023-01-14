import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { AppContext } from '../context'
import {
  getDefaultPaymentCard,
  getNotDefaultPaymentCards,
  getSubscriptionPaymentPlansShortcut,
} from '../store/slices/subscriptionSlice'

import { getURL } from '../utils'
import CAddCardButton from './CAddCardButton'
import CButton from './CButton'
import CCheckoutButton from './CCheckoutButton'
import CPaymentCard from './CPaymentCard'
import CPaymentPlanCard from './CPaymentPlanCard'

interface CSubscriptionPageProps {}
const defaultProps: CSubscriptionPageProps = {}

const CSubscriptionPage: React.FC<CSubscriptionPageProps> = ({}) => {
  const paymentPlans = getSubscriptionPaymentPlansShortcut()

  const { setActiveNavbarKey } = React.useContext(AppContext)

  const defaultCard = getDefaultPaymentCard()

  function singlePurgeOnclick() {
    setActiveNavbarKey && setActiveNavbarKey('single-purge')
  }

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-bold text-title text-txt">Current Plan</span>
        <span>
          <CButton
            style={{
              width: '100px',
            }}
            buttonStyle="tab"
            text="Pricing Plan"
            icon={<img src={getURL('assets/icons/bars.svg')} />}
            onClick={() => {
              setActiveNavbarKey && setActiveNavbarKey('pricing-plan')
            }}
          />
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-[14px]">
        {paymentPlans.map((pplan) => {
          return (
            <CPaymentPlanCard
              key={pplan.title}
              title={pplan.title}
              description={pplan.description}
              amount={pplan.amount}
              subAmount={pplan.subAmount}
              note={pplan.note}
              buttonText={pplan.buttonText}
              style={pplan.style}
              confirmText={pplan.confirmText}
              confirmHeader={pplan.confirmHeader}
            />
          )
        })}
      </div>

      <div className="mt-3 flex justify-center items-center flex-col">
        <div>
          <CCheckoutButton
            style={{ minWidth: '120px' }}
            text="Channel Purge"
            confirmText={'Buy Now - $99.99'}
            confirmHeader={'Channel Purge'}
            buttonStyle="primary"
          />
        </div>
        <div>
          <CButton
            text="Single Purge"
            style={{ width: '120px' }}
            buttonStyle="none"
            onClick={singlePurgeOnclick}
          />
        </div>
      </div>

      <div className="mt-[6px]">
        <div className="flex justify-between">
          <span className="font-bold text-title text-txt">My Cards</span>
          <span>
            <CButton
              style={{
                width: '128px',
              }}
              buttonStyle="tab"
              text="Transaction History"
              icon={<img src={getURL('assets/icons/round-dollar.svg')} />}
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey('transaction-history')
              }}
            />
          </span>
        </div>

        <div className="mt-[6px] flex flex-col w-full space-y-2">
          {defaultCard && (
            <CPaymentCard
              name={defaultCard.name}
              last4={defaultCard.last4}
              isDefault={defaultCard.isDefault}
              type={defaultCard.type}
              hasDelete
            />
          )}

          {getNotDefaultPaymentCards().map((card) => {
            return (
              <CPaymentCard
                name={card.name}
                last4={card.last4}
                type={card.type}
                hasDelete
              />
            )
          })}
        </div>

        <div className="mt-[18px] flex justify-center">
          <CAddCardButton />
        </div>
      </div>
    </div>
  )
}

CSubscriptionPage.defaultProps = defaultProps
export default CSubscriptionPage

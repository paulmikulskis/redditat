import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { AppContext } from '../context'
import { getSubscriptionPaymentPlans } from '../store/slices/subscriptionSlice'

import { getURL } from '../utils'
import CIconButton from './CIconButton'
import CPaymentPlanCard from './CPaymentPlanCard'

interface CPricingPlanPageProps {}
const defaultProps: CPricingPlanPageProps = {}

const CPricingPlanPage: React.FC<CPricingPlanPageProps> = ({}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)

  const paymentPlans = getSubscriptionPaymentPlans()

  return (
    <div>
      <div className="w-full flex justify-between">
        <span className="w-full flex items-center h-full">
          <span className="mr-2 flex items-center h-full">
            <CIconButton
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey('subscription')
              }}
              icon={<img src={getURL('assets/icons/arrow-back.svg')} />}
            />
          </span>
          <span className="font-bold text-title text-txt flex items-center h-full">
            Pricing Plan
          </span>
        </span>
      </div>

      <div className="mt-3">
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
      </div>
    </div>
  )
}

CPricingPlanPage.defaultProps = defaultProps
export default CPricingPlanPage

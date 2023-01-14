import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { CPaymentCardProps } from '../../components/CPaymentCard'
import { CPaymentPlanCardProps } from '../../components/CPaymentPlanCard'

interface SubscriptionSlice {
  paymentPlans: CPaymentPlanCardProps[]
  paymentCards: CPaymentCardProps[]
}

const defaultState: SubscriptionSlice = {
  paymentCards: [
    {
      name: 'Parth Nagraj',
      last4: '2234',
      isDefault: true,
      type: 'mastercard',
    },
    {
      name: 'Parth Nagraj',
      last4: '1445',
      isDefault: false,
      type: 'visa',
    },
    {
      name: 'Parth Nagraj',
      last4: '3245',
      isDefault: false,
      type: 'mastercard',
    },
  ],
  paymentPlans: [
    {
      title: 'Free Tier',
      description:
        'In the free tier you can enjoy all the pro feature at free. You can purge 5 videos in free tier. Also you can Channel purge alongside with single purge if you exceed 30 videos limitations.',
      amount: '5 Videos',
      note: '3 Videos Remaining',
      buttonText: 'Upgrade to Pro',
      confirmHeader: 'Upgrade to Pro',
      confirmText: 'Buy Now - $9.99',
    },
    {
      title: 'Pro',
      description:
        'You can purge upto 30 videos every month in Pro plan. Also you can Channel purge alongside with single purge if you exceed 30 videos limitations. Upgrage to Enterprise plan for unlimited Purge.',
      amount: '$9.99',
      subAmount: '/mo',
      buttonText: 'Buy Now',
      confirmHeader: 'Pro',
      confirmText: 'Buy Now - $9.99',
    },
    {
      title: 'Enterprise',
      description:
        'You can purge upto Unlimited videos every month in Enterprise plan. You don’t need to pay extra for Channel purge. Basically you can enjoy everything Unlimited.',
      amount: '$29.99',
      subAmount: '/mo',
      buttonText: 'Buy Now',
      style: {
        height: '172px',
      },
      confirmHeader: 'Enterprise',
      confirmText: 'Buy Now - $29.99',
    },
    {
      title: 'Channel Purge',
      description: 'In this plan you can purge your whole Youtube channel.',
      amount: '$99.99',
      buttonText: 'Buy Now',
      style: {
        height: '172px',
      },
      confirmHeader: 'Channel Purge',
      confirmText: 'Buy Now - $99.99',
    },
    {
      title: 'Single Purge',
      description: 'In this plan you can purge single videos ',
      amount: '$1.99',
      subAmount: '/videos',
      buttonText: 'Buy Now',
      style: {
        height: '120px',
      },
      confirmHeader: 'Single Purge',
      confirmText: 'Buy Now - $1.99',
    },
  ],
}

const modalSlice = createSlice({
  name: 'subscription',
  initialState: defaultState,
  reducers: {},
})

export const {} = modalSlice.actions
export default modalSlice.reducer

export function getSubscriptionPaymentPlans() {
  return useSelector((state: RootState) => state.subscription.paymentPlans)
}

export function getSubscriptionPaymentPlansShortcut() {
  return useSelector((state: RootState) =>
    state.subscription.paymentPlans.slice(0, 2)
  )
}

export function getPaymentCards() {
  return useSelector((state: RootState) => state.subscription.paymentCards)
}

export function getDefaultPaymentCard() {
  return useSelector((state: RootState) =>
    state.subscription.paymentCards.find((card) => card.isDefault)
  )
}

export function getNotDefaultPaymentCards() {
  return useSelector((state: RootState) =>
    state.subscription.paymentCards.filter((card) => !card.isDefault)
  )
}

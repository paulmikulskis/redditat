import IPaymentPlan from '../models/IPaymentPlan'
import {
  oneTimePlansKey,
  subscriptionPlansKey,
} from '../models/TPaymentPlanKey'

export const PAYMENT_PLANS: IPaymentPlan[] = [
  {
    key: 'freeTrial',
    title: 'Free Trial',
    features: [
      '3 day free',
      'Purge the 4 latest videos from your channel',
      'Runs in the background',
    ],
    amount: 0,
    buttonText: 'Try premium for free',
    cancelText: 'Cancel',
  },
  {
    key: 'premium',
    title: 'Premium - $10 / Month',
    features: [
      'Purge the 4 latest videos from your channel',
      'Runs in the background',
      'Cancel anytime',
    ],
    amount: 10,
    buttonText: 'Subscribe',
    cancelText: 'Cancel',
  },
  {
    key: 'perchannel',
    title: '$100 / Channel',
    features: ['Purge all videos in your channel', 'One time fee'],
    discountTitle: '$69.99 / Channel',
    amount: 100,
    discountAmount: 69.99,
  },
  {
    key: 'pervideo',
    title: '$1 / Video',
    features: ['Enter the URL of the video you want purged', 'One time fee'],
    discountTitle: '$0.5 / Video',
    amount: 1,
    discountAmount: 0.5,
  },
]

export const SUBSCRIPTION_PLANS = PAYMENT_PLANS.filter((plan) => {
  return subscriptionPlansKey.includes(plan.key)
})

export const ONE_TIME_PLANS = PAYMENT_PLANS.filter((plan) => {
  return oneTimePlansKey.includes(plan.key)
})

export const PER_CHANNEL = PAYMENT_PLANS.find(
  (plan) => plan.key == 'perchannel'
)
export const PER_VIDEO = PAYMENT_PLANS.find((plan) => plan.key == 'pervideo')

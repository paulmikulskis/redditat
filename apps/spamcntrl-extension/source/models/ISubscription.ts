import TSubscriptionType from './TSubscriptionType'

interface ISubscription {
  days: number
  start: Date
  type: TSubscriptionType
  trialExpired: Boolean
}

export default ISubscription

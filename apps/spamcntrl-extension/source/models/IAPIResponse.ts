import TSubscriptionType from './TSubscriptionType'

interface IAPIResponse {
  status: number
  message: string
  error: string
  data: {
    type: TSubscriptionType
    days: number
    start: Date
  }
}

export default IAPIResponse

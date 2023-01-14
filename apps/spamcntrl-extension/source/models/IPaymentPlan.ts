import TPaymentPlanKey from './TPaymentPlanKey'

interface IPaymentPlan {
  key: TPaymentPlanKey
  title: string
  features: string[]
  discountTitle?: string
  amount: number
  discountAmount?: number
  buttonText?: string
  cancelText?: string
}

export default IPaymentPlan

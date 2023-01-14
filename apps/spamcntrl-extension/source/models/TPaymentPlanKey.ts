type TPaymentPlanKey =
  | 'freeTrial'
  | 'basic'
  | 'premium'
  | 'perchannel'
  | 'pervideo'
  | null
  | undefined

export const oneTimePlansKey: TPaymentPlanKey[] = ['perchannel', 'pervideo']

export const subscriptionPlansKey: TPaymentPlanKey[] = ['freeTrial', 'premium']

export default TPaymentPlanKey

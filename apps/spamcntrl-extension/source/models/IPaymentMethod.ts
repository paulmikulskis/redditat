interface IPaymentMethod {
  billing_details: {
    address: any
    name: string
  }
  card: {
    brand: string
    checks: any
    country: string
    exp_month: number
    exp_year: number
    last4: string
  }
  created: Date
  customer: string
  id: string
  livemode: Boolean
  object: string
  type: string
}

export default IPaymentMethod

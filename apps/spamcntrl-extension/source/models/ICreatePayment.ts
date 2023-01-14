interface ICreatePayment {
  payment_method: string | null
  currency: string //usd
  amount: number
  status: string
}

export default ICreatePayment

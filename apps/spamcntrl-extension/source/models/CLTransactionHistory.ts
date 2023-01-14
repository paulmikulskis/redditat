export class CLTransactionHistory {
  type: string
  date: Date
  amount: number

  constructor(type: string, date: Date, amount: number) {
    this.type = type
    this.date = date
    this.amount = amount
  }
}

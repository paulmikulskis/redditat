import { createSlice } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { CLTransactionHistory } from '../../models/CLTransactionHistory'

interface TransactionHistorySlice {
  transactionHistoryList: CLTransactionHistory[]
}

const defaultState: TransactionHistorySlice = {
  transactionHistoryList: [
    {
      type: 'Pro Plan',
      date: subDays(new Date(), 30),
      amount: 9.99,
    },
    {
      type: 'Channel Purge',
      date: subDays(new Date(), 35),
      amount: 99.99,
    },
    {
      type: 'Single Purge',
      date: subDays(new Date(), 40),
      amount: 1.99,
    },
    {
      type: 'Pro Plan',
      date: subDays(new Date(), 60),
      amount: 9.99,
    },
  ],
}

const modalSlice = createSlice({
  name: 'transactionHistory',
  initialState: defaultState,
  reducers: {},
})

export const {} = modalSlice.actions
export default modalSlice.reducer

export function getTransactionHistoryList() {
  return useSelector(
    (state: RootState) => state.transactionHistory.transactionHistoryList
  )
}

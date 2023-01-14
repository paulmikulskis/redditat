import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { CLPurgingHistory } from '../../components/CLPurgingHistory'
import ILog from '../../models/ILog'
import TPurgeHistoryGroupByKeys from '../../models/TPurgeHistoryGroupByKeys'
import TPurgeHistorySortByKeys from '../../models/TPurgeHistorySortByKeys'

interface PurgeHistorySlice {
  loading: boolean
  data: ILog[] | undefined | null
  groupBy: TPurgeHistoryGroupByKeys
  sortBy: TPurgeHistorySortByKeys
  spam: boolean
  notspam: boolean

  //history search
  purgingHistorySearchText: string
  purgingHistorySearchResults: ILog[]
  purgingHistoryList: CLPurgingHistory[]
}

const defaultState: PurgeHistorySlice = {
  loading: true,
  data: undefined,
  groupBy: 'date',
  sortBy: 'desc',
  spam: true,
  notspam: true,

  purgingHistorySearchText: '',
  purgingHistorySearchResults: [],
  purgingHistoryList: [
    {
      thumbnail:
        'https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg',
      title: 'The Crypto Markets Just Flipped',
      date: subDays(new Date(), 5),
      spamComments: [
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 25),
        },
        {
          author: 'Keith M.',
          comment: 'Come and join the 1 on 1 seminar.',
          date: subDays(new Date(), 35),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 45),
        },
      ],
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw',
      title: "Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF",
      date: subDays(new Date(), 10),
      spamComments: [
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 105),
        },
      ],
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      title: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      date: subDays(new Date(), 15),
      spamComments: [
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 25),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 105),
        },
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
        {
          author: 'REZZZZX Investment',
          comment: 'We teach you how to invest your money.',
          date: subDays(new Date(), 305),
        },
        {
          author: 'ABC Foundation',
          comment: 'Donate to charity',
          date: subDays(new Date(), 305),
        },
      ],
    },
  ],
}

const modalSlice = createSlice({
  name: 'purgeHistory',
  initialState: defaultState,
  reducers: {
    setGroupBy(state, action: PayloadAction<TPurgeHistoryGroupByKeys>) {
      state.groupBy = action.payload
    },
    setSortBy(state, action: PayloadAction<TPurgeHistorySortByKeys>) {
      state.sortBy = action.payload
    },
    setSpam(state, action: PayloadAction<boolean>) {
      state.spam = action.payload
    },
    setNotSpam(state, action: PayloadAction<boolean>) {
      state.notspam = action.payload
    },
    setPurgeHistories(state, action: PayloadAction<ILog[] | undefined | null>) {
      state.data = action.payload
    },
    setPurgeHistoryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setPurgingHistorySearchText(state, action: PayloadAction<string>) {
      state.purgingHistorySearchText = action.payload
    },
  },
})

export const {
  setGroupBy,
  setSortBy,
  setSpam,
  setNotSpam,
  setPurgeHistories,
  setPurgeHistoryLoading,
  setPurgingHistorySearchText,
} = modalSlice.actions
export default modalSlice.reducer

export function getPurgeHistories() {
  return useSelector((state: RootState) => state.purgeHistory.data)
}

export function getPurgeHistoryFilterBySpam() {
  return useSelector((state: RootState) => state.purgeHistory.spam)
}

export function getPurgeHistoryFilterByNotSpam() {
  return useSelector((state: RootState) => state.purgeHistory.notspam)
}

export function getPurgeHistoryGroupBy() {
  return useSelector((state: RootState) => state.purgeHistory.groupBy)
}

export function getPurgeHistorySortBy() {
  return useSelector((state: RootState) => state.purgeHistory.sortBy)
}

export function getPurgeHistoryLoading() {
  return useSelector((state: RootState) => state.purgeHistory.loading)
}

export function getPurgingHistorySearchText() {
  return useSelector(
    (state: RootState) => state.purgeHistory.purgingHistorySearchText
  )
}

export function getPurgingHistoryList() {
  return useSelector(
    (state: RootState) => state.purgeHistory.purgingHistoryList
  )
}

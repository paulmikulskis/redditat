import { createSlice } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { IVideo } from '../../models'

interface SinglePurgeSlice {
  singlePurgeList: IVideo[]
}

const defaultState: SinglePurgeSlice = {
  singlePurgeList: [
    {
      thumbnail:
        'https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'The Crypto Markets Just Flipped',
      commentCount: 2,
      completed: false,
      date: subDays(new Date(), 2),
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw',
      name: 'Sample',
      videoID: '01',
      videoTitle:
        "Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF",
      commentCount: 5,
      completed: false,
      date: subDays(new Date(), 5),
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      name: 'Sample',
      videoID: '01',
      videoTitle: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      commentCount: 12,
      completed: false,
      date: subDays(new Date(), 15),
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/LcpqfFUBpSY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAjKxo6YO_t1-xsNBJdCbMn2C0epg',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'Dead Ahead Zombie Warfare | Farm coins in Location 6',
      commentCount: 12,
      completed: false,
      date: subDays(new Date(), 125),
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/lcYPL3s2Mmw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCOl7q1DpN08EhYm0x7E8Yqh3p3KQ',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'Neil deGrasse Tyson Explains Nothing',
      commentCount: 12,
      completed: false,
      date: subDays(new Date(), 215),
    },
  ],
}

const modalSlice = createSlice({
  name: 'singlePurge',
  initialState: defaultState,
  reducers: {},
})

export const {} = modalSlice.actions
export default modalSlice.reducer

export function getSinglePurgeList() {
  return useSelector((state: RootState) => state.singlePurge.singlePurgeList)
}

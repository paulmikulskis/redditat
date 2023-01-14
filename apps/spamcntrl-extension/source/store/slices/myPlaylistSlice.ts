import { createSlice } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { CLPlaylist } from '../../components/CLPlaylist'

interface MyPlaylistSlice {
  myPlaylistSearchResults: CLPlaylist[]
}

const defaultState: MyPlaylistSlice = {
  myPlaylistSearchResults: [
    {
      title: 'The Crypto Markets Just Flipped',
      thumbnail:
        'https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg',
      count: 5,
      schedulePurge: {
        date: subDays(new Date(), 4),
        recurringSchedule: 'daily',
      },
    },
    {
      title: "Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF",
      thumbnail:
        'https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw',
      count: 7,
      schedulePurge: {
        date: subDays(new Date(), 10),
        recurringSchedule: 'weekly',
      },
    },
    {
      title: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      count: 9,
      schedulePurge: {
        date: subDays(new Date(), 100),
        recurringSchedule: 'monthly',
      },
    },
    {
      title: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      count: 9,
      schedulePurge: {
        date: subDays(new Date(), 121),
        recurringSchedule: 'monthly',
      },
    },
    {
      title: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      count: 19,
      schedulePurge: {
        date: subDays(new Date(), 111),
        recurringSchedule: 'monthly',
      },
    },
  ],
}

const modalSlice = createSlice({
  name: 'myPlaylist',
  initialState: defaultState,
  reducers: {},
})

export const {} = modalSlice.actions
export default modalSlice.reducer

export function getMyPlaylistSearchResults() {
  return useSelector(
    (state: RootState) => state.myPlaylist.myPlaylistSearchResults
  )
}

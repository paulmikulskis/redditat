import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { subDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { IButtonTab, TButtonTabKey } from '../../components/CButtonTabs'
import { IDropdownMenuOption } from '../../components/CDropdownButton'
import { CLPlaylist } from '../../components/CLPlaylist'
import { IVideo } from '../../models'

export type TSchedulePurgeDropdownType = 'videos' | 'playlist'

interface SchedulePurgeSlice {
  buttonTabs: IButtonTab[]
  activeButtonTabKey: TButtonTabKey
  schedulePurgeSearchText: string
  schedulePurgeSearchResults: IVideo[]
  schedulePurgeDropdownType: TSchedulePurgeDropdownType
  schedulePurgeDropdownMenuOptions: IDropdownMenuOption[]

  schedulePurgePlaylistSearchResults: CLPlaylist[]
}

const defaultState: SchedulePurgeSlice = {
  schedulePurgePlaylistSearchResults: [
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
  schedulePurgeDropdownMenuOptions: [
    {
      key: 'videos',
      title: 'Videos',
    },
    {
      key: 'playlist',
      title: 'Playlist',
    },
  ],
  schedulePurgeDropdownType: 'videos',
  buttonTabs: [
    { key: 'sp-schedule-videos', label: 'Schedule Videos' },
    { key: 'sp-scheduled-videos', label: 'Scheduled Videos' },
  ],
  activeButtonTabKey: 'sp-schedule-videos',
  schedulePurgeSearchText: '',
  schedulePurgeSearchResults: [
    {
      thumbnail:
        'https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'The Crypto Markets Just Flipped',
      commentCount: 2,
      completed: false,
      schedulePurge: {
        date: subDays(new Date(), 4),
        recurringSchedule: 'daily',
      },
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
      schedulePurge: {
        date: subDays(new Date(), 10),
        recurringSchedule: 'weekly',
      },
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      name: 'Sample',
      videoID: '01',
      videoTitle: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      commentCount: 12,
      completed: false,
      schedulePurge: {
        date: subDays(new Date(), 11),
        recurringSchedule: 'weekly',
      },
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/LcpqfFUBpSY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAjKxo6YO_t1-xsNBJdCbMn2C0epg',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'Dead Ahead Zombie Warfare | Farm coins in Location 6',
      commentCount: 12,
      completed: false,
      schedulePurge: {
        date: subDays(new Date(), 15),
        recurringSchedule: 'weekly',
      },
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/lcYPL3s2Mmw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCOl7q1DpN08EhYm0x7E8Yqh3p3KQ',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'Neil deGrasse Tyson Explains Nothing',
      commentCount: 12,
      completed: false,
      schedulePurge: {
        date: subDays(new Date(), 20),
        recurringSchedule: 'daily',
      },
    },
  ],
}

const modalSlice = createSlice({
  name: 'schedulePurge',
  initialState: defaultState,
  reducers: {
    setSchedulePurgeText(state, action: PayloadAction<string>) {
      state.schedulePurgeSearchText = action.payload
    },
    setSchedulePurgeActiveButtonTabKey(
      state,
      action: PayloadAction<TButtonTabKey>
    ) {
      state.activeButtonTabKey = action.payload
    },
    setSchedulePurgeDropdownType(
      state,
      action: PayloadAction<TSchedulePurgeDropdownType>
    ) {
      state.schedulePurgeDropdownType = action.payload
    },
  },
})

export const {
  setSchedulePurgeText,
  setSchedulePurgeActiveButtonTabKey,
  setSchedulePurgeDropdownType,
} = modalSlice.actions
export default modalSlice.reducer

export function getSchedulePurgeSearchText() {
  return useSelector(
    (state: RootState) => state.schedulePurge.schedulePurgeSearchText
  )
}

export function getSchedulePurgeSearchResults() {
  return useSelector(
    (state: RootState) => state.schedulePurge.schedulePurgeSearchResults
  )
}

export function getSchedulePurgeActiveButtonTabKey() {
  return useSelector(
    (state: RootState) => state.schedulePurge.activeButtonTabKey
  )
}

export function getSchedulePurgeButtonTabs() {
  return useSelector((state: RootState) => state.schedulePurge.buttonTabs)
}

export function getSchedulePurgeDropdownType() {
  return useSelector(
    (state: RootState) => state.schedulePurge.schedulePurgeDropdownType
  )
}

export function getSchedulePurgeDropdownMenuOptions() {
  return useSelector(
    (state: RootState) => state.schedulePurge.schedulePurgeDropdownMenuOptions
  )
}

export function getSchedulePurgePlaylistSearchResults() {
  return useSelector(
    (state: RootState) => state.schedulePurge.schedulePurgePlaylistSearchResults
  )
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { IVideo } from '../../models'

interface MyVideosSlice {
  myVideosSearchText: string
  myVideosSearchResults: IVideo[]
}

const defaultState: MyVideosSlice = {
  myVideosSearchText: '',
  myVideosSearchResults: [
    {
      thumbnail:
        'https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'The Crypto Markets Just Flipped',
      commentCount: 2,
      completed: false,
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
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw',
      name: 'Sample',
      videoID: '01',
      videoTitle: "Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️",
      commentCount: 12,
      completed: false,
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/LcpqfFUBpSY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAjKxo6YO_t1-xsNBJdCbMn2C0epg',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'Dead Ahead Zombie Warfare | Farm coins in Location 6',
      commentCount: 12,
      completed: false,
    },
    {
      thumbnail:
        'https://i.ytimg.com/vi/lcYPL3s2Mmw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCOl7q1DpN08EhYm0x7E8Yqh3p3KQ',
      name: 'Sample',
      videoID: '01',
      videoTitle: 'Neil deGrasse Tyson Explains Nothing',
      commentCount: 12,
      completed: false,
    },
  ],
}

const modalSlice = createSlice({
  name: 'myVideos',
  initialState: defaultState,
  reducers: {
    setMyVideosSearchText(state, action: PayloadAction<string>) {
      state.myVideosSearchText = action.payload
    },
  },
})

export const { setMyVideosSearchText } = modalSlice.actions
export default modalSlice.reducer

export function getMyVideosSearchText() {
  return useSelector((state: RootState) => state.myVideos.myVideosSearchText)
}

export function getMyVideosSearchResults() {
  return useSelector((state: RootState) => state.myVideos.myVideosSearchResults)
}

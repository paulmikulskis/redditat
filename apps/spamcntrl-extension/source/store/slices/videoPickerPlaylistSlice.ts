import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IVideo } from '../../models'

interface VideoPickerPlaylistSlice {
  playlist: IVideo[]
  tempPlaylist: IVideo[]
  running: boolean
}

const defaultState: VideoPickerPlaylistSlice = {
  playlist: [],
  tempPlaylist: [],
  running: false,
}

const modalSlice = createSlice({
  name: 'videoPickerPlaylist',
  initialState: defaultState,
  reducers: {
    stopScheduledPlaylist(state) {
      state.running = false
    },
    runScheduledPlaylist(state) {
      state.running = true
    },
    addToTempPlaylist(state, action: PayloadAction<IVideo>) {
      state.tempPlaylist.push(action.payload)
    },
    removeFromTempPlaylist(state, action: PayloadAction<IVideo>) {
      state.tempPlaylist = state.tempPlaylist.filter((video) => {
        return video.videoID != action.payload.videoID
      })
    },
    savePlaylistFromTemp(state) {
      state.playlist = JSON.parse(JSON.stringify(state.tempPlaylist))
    },
    copyPlaylistToTemp(state) {
      state.tempPlaylist = JSON.parse(JSON.stringify(state.playlist))
    },
  },
})

export const {
  stopScheduledPlaylist,
  runScheduledPlaylist,
  addToTempPlaylist,
  removeFromTempPlaylist,
  savePlaylistFromTemp,
  copyPlaylistToTemp,
} = modalSlice.actions
export default modalSlice.reducer

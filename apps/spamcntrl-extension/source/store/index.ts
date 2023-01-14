import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import videoPickerPlaylistReducer from './slices/videoPickerPlaylistSlice'
import purgeHistoryReducer from './slices/purgeHistorySlice'
import purgingReducer from './slices/purgingSlice'
import myVideosReducer from './slices/myVideosSlice'
import schedulePurgeReducer from './slices/schedulePurgeSlice'
import ongoingPurgeReducer from './slices/ongoingPurgeSlice'
import myPlaylistReducer from './slices/myPlaylistSlice'
import createPlaylistReducer from './slices/createPlaylistSlice'
import subscriptionReducer from './slices/subscriptionSlice'
import singlePurgeReducer from './slices/singlePurgeSlice'
import transactionHistoryReducer from './slices/transactionHistorySlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    videoPickerPlaylist: videoPickerPlaylistReducer,
    purgeHistory: purgeHistoryReducer,
    purging: purgingReducer,
    myVideos: myVideosReducer,
    schedulePurge: schedulePurgeReducer,
    ongoingPurge: ongoingPurgeReducer,
    myPlaylist: myPlaylistReducer,
    createPlaylist: createPlaylistReducer,
    subscription: subscriptionReducer,
    singlePurge: singlePurgeReducer,
    transactionHistory: transactionHistoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

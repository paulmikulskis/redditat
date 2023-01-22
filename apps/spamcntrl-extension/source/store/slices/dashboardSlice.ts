import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { IVideo } from "../../models";

interface DashboardSlice {
  latestVideos: IVideo[] | undefined;
}

const defaultState: DashboardSlice = {
  latestVideos: undefined,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: defaultState,
  reducers: {
    setLatestVideos(state, action: PayloadAction<IVideo[] | undefined>) {
      state.latestVideos = action.payload;
    },
  },
});

export const { setLatestVideos } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export function getLatestVideos() {
  return useSelector((state: RootState) => state.dashboard.latestVideos);
}

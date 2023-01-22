import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { IVideo } from "../../models";

interface MyVideosSlice {
  myVideosSearchText: string;
  myVideosSearchResults: IVideo[] | undefined;
}

const defaultState: MyVideosSlice = {
  myVideosSearchText: "",
  myVideosSearchResults: undefined,
};

const modalSlice = createSlice({
  name: "myVideos",
  initialState: defaultState,
  reducers: {
    setMyVideosSearchText(state, action: PayloadAction<string>) {
      state.myVideosSearchText = action.payload;
    },
    setMyVideosSearchResults(state, action: PayloadAction<IVideo[] | undefined>) {
      state.myVideosSearchResults = action.payload;
    },
  },
});

export const { setMyVideosSearchText, setMyVideosSearchResults } = modalSlice.actions;
export default modalSlice.reducer;

export function getMyVideosSearchText() {
  return useSelector((state: RootState) => state.myVideos.myVideosSearchText);
}

export function getMyVideosSearchResults() {
  return useSelector((state: RootState) => state.myVideos.myVideosSearchResults);
}

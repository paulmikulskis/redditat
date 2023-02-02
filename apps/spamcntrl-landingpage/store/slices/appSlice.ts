import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { INotifData } from "../../components/CAlert";

interface AppSlice {
  notifData: INotifData;
}

const defaultState: AppSlice = {
  notifData: {
    type: "info",
    message: "",
  },
};

const modalSlice = createSlice({
  name: "app",
  initialState: defaultState,
  reducers: {
    setNotifData(state, action: PayloadAction<INotifData>) {
      state.notifData = {
        ...action.payload,
        alertKey: new Date().getTime(),
      };
    },
  },
});

export const { setNotifData } = modalSlice.actions;
export default modalSlice.reducer;

export function getNotifData() {
  return useSelector((state: RootState) => state.app.notifData);
}

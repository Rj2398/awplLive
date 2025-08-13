import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelDetails: null,
};

export const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setVideoData: (state, action) => {
      state.channelDetails = action.payload;
    },
  },
});

export const { setVideoData } = infoSlice.actions;

export default infoSlice.reducer;

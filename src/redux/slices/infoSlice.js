import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelDetails: null,
  invitedUser: null,
};

export const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setVideoData: (state, action) => {
      state.channelDetails = action.payload;
    },

    setInvitedUserData: (state, action) => {
      state.invitedUser = action.payload;
    },
  },
});

export const { setVideoData, setInvitedUserData } = infoSlice.actions;

export default infoSlice.reducer;

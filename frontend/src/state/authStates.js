import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
  },
});

export const {
  setUserId,
  clearUserId,
 
} = authSlice.actions;

export default authSlice.reducer;

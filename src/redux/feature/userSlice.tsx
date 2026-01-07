import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userGetData: any;
  isSuccess: boolean;
  isError: boolean;
}

const initialState: UserState = {
  userGetData: null,
  isSuccess: false,
  isError: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getSuccess(state, action: PayloadAction<{ userGetData: any }>) {
      state.userGetData = action.payload.userGetData;
      state.isSuccess = true;
      state.isError = false;
    },
    updateUserData(state, action: PayloadAction<any>) {
      state.userGetData = {
        ...state.userGetData,
        ...action.payload,
      };
    },
  },
});

export const { getSuccess, updateUserData } = userSlice.actions;
export default userSlice.reducer;

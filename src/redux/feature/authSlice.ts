import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isLogin: boolean;
  userData: any;
  token: string | null;
  userGetData: any;
  logout:any;
}
interface GetSuccessPayload {
  userGetData: any;
}
const initialState: AuthState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isLogin: false,
  userData: null,
  token: null,
  userGetData: null,
  logout:null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isLogin = true;
      
    },
    logout(state) {
      state.isLogin = false;
      state.isSuccess = false;
      state.userData = null;
      state.token = null;
      // state.userGetData = null;
    },
    setUserProfile(state, action: PayloadAction<GetSuccessPayload>) {
      state.isSuccess = true;
      state.isError = false;
      state.userGetData = action.payload.userGetData;
    },
  

     //  NEW REDUCER
    updateUserProfileField(state, action: PayloadAction<{ key: string; value: any }>) {
      if (state.userGetData) {
        state.userGetData = {
          ...state.userGetData,
          [action.payload.key]: action.payload.value,
        };
      }
    },

    clearUserProfile: (state) => {
      state.userGetData = null;
    },
  }
  });
export const { loginSuccess, logout, setUserProfile , clearUserProfile ,updateUserProfileField, } = AuthSlice.actions;
export default AuthSlice.reducer;
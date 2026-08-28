import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userUid: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  userUid: null,
  email: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserUid(state, action: PayloadAction<string | null>) {
      state.userUid = action.payload;
    },
    setEmail(state, action: PayloadAction<string | null>) {
      state.email = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUserUid, setEmail, setIsLoggedIn } = authSlice.actions;

export const selectUserUid = (state: AuthState) => state.userUid;
export const selectEmail = (state: AuthState) => state.email;
export const selectIsLoggedIn = (state: AuthState) => state.isLoggedIn;

export default authSlice.reducer;

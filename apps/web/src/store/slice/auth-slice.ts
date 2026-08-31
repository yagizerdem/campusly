import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userUid: string | null;
  email: string | null;
  isLoggedIn: boolean;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  userUid: null,
  email: null,
  isLoggedIn: false,
  firstName: null,
  lastName: null,
  fullName: null,
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
    setFirstName(state, action: PayloadAction<string | null>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string | null>) {
      state.lastName = action.payload;
    },
    setFullName(state, action: PayloadAction<string | null>) {
      state.fullName = action.payload;
    },
  },
});

export const {
  setUserUid,
  setEmail,
  setIsLoggedIn,
  setFirstName,
  setLastName,
  setFullName,
} = authSlice.actions;

export const selectUserUid = (state: { auth: AuthState }) => state.auth.userUid;
export const selectEmail = (state: { auth: AuthState }) => state.auth.email;
export const selectIsLoggedIn = (state: { auth: AuthState }) =>
  state.auth.isLoggedIn;
export const selectFirstName = (state: { auth: AuthState }) =>
  state.auth.firstName;
export const selectLastName = (state: { auth: AuthState }) =>
  state.auth.lastName;
export const selectFullName = (state: { auth: AuthState }) =>
  state.auth.fullName ??
  `${state.auth.firstName ?? ""} ${state.auth.lastName ?? ""}`.trim();

export default authSlice.reducer;

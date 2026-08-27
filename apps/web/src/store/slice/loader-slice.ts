import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoaderState {
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: LoaderState = {
  isLoading: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = loaderSlice.actions;

export const selectIsLoading = (state: LoaderState) => state.isLoading;

export default loaderSlice.reducer;

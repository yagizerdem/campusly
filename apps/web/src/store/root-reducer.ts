import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./slice/loader-slice";

const rootReducer = combineReducers({
  loader: loaderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

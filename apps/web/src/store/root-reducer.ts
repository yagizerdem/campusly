import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./slice/loader-slice";
import authReducer from "./slice/auth-slice";

const rootReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

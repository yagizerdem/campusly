import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./slice/loader-slice";
import authReducer from "./slice/auth-slice";
import feedReducer from "./slice/feed-slice";

const rootReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
  feed: feedReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

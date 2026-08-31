import type { FetchPostFeedResponse } from "@campusly/shared/src/dto/post-dto";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FeedState {
  offset: number;
  posts: FetchPostFeedResponse[];
}

// Define the initial state using that type
const initialState: FeedState = {
  offset: 0,
  posts: [],
};

export const feedSlice = createSlice({
  name: "feed",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },
    setPosts(state, action: PayloadAction<FetchPostFeedResponse[]>) {
      state.posts = action.payload;
    },
  },
});

export const { setOffset, setPosts } = feedSlice.actions;

export const selectOffset = (state: { feed: FeedState }) => state.feed.offset;
export const selectPosts = (state: { feed: FeedState }) => state.feed.posts;

export default feedSlice.reducer;

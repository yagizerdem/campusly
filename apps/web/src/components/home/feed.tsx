import axiosWrapper from "@/src/lib/axios-wrapper";
import { useQuery } from "@tanstack/react-query";
import type { FetchPostFeedResponse } from "@campusly/shared/src/dto/post-dto";
import type IApiResponse from "@campusly/shared/src/util/api-response";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOffset,
  selectPosts,
  setPosts,
} from "@/src/store/slice/feed-slice";
import { useEffect } from "react";
import { AppLoader } from "@components/shared/app/app-loader";
import FeedPost from "./feed-post";

const limit = 10;

export default function Feed() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "feed"],
    queryFn: fetchPosts,
  });

  const offset = useSelector(selectOffset);
  const posts = useSelector(selectPosts);
  const dispatch = useDispatch();

  async function fetchPosts() {
    //@ts-ignore
    const apiResponse: IApiResponse<FetchPostFeedResponse> = (
      await axiosWrapper.get<IApiResponse<FetchPostFeedResponse>>(
        "/api/post/get-posts",
        {
          params: {
            limit,
            skip: offset,
          },
        },
      )
    ).data;

    return apiResponse;
  }

  useEffect(() => {
    if (data?.success && data.data) {
      dispatch(setPosts([...posts, ...data.data]));
    }
  }, [data]);

  console.log(posts);

  return (
    <div className="w-full h-full overflow-y-auto pb-10">
      {posts.map((post) => (
        <div key={post.postId} className="w-full h-fit px-40 py-5">
          <FeedPost post={post} />
        </div>
      ))}

      {isLoading && (
        <div className="w-full flex items-center justify-center align-middle">
          <AppLoader visible={isLoading} />
        </div>
      )}
    </div>
  );
}

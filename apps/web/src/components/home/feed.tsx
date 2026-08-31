import axiosWrapper from "@/src/lib/axios-wrapper";
import { useQuery } from "@tanstack/react-query";
import type { FetchPostFeedResponse } from "@campusly/shared/src/dto/post-dto";
import type IApiResponse from "@campusly/shared/src/util/api-response";
import { useSelector } from "react-redux";
import { selectOffset, selectPosts } from "@/src/store/slice/feed-slice";

const limit = 10;

export default function Feed() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "feed"],
    queryFn: fetchPosts,
  });

  const offset = useSelector(selectOffset);
  const posts = useSelector(selectPosts);

  async function fetchPosts() {
    //@ts-ignore
    const apiResponse: IApiResponse<unknown> = (
      await axiosWrapper.get<IApiResponse<FetchPostFeedResponse>>(
        "/api/post/get-posts",
        {
          params: {
            limit,
            offset,
          },
        },
      )
    ).data;

    return apiResponse;
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="h-[5000px] w-full bg-red-400">
        <div>jaljf</div>
      </div>
    </div>
  );
}

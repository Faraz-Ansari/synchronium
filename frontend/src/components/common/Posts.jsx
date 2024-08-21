import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// FeedType is a prop that will be passed to Posts component to determine which posts to show
// FeedType can either be "for you" or "following"
export default function Posts({ feedType }) {
    const getPostsEndpoint = () => {
        if (feedType === "forYou") {
            return "/api/post/posts";
        } else {
            return "/api/post/following-feed";
        }
    };

    const POST_ENDPOINT = getPostsEndpoint();

    const {
        data: posts,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const response = await fetch(POST_ENDPOINT);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    useEffect(() => {
        refetch();
    }, [feedType, refetch]);

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className="flex flex-col justify-center">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && (
                <p className="text-center my-4">
                    No posts in this tab. Switch 👻
                </p>
            )}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
}

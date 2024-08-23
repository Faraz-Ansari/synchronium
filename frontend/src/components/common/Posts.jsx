import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// FeedType is a prop that will be passed to Posts component to determine which posts to show
// FeedType can either be "for you" or "following"
export default function Posts({ feedType, username, userId }) {
    const getPostEndpoint = () => {
        switch (feedType) {
            case "forYou":
                return "/api/post/posts";
            case "following":
                return "/api/post/following-feed";
            case "posts":
                return `/api/post/user-posts/${username}`;
            case "likes":
                return `/api/post/liked-posts/${userId}`;
            default:
                return "/api/post/posts";
        }
    };

    const POST_ENDPOINT = getPostEndpoint();

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
                console.error(error.message);
                throw new Error(error);
            }
        },
    });

    useEffect(() => {
        refetch();
    }, [feedType, username, userId, refetch]);

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

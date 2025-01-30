import { useState, useCallback, useEffect } from "react";
import { getPosts } from "../services/postApi";
import { Post } from "../types/Post";

const usePosts = (
    userId?: string,
    sortBy?: string,
    sortOrder?: string,
    category: string = "All"
) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // if reset = false we are appending new posts to the existing list of posts if true we are resetting the posts list
    const fetchPostsWithComments = useCallback(
        async (pageToFetch: number, reset = false) => {
            setLoading(true);
            try {
                const data = await getPosts(pageToFetch, sortBy, sortOrder, category);
                const newPosts = data.data;

                // If we reached the last page, set hasMore to false
                if (data.pagination.currentPage >= data.pagination.totalPages) {
                    setHasMore(false);
                }

                const filteredPosts = userId
                    ? newPosts.filter((post: Post) => post.owner._id === userId)
                    : newPosts;

                setPosts((prevPosts) => (reset ? filteredPosts : [...prevPosts, ...filteredPosts]));
            } catch (error) {
                console.error("Failed to fetch posts with comments:", error);
                alert("Failed to fetch posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        },
        [userId, sortBy, sortOrder, category]
    );

    // Function to load more posts only for pagging !!
    const loadMore = async () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            await fetchPostsWithComments(nextPage, false);
        }
    };

    // fetch posts when filters or sorting change (reset the posts list)
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
        fetchPostsWithComments(1, true);
    }, [fetchPostsWithComments]);

    return { posts, loading, setPosts, loadMore, hasMore };
};

export default usePosts;

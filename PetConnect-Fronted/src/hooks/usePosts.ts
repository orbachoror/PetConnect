import { useState, useCallback, useEffect } from "react";
import { getPosts } from "../services/postApi";
import { getCommentsCount } from "../services/commentApi";
import { Post } from "../types/Post";

const usePosts = (userId?: string) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPostsWithComments = useCallback(async () => {
        try {
            const posts = await getPosts();
            const filteredPosts = userId ? posts.filter((post: Post) => post.owner._id === userId) : posts;

            const updatedPosts = await Promise.all(
                filteredPosts.map(async (post: Post) => {
                    const commentsCount = await getCommentsCount(post._id);
                    return { ...post, commentsCount };
                })
            );

            setPosts(updatedPosts);
        } catch (error) {
            console.error("Failed to fetch posts with comments:", error);
            alert("Failed to fetch posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPostsWithComments();
    }, [fetchPostsWithComments]);

    return { posts, loading, setPosts };
};

export default usePosts;

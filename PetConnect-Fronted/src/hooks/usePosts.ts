import { useState, useEffect } from "react";
import { getPosts } from "../services/postApi";
import { getCommentsCount } from "../services/commentApi";

export interface Post {
    _id: string;
    title: string;
    description: string;
    postPicture: string;
    likes: number;
    likedBy: string[];
    commentsCount: number;
    owner: {
        email: string;
    };
}

const usePostsWithComments = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPostsWithComments = async () => {
        try {
            const posts = await getPosts();

            const updatedPosts = await Promise.all(
                posts.map(async (post: Post) => {
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
    };

    useEffect(() => {
        fetchPostsWithComments();
    }, []);

    return { posts, loading, refreshPosts: fetchPostsWithComments };
};

export default usePostsWithComments;

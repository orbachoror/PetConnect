import React from "react";
import { Container } from "@mui/material";
import PostsGrid from "../components/PostsGrid";
import usePosts from "../hooks/usePosts";
import { toggleLike } from "../services/postApi";
import Loader from "../components/Loader";

const PostsPage: React.FC = () => {
  const { posts, loading, setPosts } = usePosts();
  const userId = localStorage.getItem("userId") || "";
  const handleToggleLike = async (postId: string) => {
    if (!userId) {
      alert("You need to be logged in to like a post.");
      return;
    }
    try {
      const { likes, isLiked } = await toggleLike(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes,
                likedBy: isLiked
                  ? [...post.likedBy, userId]
                  : post.likedBy.filter((u) => u !== userId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("Failed to toggle like. Please try again later.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <PostsGrid
        posts={posts}
        userId={userId}
        onToggleLike={handleToggleLike}
      />
    </Container>
  );
};

export default PostsPage;

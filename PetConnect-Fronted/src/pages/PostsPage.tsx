import React from "react";
import { Container, CircularProgress } from "@mui/material";
import PostsGrid from "../components/PostsGrid";
import usePostsWithComments from "../hooks/usePosts";
import { toggleLike } from "../services/postApi";

const PostsPage: React.FC = () => {
  const { posts, loading, refreshPosts } = usePostsWithComments();
  const userId = localStorage.getItem("userId") || "";
  const handleToggleLike = async (postId: string) => {
    try {
      await toggleLike(postId);
      refreshPosts(); // Refresh posts after toggling like
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("Failed to toggle like. Please try again later.");
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <PostsGrid
        posts={posts}
        onToggleLike={handleToggleLike}
        userId={userId}
      />
    </Container>
  );
};

export default PostsPage;

import React from "react";
import { Button, Container,Box } from "@mui/material";
import PostsGrid from "../components/PostsGrid";
import usePosts from "../hooks/usePosts";
import { toggleLike } from "../services/postApi";
import Loader from "../components/Loader";

const PostsPage: React.FC = () => {
  const { posts, loading, setPosts ,loadMore , hasMore } = usePosts();
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

  if ((loading && posts.length === 0)) {
    return <Loader />;
  }

  return (

    <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      backgroundImage: "url('andrew-s-ouo1hbizWwo-unsplash.jpg')", 
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "40px 0",
      position: "relative",
    }}
  >
    <Container sx={{ textAlign: "center" }}>
      <PostsGrid
        posts={posts}
        userId={userId}
        onToggleLike={handleToggleLike}
      />


      {loading && posts.length > 0 && <Loader />}
      
      {hasMore && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={loadMore} 
        >
        {loading ? "Loading..." : "Load More Posts"}
        </Button>
      )}

      {!hasMore && <p>No more posts to load.</p>} 
    </Container>
  </Box>
  );
};

export default PostsPage;

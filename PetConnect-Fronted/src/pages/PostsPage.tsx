import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PostsGrid from "../components/PostsGrid";
import usePosts from "../hooks/usePosts";
import { toggleLike } from "../services/postApi";
import Loader from "../components/Loader";

const PostsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("likes");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [category, setCategory] = useState<string>("All");

  const { posts, loading, setPosts, loadMore, hasMore } = usePosts(
    undefined, // userId (not filtering by specific user)
    sortBy,
    sortOrder,
    category
  );
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

  if (loading && posts.length === 0) {
    return <Loader />;
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
        {/* Sort By */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="likes">Most Liked</MenuItem>
              <MenuItem value="comments">Most Commented</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Sort Order */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Category */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Product Recommendations">
                Product Recommendations
              </MenuItem>
              <MenuItem value="Lost & Found">Lost & Found</MenuItem>
              <MenuItem value="Health Tips">Health Tips</MenuItem>
              <MenuItem value="Trainer Recommendations">
                Trainer Recommendations
              </MenuItem>
              <MenuItem value="Training Advice">Training Advice</MenuItem>
              <MenuItem value="Adoption">Adoption</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {posts.length === 0 && (
        <Typography variant="h4" sx={{ marginTop: 10 }}>
          No posts found...<br></br>
          <br></br> Be the first to post something!
        </Typography>
      )}
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
      {!hasMore && posts.length > 0 && <p>No more posts to load.</p>}
    </Container>
  );
};

export default PostsPage;

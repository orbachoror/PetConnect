import React, { useState } from "react";
import {
  Button,
  Container,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
} from "@mui/material";
import PostsGrid from "../components/PostsGrid";
import usePosts from "../hooks/usePosts";
import { toggleLike } from "../services/postApi";
import Loader from "../components/Loader";
import { RestartAlt, FlagRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const PostsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const navigate = useNavigate();
  const { posts, loading, setPosts, loadMore, hasMore } = usePosts(
    undefined,
    sortBy,
    sortOrder,
    category
  );
  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setCategory("All");
  };

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
        backgroundAttachment: "fixed",
        padding: "40px 0",
        position: "relative",
      }}
    >
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="black">
          Browse Posts
        </Typography>
        <Paper
          elevation={6}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent effect
            backdropFilter: "blur(7px)", // Glassmorphism effect
            padding: 2,
            borderRadius: "12px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <FormControl sx={{ minWidth: 160 }}>
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

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
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
          <Button
            onClick={resetFilters}
            variant="outlined"
            color="secondary"
            sx={{
              borderRadius: "25px",
              textTransform: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              paddingX: 2,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <RestartAlt />
            Reset Filters
          </Button>
        </Paper>
        {posts.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="50vh"
            textAlign="center"
            color="white"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
            }}
          >
            <FlagRounded />
            <Typography variant="h4" fontWeight="bold" mb={2}>
              No posts found
            </Typography>
            <Typography variant="body1" mb={3}>
              Be the first to share something!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/create-post")}
              sx={{
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: "bold",
                paddingX: 3,
              }}
            >
              Create a Post
            </Button>
          </Box>
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
        {!hasMore && posts.length > 4 && (
          <p
            style={{
              color: "black",
              fontWeight: "bolder",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            No more posts to load.
          </p>
        )}
      </Container>
    </Box>
  );
};

export default PostsPage;

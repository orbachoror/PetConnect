import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getPostById, toggleLike } from "../services/postApi";
import { getCommentsByPostId, createComment } from "../services/commentApi";
import CommentList from "../components/CommentList";
import { useParams } from "react-router-dom";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
const baseUrl = import.meta.env.VITE_API_BASE_URL + "/";

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const userId = localStorage.getItem("userId") || "";

  const fetchPost = useCallback(async () => {
    try {
      if (!id) return;
      const postData = await getPostById(id);
      setPost(postData);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      if (!id) return;
      const commentsData = await getCommentsByPostId(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, [id]);

  const handleToggleLike = async () => {
    if (!post) return;
    if (!userId) {
      alert("You need to be logged in to like a post.");
      return;
    }
    try {
      const { likes, isLiked } = await toggleLike(post._id);
      setPost({
        ...post,
        likes,
        likedBy: isLiked
          ? [...post.likedBy, userId]
          : post.likedBy.filter((u) => u !== userId),
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("You need to be logged in to add a comment.");
      return;
    }
    if (!newComment.trim()) return;
    try {
      const comment = await createComment(id!, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  if (!id) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Invalid Post ID.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Post not found.
        </Typography>
      </Container>
    );
  }

  const isLiked = post.likedBy.includes(userId);

  return (
    <Container>
      <Box mt={4}>
        {post.postPicture && (
          <img
            src={`${baseUrl}${post.postPicture}`}
            alt={post.title}
            style={{
              width: "50%",
              maxHeight: "auto",
              objectFit: "cover",
              marginBottom: "16px",
            }}
          />
        )}
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          By: {post.owner.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {post.description}
        </Typography>
        <Button
          variant="contained"
          color={isLiked ? "secondary" : "primary"}
          startIcon={<FavoriteIcon />}
          onClick={handleToggleLike}
        >
          {isLiked ? "Unlike" : "Like"} ({post.likes})
        </Button>
      </Box>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Comments ({comments.length})
        </Typography>
        <CommentList comments={comments} />
        <Box mt={2} component="form" onSubmit={handleAddComment}>
          <TextField
            label="Add a comment"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PostPage;

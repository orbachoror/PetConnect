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
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
  updateComment,
} from "../services/commentApi";
import CommentList from "../components/CommentList";
import { useParams } from "react-router-dom";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
const baseUrl = import.meta.env.VITE_API_BASE_URL + "/";

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const userId = localStorage.getItem("userId") || "";

  const fetchPost = useCallback(async () => {
    try {
      if (!postId) return;
      const postData = await getPostById(postId);
      setPost(postData);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      if (!postId) return;
      const commentsData = await getCommentsByPostId(postId);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, [postId]);

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
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId, postId!);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleUpdateComment = async (commentId: string, newComment: string) => {
    try {
      const updatedComment = await updateComment(commentId, postId, newComment);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updatedComment : c))
      );
    } catch (error) {
      console.error("Failed to update comment:", error);
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
      const comment = await createComment(postId!, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  if (!postId) {
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
        <CommentList
          comments={comments}
          onUpdateClick={handleUpdateComment}
          onDeleteClick={handleDeleteComment}
        />
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

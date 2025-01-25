import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  deletePost,
  getPostById,
  toggleLike,
  updatePost,
} from "../services/postApi";
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
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const userId = localStorage.getItem("userId") || "";
  const placeholderImage = "https://placehold.co/600x400?text=Upload+Image";

  const fetchPost = useCallback(async () => {
    try {
      if (!postId) return;
      const postData = await getPostById(postId);
      setPost(postData);
      setUpdatedTitle(postData.title);
      setUpdatedDescription(postData.description);
      setImagePreview(
        postData.postPicture ? `${baseUrl}${postData.postPicture}` : null
      );
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdatedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!post) return;

    try {
      const formData = new FormData();
      if (!updatedTitle || !updatedDescription) {
        alert("Title and description are required.");
        return;
      }
      formData.append("title", updatedTitle);
      formData.append("description", updatedDescription);
      if (updatedImage) {
        console.log("image update post  = ", updatedImage);

        formData.append("image", updatedImage);
      }

      const updatedPost = await updatePost(post._id, formData);
      setPost(updatedPost);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post._id);
      alert("Post deleted successfully.");
      navigate("/posts");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

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
  const isOwner = post.owner._id === userId;
  return (
    <Container>
      <Box mt={4}>
        {editMode ? (
          <Box
            sx={{
              position: "relative",
              cursor: "pointer",
              border: "2px dashed #1976d2",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
            onClick={() => document.getElementById("image-input")?.click()}
          >
            <img
              src={imagePreview || placeholderImage}
              alt={updatedTitle}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
            <input
              id="image-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Box>
        ) : (
          post.postPicture && (
            <img
              src={`${baseUrl}${post.postPicture}`}
              alt={post.title}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                marginBottom: "16px",
              }}
            />
          )
        )}
        {editMode ? (
          <>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{ mr: 2 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
        {isOwner && !editMode && (
          <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setEditMode(true)}
              sx={{ mr: 2 }}
            >
              Edit Post
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete Post
            </Button>
          </Box>
        )}
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
      </Box>
    </Container>
  );
};

export default PostPage;

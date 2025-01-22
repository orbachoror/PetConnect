import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postApi";

const CreatePostPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description } = formData;

    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("title", title);
      formDataPayload.append("description", description);
      if (image) formDataPayload.append("image", image);

      await createPost(formDataPayload);
      navigate("/posts"); // Redirect to posts page after successful creation
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Post
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {/* Image Upload */}
            <Grid item xs={12} textAlign="center">
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {preview && (
                <Box mt={2}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Post"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default CreatePostPage;

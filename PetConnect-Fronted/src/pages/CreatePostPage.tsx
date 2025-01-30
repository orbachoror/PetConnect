import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postApi";
import Loader from "../components/Loader";
import {
  generateTitleWithImage,
  postReleatedToPets,
} from "../services/geminiApi";
import { validateDescription, validateTitle } from "../utils/validationUtils";

const CreatePostPage: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadOption, setUploadOption] = useState("generate");

  const navigate = useNavigate();

  const categories = [
    "General",
    "Product Recommendations",
    "Lost & Found",
    "Health Tips",
    "Trainer Recommendations",
    "Training Advice",
    "Adoption",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("input change select " + name + "  " + value);
    let fieldError = "";
    if (name === "title") fieldError = validateTitle(value) || "";
    if (name === "description") fieldError = validateDescription(value) || "";

    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      if (uploadOption === "generate") {
        try {
          setLoading(true);
          const generatedTitle = await generateTitleWithImage(file);
          const syntheticEvent = {
            target: {
              name: "title",
              value: generatedTitle,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          handleInputChange(syntheticEvent);
        } catch (err) {
          console.error("Failed to generate title:", err);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description } = formData;
    const category = formData.category || "General";
    const newErrors: Record<string, string> = {};
    newErrors.title = validateTitle(title) || "";
    newErrors.description = validateDescription(description) || "";

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;
    setLoading(true);

    try {
      const isRelatedToPets = await postReleatedToPets(description);
      if (!isRelatedToPets) {
        setLoading(false);
        return alert(
          "Description is not related to pets. Please provide a valid description."
        );
      }
      const formDataPayload = new FormData();
      formDataPayload.append("title", title);
      formDataPayload.append("description", description);
      formDataPayload.append("category", category);

      if (image) formDataPayload.append("image", image);

      await createPost(formDataPayload);
      navigate("/posts");
    } catch (err: any) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ["Error"]: err.response?.data?.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, rgb(228, 220, 220),rgb(255, 251, 251))",
        }}
      >
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Post
        </Typography>
        {errors.Error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {errors.Error}
          </Typography>
        )}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            How do you want to upload the picture?
          </Typography>
          <RadioGroup
            value={uploadOption}
            onChange={(e) => setUploadOption(e.target.value)}
            row
          >
            <FormControlLabel
              value="generate"
              control={<Radio />}
              label="Generate Title With Gemini"
            />
            <FormControlLabel
              value="skip"
              control={<Radio />}
              label="Skip Generating Title"
            />
          </RadioGroup>
        </Box>
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
                InputLabelProps={{ shrink: !!formData.title }}
                error={!!errors.title}
                helperText={errors.title}
                required
                disabled={uploadOption === "generate" && loading}
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
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={formData.category || "General"}
                  name="category"
                  onChange={(e) =>
                    handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                  label="Category"
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Image Upload */}
            <Grid item xs={12} textAlign="center">
              <Button variant="contained" component="label">
                {loading ? "Genarating Title..." : "Upload Image"}
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
                {loading ? <Loader /> : "Create Post"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
    </Box>
  );
};

export default CreatePostPage;

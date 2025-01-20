import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // State for profile picture
  const [preview, setPreview] = useState<string | null>(null); // State for live preview
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file)); // Generate a live preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, phone, address, dateOfBirth } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create FormData
      const formDataPayload = new FormData();
      formDataPayload.append("name", name);
      formDataPayload.append("email", email);
      formDataPayload.append("password", password);

      if (phone) formDataPayload.append("phone", phone);
      if (address) formDataPayload.append("address", address);
      if (dateOfBirth) formDataPayload.append("dateOfBirth", dateOfBirth);
      if (profilePicture) formDataPayload.append("image", profilePicture); // Attach profile picture

      // Send FormData to the backend
      await axios.post("/auth/register", formDataPayload);

      // Redirect to login after successful registration
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Your Account
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
              />
            </Grid>
            {/* Password */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                type="password"
              />
            </Grid>
            {/* Confirm Password */}
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                type="password"
              />
            </Grid>
            {/* Phone (Optional) */}
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                type="tel"
              />
            </Grid>
            {/* Address (Optional) */}
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            {/* Date of Birth (Optional) */}
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                fullWidth
                value={formData.dateOfBirth}
                onChange={handleChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {/* Profile Picture */}
            <Grid item xs={12} textAlign="center">
              <Button variant="contained" component="label">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {preview && (
                <Box mt={2}>
                  <img
                    src={preview}
                    alt="Profile Preview"
                    style={{
                      width: "300px",
                      height: "300px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              )}
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

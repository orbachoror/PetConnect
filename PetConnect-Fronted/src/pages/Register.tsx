import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateDateOfBirth,
  validatePhone,
} from "../utils/validationUtils";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../services/authApi";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // State for profile picture
  const [preview, setPreview] = useState<string | null>(null); // State for live preview
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    let fieldError = "";
    if (name === "name") fieldError = validateName(value) || "";
    if (name === "email") fieldError = validateEmail(value) || "";
    if (name === "password") fieldError = validatePassword(value) || "";
    if (name === "dateOfBirth") fieldError = validateDateOfBirth(value) || "";
    if (name === "phone") fieldError = validatePhone(value) || "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      address,
      dateOfBirth,
    } = formData;

    const newErrors: Record<string, string> = {};
    newErrors.name = validateName(name) || "";
    newErrors.email = validateEmail(email) || "";
    newErrors.password = validatePassword(password) || "";
    newErrors.dateOfBirth = validateDateOfBirth(dateOfBirth) || "";
    newErrors.phone = validatePhone(phone) || "";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("name", name);
      formDataPayload.append("email", email);
      formDataPayload.append("password", password);

      if (phone) formDataPayload.append("phone", phone);
      if (address) formDataPayload.append("address", address);
      if (dateOfBirth) formDataPayload.append("dateOfBirth", dateOfBirth);
      if (profilePicture) formDataPayload.append("image", profilePicture); // Attach profile picture

      await registerApi(formDataPayload);
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ["Error"]: err.response?.data?.message,
      }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Your Account
        </Typography>
        {errors.Error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {errors.Error}
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
                error={!!errors.name}
                helperText={errors.name}
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
                error={!!errors.email}
                helperText={errors.email}
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
                error={!!errors.password}
                helperText={errors.password}
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
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                error={!!errors.phone}
                helperText={errors.phone}
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
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
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

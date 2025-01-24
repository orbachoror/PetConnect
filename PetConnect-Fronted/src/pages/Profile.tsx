import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, TextField, Avatar,Typography } from "@mui/material";
import ProfileActions from "../types/ProfileACtions";
import api from "../services/api";
import { SenteziedUserType } from "../types/User";


//update the date after twice editing
 
const Profile: React.FC = () => {
  const [userDetails, setUserDetails] = useState<SenteziedUserType>({} as SenteziedUserType);
  const [cancelEdit, setCancelEdit] = useState<SenteziedUserType>({} as SenteziedUserType);
  const [isEditMode, setIsEditMode] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/user");
      if (response.status === 200) {
        const user = response.data;
        const formattedUserDetails = {
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          dateOfBirth: user.dateOfBirth ? formatDate(user.dateOfBirth) : "",
          profilePicture: user.profilePicture || "",
        };
  
        setUserDetails(formattedUserDetails); 
        setCancelEdit(formattedUserDetails);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };


  /*--------------------
  |  formatDate Function
  ---------------------*/

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); 
    setImage(file); 
    setPreview(fileURL); 
    setUserDetails({ ...userDetails, profilePicture: fileURL }); 
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userDetails.name);
      formData.append("email", userDetails.email);
      formData.append("phone", userDetails.phone || "");
      formData.append("address", userDetails.address || "");
      formData.append("dateOfBirth", userDetails.dateOfBirth || "");
      if(image) formData.append("image", image);
      setIsEditMode(false);
      const response = await api.put("/user", formData);

      if (response.status === 200) {
        alert("User updated successfully");
        setCancelEdit(userDetails);
      } else {
        alert("Error updating user after sending data");
        throw new Error("Error updating user after sending data");
      }
    } catch (err) {
      console.log("Error updating user"+ err);
      alert("Error updating user");
    }
  };

  const handleCancel = () => {
    setUserDetails(cancelEdit);
    setPreview(null); // Reset preview to the original profile picture
    setIsEditMode(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        padding: 4,
        gap: 2,
        marginTop: 2,
      }}
     >
      <Grid container spacing={4} sx={{ maxWidth: "1900px", width: "100%" }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={5}
            sx={{
              padding: 4,
              borderRadius: 4,
              minHeight: "100%",
              backgroundColor: "#ffffff",
            }}
          >
            
              {isEditMode ? (
                <>
                  <Avatar
                    src={preview ? preview : userDetails.profilePicture ? baseUrl + "/" + userDetails.profilePicture : undefined}
                    alt="Profile Picture"
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      border: '4px solid #90caf9',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('profilePictureInput')?.click()}
                  />
                  <input
                    type="file"
                    alt="Preview"
                    id="profilePictureInput"
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg"
                    onChange={handlePictureChange}
                  />
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={userDetails.address}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={userDetails.dateOfBirth}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Avatar
                    src={preview ? preview : userDetails.profilePicture ? baseUrl + "/" + userDetails.profilePicture : undefined}
                    alt="Profile Picture"
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      border: '4px solid #90caf9',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                      cursor: 'default',
                    }}
                  />
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      align="center"
                      gutterBottom
                      sx={{
                        color: "#1976d2",
                        fontWeight: 600,
                      }}
                    >
                      {userDetails.name}
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ color: "#6b7280" }}>
                      {userDetails.email}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.1rem",
                        marginBottom: 1,
                        color: "#374151",
                      }}
                    >
                      <strong>Phone:</strong> {userDetails.phone}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.1rem",
                        marginBottom: 1,
                        color: "#374151",
                      }}
                    >
                      <strong>Address:</strong> {userDetails.address}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.1rem",
                        marginBottom: 1,
                        color: "#374151",
                      }}
                    >
                      <strong>Date of Birth:</strong> {userDetails.dateOfBirth}
                    </Typography>
                  </Grid>
                  
                </>
              )}      
                  <ProfileActions
                    isEditMode={isEditMode}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={() => setIsEditMode(true)}
                  />        
            </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: "#ffffff",
              minHeight: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <h2 style={{ color: "#1976d2" }}>User Posts</h2>
              <p style={{ color: "#6b7280" }}>No posts available yet...</p>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

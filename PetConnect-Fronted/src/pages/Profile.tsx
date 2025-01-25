import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import DetailsForm from "../components/ProfileDetailes";
import EditForm from "../components/ProfileEditForm";
import api from "../services/api";
import { SenteziedUserType } from "../types/User";
import { useAuth } from "../hooks/Auth";
import usePosts from "../hooks/usePosts";
import Loader from "../components/Loader";
import PostsGrid from "../components/PostsGrid";

const Profile: React.FC = () => {
  const [userDetails, setUserDetails] = useState<SenteziedUserType>(
    {} as SenteziedUserType
  );
  const [cancelEdit, setCancelEdit] = useState<SenteziedUserType>(
    {} as SenteziedUserType
  );
  const userId = localStorage.getItem("userId");
  const { posts, loading } = usePosts(userId!);
  console.log("posts", posts);

  const [isEditMode, setIsEditMode] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { updateUser } = useAuth();
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
      if (image) formData.append("image", image);
      setIsEditMode(false);
      const response = await api.put("/user", formData);

      if (response.status === 200) {
        alert("User updated successfully");
        updateUser(response.data);
        setCancelEdit(response.data);
      } else {
        alert("Error updating user after sending data");
        throw new Error("Error updating user after sending data");
      }
    } catch (err) {
      console.log("Error updating user" + err);
      alert("Error updating user");
    }
  };

  const handleCancel = () => {
    setUserDetails(cancelEdit);
    setPreview(null); // ------------Reset preview to the original profile picture--------------//
    setIsEditMode(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
        alignItems: "center", // Center align both sections horizontally
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        padding: 4,
        gap: 4, // Space between the sections
        marginTop: 2,
      }}
    >
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
          <EditForm
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            onPictureChange={handlePictureChange}
            preview={preview}
            onSave={handleSave}
            onCancel={handleCancel}
            baseUrl={baseUrl}
          />
        ) : (
          <DetailsForm
            userDetails={userDetails}
            baseUrl={baseUrl}
            preview={preview}
            onEdit={() => setIsEditMode(true)}
          />
        )}
      </Paper>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 4,
          backgroundColor: "#ffffff",
          minHeight: "100%",
        }}
      >
        <Box sx={{ paddingY: 2, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom color="primary">
            User Posts
          </Typography>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <Loader />
            </Box>
          ) : posts.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
              border="1px solid green"
            >
              <Typography variant="body1" color="textSecondary">
                No Posts Yet
              </Typography>
            </Box>
          ) : (
            <PostsGrid posts={posts} userId={userId!} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;

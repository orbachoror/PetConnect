import React from "react";
import { Grid, Typography } from "@mui/material";
import { SenteziedUserType } from "../types/User";

const ProfileDetails: React.FC<SenteziedUserType> = (user) => {
  return (
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
        {user.name}
      </Typography>
      <Typography variant="body1" align="center" sx={{ color: "#6b7280" }}>
        {user.email}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "1.1rem",
          marginBottom: 1,
          color: "#374151",
        }}
      >
        <strong>Phone:</strong> {user.phone}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "1.1rem",
          marginBottom: 1,
          color: "#374151",
        }}
      >
        <strong>Address:</strong> {user.address}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "1.1rem",
          marginBottom: 1,
          color: "#374151",
        }}
      >
        <strong>Date of Birth:</strong> {user.dateOfBirth}
      </Typography>
    </Grid>
  );
};

export default ProfileDetails;

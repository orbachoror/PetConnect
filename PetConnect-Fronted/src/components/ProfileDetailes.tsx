import React from "react";
import { Grid, Typography, Avatar, Button } from "@mui/material";
import { SenteziedUserType } from "../types/User";

interface DetailsFormProps {
  userDetails: SenteziedUserType;
  baseUrl: string;
  preview: string | null;
  onEdit: () => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ userDetails, baseUrl, preview, onEdit }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Avatar
          src={preview ? preview : userDetails.profilePicture ? baseUrl + "/" + userDetails.profilePicture : undefined}
          alt="Profile Picture"
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto",
            border: "4px solid #90caf9",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          {userDetails.name}
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          {userDetails.email}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {userDetails.phone}
        </Typography>
        <Typography>
          <strong>Address:</strong> {userDetails.address}
        </Typography>
        <Typography>
          <strong>Date of Birth:</strong> {userDetails.dateOfBirth}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={onEdit}>
          Edit
        </Button>
      </Grid>
    </Grid>
  );
};

export default DetailsForm;

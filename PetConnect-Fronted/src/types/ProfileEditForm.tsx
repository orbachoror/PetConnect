import React from "react";
import { Grid, TextField } from "@mui/material";
import { SenteziedUserType } from "../types/User";


const ProfileEditForm: React.FC<SenteziedUserType> = (formData)=> {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={formData.phone}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        margin="normal"
      />
    </Grid>
  );
};

export default ProfileEditForm;

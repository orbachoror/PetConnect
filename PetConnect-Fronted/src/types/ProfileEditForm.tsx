import React from 'react';
import { Grid, TextField } from '@mui/material';

interface ProfileEditFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    profilePicture: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ formData, handleInputChange }) => {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        margin="normal"
      />
    </Grid>
  );
};

export default ProfileEditForm;

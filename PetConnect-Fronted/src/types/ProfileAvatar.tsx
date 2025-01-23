import React from 'react';
import { Avatar, Grid } from '@mui/material';

interface ProfileAvatarProps {
  imageURL: string | null;
  onPictureChange?: ((file: File | null) => void) | null;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ imageURL, onPictureChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onPictureChange?.(event.target.files[0]); // Call the function only if it's defined
    }
  };

  return (
    <Grid item xs={12} sx={{ textAlign: 'center', position: 'relative' }}>
      <Avatar
        src={imageURL || undefined}
        alt="Profile Picture"
        sx={{
          width: 120,
          height: 120,
          margin: '0 auto',
          border: '4px solid #90caf9',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: onPictureChange ? 'pointer' : 'default', 
        }}
        onClick={() => {
          if (onPictureChange) {
            document.getElementById('profilePictureInput')?.click();
          }
        }}
      />
      {onPictureChange && (
        <input
          type="file"
          id="profilePictureInput"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
      )}
    </Grid>
  );
};

export default ProfileAvatar;

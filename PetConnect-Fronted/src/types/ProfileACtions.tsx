import React from 'react';
import { Grid, Button } from '@mui/material';

interface ProfileActionsProps {
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ isEditMode, onSave, onCancel, onEdit }) => {
  return (
    <Grid item xs={12} sx={{ textAlign: 'center' }}>
      {isEditMode ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            sx={{
              marginRight: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              marginBottom: '20px',
            }}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            sx={{
              borderColor: '#f44336',
              color: '#f44336',
              '&:hover': {
                backgroundColor: '#f4433620',
              },
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onEdit}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          Edit Profile
        </Button>
      )}
    </Grid>
  );
};

export default ProfileActions;

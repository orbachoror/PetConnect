import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import ProfileAvatar from '../types/ProfileAvatar';
import ProfileDetails from '../types/ProfileDetailes';
import ProfileEditForm from '../types/ProfileEditForm';
import ProfileActions from '../types/ProfileACtions';
import { useAuth } from '../hooks/Auth';
import api from '../services/api';

interface IUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePicture: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<IUser>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    profilePicture: '',
  });

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<IUser>(userDetails);

  useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? formatDate(user.dateOfBirth) : '',
        profilePicture: user.profilePicture || '',
      });
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? formatDate(user.dateOfBirth) : '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData({ ...formData, profilePicture: reader.result as string });
          setUserDetails({ ...userDetails, profilePicture: reader.result as string });
        }
      };
      reader.readAsDataURL(file); // Convert file to base64 string for display
    }
  };

  const handleSave = async() => {
    
    try{
      setUserDetails(formData);
      setIsEditMode(false);

      const response =await api.put('/user/', formData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
       }
      );

      if(response.status === 200){
        alert('User updated successfully');
      }else{
        alert('Error updating user');
        throw new Error('Error updating user');
      }
    }catch{
      alert('Error updating user');
    }
  };

  const handleCancel = () => {
    setFormData(userDetails);
    setIsEditMode(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        padding: 4,
        gap: 2, 
        marginTop: 2, 
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: '1900px', width: '100%' }}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={5}
            sx={{
              padding: 4,
              borderRadius: 4,
              minHeight: '100%',
              backgroundColor: '#ffffff',
            }}
          >
            <Grid container spacing={3}>
            <ProfileAvatar
                src={formData.profilePicture}
                onPictureChange={isEditMode ? handlePictureChange : null}
              />
              {isEditMode ? (
                <ProfileEditForm formData={formData} handleInputChange={handleInputChange} />
              ) : (
                <ProfileDetails user={userDetails} />
              )}
              <ProfileActions
                isEditMode={isEditMode}
                onSave={handleSave}
                onCancel={handleCancel}
                onEdit={() => setIsEditMode(true)}
              />
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: '#ffffff',
              minHeight: '100%', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <h2 style={{ color: '#1976d2' }}>User Posts</h2>
              <p style={{ color: '#6b7280' }}>No posts available yet...</p>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

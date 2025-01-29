import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useAuth } from '../hooks/Auth';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';


const Login: React.FC = () => {
  const { login,loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials or server error.');
    }
  };
 
  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try{
      const res= await loginWithGoogle(credentialResponse);
      navigate('/');
      console.log(res);
    }catch(error){
      console.error('Google login failed:', error);
      alert('Google login failed');
    }
  };

  const onGoogleLoginError = () => {
    console.error('Google login error');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
         PetConnect Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
          <Box mt={2}>
          <div 
            style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'center',
              }}>
              <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError}></GoogleLogin>
            </div>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
            
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
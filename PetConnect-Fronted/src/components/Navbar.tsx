import React from 'react';
import { AppBar, Toolbar, Typography, Box} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';
import Button from '../types/Button';

const NavigationBar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position='sticky' 
    sx={{
      backgroundColor: '#1e1e2f',
      padding: '0px 20px',
      borderBottom: '1px solid #e0e0e0',}}>

      <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '2000px',
        }}>
          
      <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff' , display: 'flex'}}>
          <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/peConnectLogo.png" alt="PetConnect" style={{
            width: 50,
            height: 50,
            borderRadius: '50%', 
            marginRight: 20,
          }} />
         </Link>
         PetConnect
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isAuthenticated && (
          <>
           <Box sx={{ display: 'flex', gap: 2 }}>
              <Button to="/Events">
                Events
              </Button>
              <Button  to="/Posts">
                Posts
              </Button>
              <Button to="/Profile">
                Profile
              </Button>
              <Button to ="/" onClick={handleLogout}>
                Logout
              </Button>
              {user && (
                <Typography variant="body1" sx={{  color: '#1976d2' }}>
                  <img src={user.profilePicture}  style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%', 
                      marginRight: 10,
                    }} />
                </Typography>
              )}
            </Box>
          </>
          )}
          {!isAuthenticated && (
            <>
            <Button to="/Posts">
              Posts
            </Button>
            <Button to="/login">
              Login
            </Button>
            <Button to="/register">
              Register
            </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;

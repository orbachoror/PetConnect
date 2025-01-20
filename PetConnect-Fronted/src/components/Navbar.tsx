import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/peConnectLogo.png" alt="PetConnect" style={{ width: 40, height: 40 }} />
         </Link>
         PetConnect
        </Typography>

        {isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/Events">
              Events
            </Button>
            <Button color="inherit" component={Link} to="/Posts">
              Posts
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
        {!isAuthenticated && (
          <>
          <Button color="inherit" component={Link} to="/Posts">
            Posts
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;

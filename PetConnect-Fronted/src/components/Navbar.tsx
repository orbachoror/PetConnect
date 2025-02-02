import { FC } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import Button from "../types/Button";

const NavigationBar: FC = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const baseUrl = import.meta.env.VITE_API_BASE_URL + "/";

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#1e1e2f",
        padding: "0px 20px",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, color: "#ffffff", display: "flex" }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src="/peConnectLogo.png"
              alt="PetConnect"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                marginRight: 20,
              }}
            />
            PetConnect
          </Link>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated && (
            <>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button to="/create-post">Create Post</Button>
                <Button to="/Events">Events</Button>
                <Button to="/Posts">Posts</Button>
                <Button to="/" onClick={handleLogout}>
                  Logout
                </Button>
                {currentUser?.profilePicture ? (
                  <Typography variant="body1" sx={{ color: "#1976d2" }}>
                    <img
                      src={baseUrl + currentUser?.profilePicture}
                      alt="Profile"
                      onClick={() => navigate("/Profile")}
                      style={{
                        cursor: "pointer",
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        marginRight: 10,
                      }}
                    />
                  </Typography>
                ) : (
                  <Typography
                    onClick={() => navigate("/Profile")}
                    variant="body1"
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                  >
                    {"Hello " + currentUser?.name}
                  </Typography>
                )}
              </Box>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Button to="/Posts">Posts</Button>
              <Button to="/login">Login</Button>
              <Button to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;

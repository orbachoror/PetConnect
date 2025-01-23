import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface StyledButtonProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  to,
  children,
  onClick,
}) => {
  return (
    <Button
      component={Link}
      to={to}
      onClick={onClick}
      sx={{
        border: "1px solid #e0e0e0",
        color: "#e0e0e0", // Text color
        padding: "6px 16px",
        borderRadius: "8px",
        textTransform: "none",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#1976d2", // Background color on hover
          color: "#ffffff", // Text color on hover
        },
      }}
    >
      {children}
    </Button>
  );
};

export default StyledButton;

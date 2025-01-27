import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { useEffect } from "react";
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  if (isAuthenticated) return children;
};

export default ProtectedRoute;

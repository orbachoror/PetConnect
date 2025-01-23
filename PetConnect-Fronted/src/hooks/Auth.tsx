import React, {
  FC,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { loginApi } from "../services/authApi";
import { logoutApi } from "../services/authApi";
import { SenteziedUserType, UserType } from "../types/User";

interface AuthContextProps {
  currentUser: SenteziedUserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: SenteziedUserType | null) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<SenteziedUserType | null>(
    null
  );
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  const sanitizeUser = (user: UserType): SenteziedUserType => {
    const { name, email, phone, address, dateOfBirth, profilePicture } = user;
    return { name, email, phone, address, dateOfBirth, profilePicture };
  };
  const login = async (email: string, password: string) => {
    const { accessToken, user, refreshToken } = await loginApi(email, password);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", user._id);
    localStorage.setItem("refreshToken", refreshToken);
    setCurrentUser(sanitizeUser(user));
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userProfilePicture", user.profilePicture);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutApi(localStorage.getItem("refreshToken"));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  const updateUser = (updatedUser: SenteziedUserType | null) => {
    setCurrentUser(updatedUser);
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, currentUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: IUser | null; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
    setIsAuthenticated(true);
    setUser(response.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
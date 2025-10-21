// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userRole = localStorage.getItem('user_role');
      const userInfo = localStorage.getItem('user_info');

      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUser({ ...parsedUser, role: userRole });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user info:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('access_token', token);
    if (userData) {
      localStorage.setItem('user_role', userData.role);
      localStorage.setItem('user_info', JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_info');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('user_info', JSON.stringify({ ...user, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
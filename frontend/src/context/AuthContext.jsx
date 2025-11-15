// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('🔄 AuthContext initializing...');
    
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('📦 Stored token:', storedToken ? 'exists' : 'null');
    console.log('📦 Stored user:', storedUser ? 'exists' : 'null');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ Restoring auth state from localStorage');
        console.log('   User:', parsedUser);
        
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('⚠️ No stored auth data found');
    }
    
    setLoading(false);
    console.log('✅ AuthContext initialized');
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log('🔒 AuthContext state updated:', {
      isAuthenticated,
      user: user ? { ...user, password: undefined } : null,
      tokenExists: !!token,
      loading
    });
  }, [isAuthenticated, user, token, loading]);

  const login = (accessToken, userData) => {
    console.log('🔐 Login function called');
    console.log('   Token:', accessToken ? 'provided' : 'missing');
    console.log('   User data:', userData);

    // Validate inputs
    if (!accessToken) {
      console.error('❌ No access token provided');
      throw new Error('Access token is required');
    }

    if (!userData) {
      console.error('❌ No user data provided');
      throw new Error('User data is required');
    }

    if (!userData.role) {
      console.error('❌ User data missing role property');
      throw new Error('User role is required');
    }

    // Store in localStorage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update context state
    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);

    console.log('✅ Auth state updated successfully');
    console.log('   isAuthenticated:', true);
    console.log('   User role:', userData.role);
  };

  const logout = () => {
    console.log('🚪 Logout function called');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear all legacy keys that might exist
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_info');
    
    // Reset context state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    console.log('✅ Logged out successfully');
  };

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

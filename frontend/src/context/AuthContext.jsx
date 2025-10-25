// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('user_info');
    const storedUserRole = localStorage.getItem('user_role');

    console.log('🔄 AuthContext initializing:', { 
      hasToken: !!storedToken, 
      hasUserInfo: !!storedUserInfo,
      userRole: storedUserRole 
    });

    if (storedToken) {
      setToken(storedToken);
      
      if (storedUserInfo) {
        try {
          const parsedUser = JSON.parse(storedUserInfo);
          // Make sure user object has role
          if (!parsedUser.role && storedUserRole) {
            parsedUser.role = storedUserRole;
          }
          setUser(parsedUser);
          console.log('✅ User loaded from localStorage:', parsedUser);
        } catch (error) {
          console.error('Error parsing user info:', error);
          // Fallback: create user object from localStorage
          setUser({
            role: storedUserRole,
            id: localStorage.getItem('user_id')
          });
        }
      } else if (storedUserRole) {
        // Create minimal user object if no user_info
        setUser({
          role: storedUserRole,
          id: localStorage.getItem('user_id')
        });
        console.log('✅ Created minimal user object from role');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (accessToken) => {
    console.log('📝 Login called with token');
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    console.log('🚪 Logout called');
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  console.log('🔒 AuthContext state:', { isAuthenticated, hasUser: !!user, loading });

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      token, 
      login, 
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

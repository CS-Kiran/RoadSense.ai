// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log("🔒 ProtectedRoute checking for role:", role);
  console.log("🔒 Auth state:", { isAuthenticated, user, loading });

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Special handling for admin routes
  if (role === 'admin') {
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in');
    const userRole = localStorage.getItem('user_role');
    
    console.log("🔒 Admin check:", { isAdminLoggedIn, userRole });
    
    if (isAdminLoggedIn === 'true' && userRole === 'admin') {
      console.log('✅ Admin authenticated');
      return children;
    }
    
    console.log('❌ Admin not authenticated, redirecting to /admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  // For citizen and official routes
  // Get role from user object OR fallback to localStorage
  const userRoleFromContext = user?.role;
  const userRoleFromStorage = localStorage.getItem('user_role');
  const actualUserRole = userRoleFromContext || userRoleFromStorage;
  
  console.log("🔒 User role check:", { 
    userRoleFromContext, 
    userRoleFromStorage, 
    actualUserRole 
  });

  // Check authentication (AuthContext OR localStorage)
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('user_info');
  const isUserAuthenticated = isAuthenticated || (token && userInfo);

  if (!isUserAuthenticated) {
    console.log('❌ User not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (role && actualUserRole !== role) {
    console.log(`❌ User role ${actualUserRole} doesn't match required role ${role}`);
    
    // Redirect to appropriate dashboard based on user's role
    const roleDashboards = {
      citizen: '/citizen/dashboard',
      official: '/official/dashboard',
      admin: '/admin/dashboard',
    };

    const redirectPath = roleDashboards[actualUserRole] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ User authenticated with correct role');
  return children;
};

export default ProtectedRoute;

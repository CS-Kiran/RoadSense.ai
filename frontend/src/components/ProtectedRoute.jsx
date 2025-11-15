// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute checking...');
  console.log('   Allowed roles:', allowedRoles);
  console.log('   Loading:', loading);
  console.log('   IsAuthenticated:', isAuthenticated);
  console.log('   User:', user);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('❌ User not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    console.log('   User role:', userRole);
    console.log('   Role allowed:', allowedRoles.includes(userRole));

    if (!allowedRoles.includes(userRole)) {
      console.log('❌ User role not allowed, redirecting');
      
      // Redirect based on user role
      if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === 'official') {
        return <Navigate to="/official/dashboard" replace />;
      } else if (userRole === 'citizen') {
        return <Navigate to="/citizen/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { currentUser, authTokens, isTokenValid, forceLogout } = useAuth();
  const location = useLocation();

  // Check token validity
  useEffect(() => {
    // Only check if we have tokens
    if (authTokens && !isTokenValid()) {
      forceLogout();
    }
  }, [authTokens, isTokenValid, forceLogout]);

  // If user is not authenticated, redirect to login
  if (!currentUser || !authTokens) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} />;
  }

  // If the route requires admin and user is not admin, redirect
  // You can add additional role checking logic here
  if (adminOnly) {
    // Add your admin role check logic here if needed
    // For example: if (currentUser.role !== 'admin') { ... }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
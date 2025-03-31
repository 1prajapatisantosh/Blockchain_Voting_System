import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { currentUser, loading, userRole } = useAuth();
  const location = useLocation();

  // Store the last location when a user is authenticated
  useEffect(() => {
    if (currentUser && !loading) {
      sessionStorage.setItem('lastAuthenticatedPath', location.pathname);
    }
  }, [currentUser, loading, location.pathname]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading authentication..." />;
  }

  if (!currentUser) {
    // Store the attempted location so we can redirect back after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

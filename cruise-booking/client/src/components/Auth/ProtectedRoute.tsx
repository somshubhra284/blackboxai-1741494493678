import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireGuest = false,
}) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If route requires guest access and user is authenticated,
  // redirect to home or previous intended destination
  if (requireGuest && isAuthenticated) {
    const intendedPath = location.state?.from?.pathname || '/cruises';
    return <Navigate to={intendedPath} replace />;
  }

  // If route requires authentication and user is not authenticated,
  // redirect to login page with the return url
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Render children if all conditions are met
  return <>{children}</>;
};

export default ProtectedRoute;

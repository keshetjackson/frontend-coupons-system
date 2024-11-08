import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/auth';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Save the attempted url to redirect back after login
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, loading, navigate, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render child routes if authenticated
  return isAuthenticated ? <Outlet /> : null;
};
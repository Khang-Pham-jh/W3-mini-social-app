import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthLoading, isLoggedIn } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

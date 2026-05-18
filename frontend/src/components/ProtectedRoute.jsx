import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div className="spinner" style={{ marginTop: '45vh' }} />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;

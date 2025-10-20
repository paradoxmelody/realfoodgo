// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#16a34a',
        fontWeight: 600
      }}>
        Loading...
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
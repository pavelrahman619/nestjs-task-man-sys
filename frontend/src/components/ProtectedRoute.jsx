import { useAuth } from '../hooks/useAuth.js';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, show fallback component or null
  if (!isAuthenticated) {
    return fallback;
  }

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;

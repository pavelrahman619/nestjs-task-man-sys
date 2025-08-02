import { useAuth } from './useAuth.js';

/**
 * Hook that provides auth status utilities
 * @returns {Object} Auth status utilities
 */
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  const isGuest = !isAuthenticated && !isLoading;
  const hasError = !!error;
  const isReady = !isLoading;

  return {
    isAuthenticated,
    isGuest,
    isLoading,
    isReady,
    hasError,
    user,
    error,
    
    // Helper methods
    canAccess: (requiredRole) => {
      if (!isAuthenticated || !user) return false;
      if (!requiredRole) return true;
      return user.role === requiredRole || user.roles?.includes(requiredRole);
    },
    
    getUserDisplayName: () => {
      if (!user) return '';
      return user.name || user.email || 'User';
    },
    
    isCurrentUser: (userId) => {
      return user?.id === userId;
    }
  };
};

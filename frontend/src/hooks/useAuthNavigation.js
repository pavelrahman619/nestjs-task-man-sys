import { useAuth } from './useAuth.js';

/**
 * Hook for managing authentication redirects and navigation
 * @returns {Object} Navigation utilities
 */
export const useAuthNavigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Store intended destination before login
  const setRedirectPath = (path) => {
    sessionStorage.setItem('auth_redirect', path);
  };

  // Get and clear redirect path
  const getRedirectPath = () => {
    const path = sessionStorage.getItem('auth_redirect');
    if (path) {
      sessionStorage.removeItem('auth_redirect');
      return path;
    }
    return '/'; // default redirect
  };

  // Check if user should be redirected after auth
  const shouldRedirect = () => {
    return sessionStorage.getItem('auth_redirect') !== null;
  };

  // Navigation helpers
  const navigateAfterAuth = () => {
    const redirectPath = getRedirectPath();
    // You would implement navigation here based on your routing solution
    // For example, if using React Router:
    // navigate(redirectPath);
    console.log('Navigate to:', redirectPath);
    return redirectPath;
  };

  const requireAuth = (callback) => {
    if (isLoading) return false;
    
    if (!isAuthenticated) {
      // Store current location for redirect after login
      setRedirectPath(window.location.pathname);
      return false;
    }
    
    if (callback) callback();
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    setRedirectPath,
    getRedirectPath,
    shouldRedirect,
    navigateAfterAuth,
    requireAuth,
    
    // Helper methods
    canNavigate: !isLoading,
    needsAuth: !isAuthenticated && !isLoading,
  };
};

/**
 * Hook for handling auth-related URL parameters and state
 * @returns {Object} URL state utilities
 */
export const useAuthUrlState = () => {
  // Get URL parameters
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      mode: urlParams.get('mode'), // 'login' or 'register'
      redirect: urlParams.get('redirect'),
      error: urlParams.get('error'),
      message: urlParams.get('message'),
    };
  };

  // Update URL without page reload
  const updateUrl = (params = {}) => {
    const url = new URL(window.location);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.replaceState({}, '', url.toString());
  };

  // Clear auth-related URL parameters
  const clearAuthParams = () => {
    updateUrl({
      mode: null,
      error: null,
      message: null,
    });
  };

  return {
    getUrlParams,
    updateUrl,
    clearAuthParams,
  };
};

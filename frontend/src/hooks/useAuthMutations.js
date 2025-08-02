import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useAuth } from './useAuth.js';

// Login mutation hook
export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Invalidate and refetch any cached user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

// Register mutation hook
export const useRegister = () => {
  const { register } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      // Invalidate and refetch any cached user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

// Logout mutation hook
export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
};

// Hook to get current user data with auth header
export const useCurrentUser = () => {
  const { getAuthHeader, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/users/me', {
        headers: getAuthHeader(),
      });
      return response;
    },
    enabled: isAuthenticated,
  });
};

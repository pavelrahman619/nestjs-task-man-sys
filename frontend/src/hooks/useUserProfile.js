import { useAuth } from './useAuth.js';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api.js';

/**
 * Hook for user profile operations
 * @returns {Object} User profile utilities and mutations
 */
export const useUserProfile = () => {
  const { user, getAuthHeader } = useAuth();

  // Fetch current user profile
  const fetchProfile = useMutation({
    mutationFn: async () => {
      const response = await api.get('/users/me', {
        headers: getAuthHeader(),
      });
      return response;
    },
  });

  // Update user profile
  const updateProfile = useMutation({
    mutationFn: async (userData) => {
      const response = await api.put('/users/profile', userData, {
        headers: getAuthHeader(),
      });
      return response;
    },
    onSuccess: (data) => {
      // You might want to update the context here
      console.log('Profile updated successfully:', data);
    },
  });

  // Change password
  const changePassword = useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword,
      }, {
        headers: getAuthHeader(),
      });
      return response;
    },
  });

  // Delete account
  const deleteAccount = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/users/account', {
        headers: getAuthHeader(),
      });
      return response;
    },
  });

  return {
    user,
    fetchProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    
    // Helper methods
    isProfileComplete: () => {
      return user?.name && user?.email;
    },
    
    getInitials: () => {
      if (!user) return '';
      if (user.name) {
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      }
      return user.email[0].toUpperCase();
    }
  };
};

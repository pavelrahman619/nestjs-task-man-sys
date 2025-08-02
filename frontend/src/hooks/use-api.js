import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useAuth } from './useAuth.js';

// Query keys for better cache management
export const queryKeys = {
  tasks: ['tasks'],
  task: (id) => ['tasks', id],
  users: ['users'],
  user: (id) => ['users', id],
};

// Task-related hooks
export const useTasks = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: async () => {
      const response = await api.get('/tasks');
      
      // Check if response has the expected structure
      if (response.success && response.data) {
        return response.data; // Return the actual tasks array
      } else {
        console.error('Unexpected API response:', response);
        throw new Error(response.message || 'Failed to fetch tasks');
      }
    },
    enabled: isAuthenticated, // Only fetch tasks if user is authenticated
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error.message.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useTask = (id) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.task(id),
    queryFn: async () => {
      const response = await api.get(`/tasks/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch task');
      }
    },
    enabled: !!id && isAuthenticated,
    retry: (failureCount, error) => {
      if (error.message.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      const response = await api.post('/tasks', taskData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create task');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
    onError: (error) => {
      console.error('Create task error:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const response = await api.put(`/tasks/${id}`, updateData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update task');
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate specific task and tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.task(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/tasks/${id}`);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete task');
      }
    },
    onSuccess: () => {
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
};

// User-related hooks (if needed)
export const useUsers = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      const response = await api.get('/users');
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    },
    enabled: isAuthenticated,
  });
};

export const useUser = (id) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch user');
      }
    },
    enabled: !!id && isAuthenticated,
  });
};

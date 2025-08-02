import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';

// Query keys for better cache management
export const queryKeys = {
  tasks: ['tasks'],
  task: (id) => ['tasks', id],
  users: ['users'],
  user: (id) => ['users', id],
};

// Task-related hooks
export const useTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => api.get('/tasks'),
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: queryKeys.task(id),
    queryFn: () => api.get(`/tasks/${id}`),
    enabled: !!id, // Only run query if id is provided
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData) => api.post('/tasks', taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updateData }) => api.put(`/tasks/${id}`, updateData),
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
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
};

// User-related hooks (if needed)
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => api.get('/users'),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.get(`/users/${id}`),
    enabled: !!id,
  });
};

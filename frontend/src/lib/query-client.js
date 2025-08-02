import { QueryClient } from '@tanstack/react-query';

// Create a client with default configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that unused data remains in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: 1,
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});

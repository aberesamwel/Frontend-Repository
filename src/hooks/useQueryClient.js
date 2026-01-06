/**
 * React Query Configuration - Aggressive caching for performance
 * Prevents unnecessary re-fetching and provides instant cached responses
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Optimized query client for fast startup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Aggressive caching for performance
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      cacheTime: 30 * 60 * 1000, // 30 minutes - cache retention
      
      // Background updates without blocking UI
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Critical: don't refetch on component mount
      refetchOnReconnect: 'always',
      
      // Retry strategy
      retry: (failureCount, error) => {
        if (error?.status === 401) return false; // Don't retry auth errors
        return failureCount < 2;
      },
      
      // Use cached data while fetching updates
      keepPreviousData: true,
    },
    mutations: {
      // Optimistic updates for better UX
      onError: (error, variables, context) => {
        console.error('Mutation failed:', error);
      },
    },
  },
});

// Prefetch critical data on app start
export const prefetchCriticalData = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return;

  // Only prefetch absolutely critical data
  const criticalQueries = [
    { key: ['user-profile'], url: '/api/auth/user/' },
    { key: ['dashboard-stats'], url: '/api/analytics/dashboard/' },
  ];

  await Promise.allSettled(
    criticalQueries.map(({ key, url }) =>
      queryClient.prefetchQuery({
        queryKey: key,
        queryFn: () => fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()),
        staleTime: 10 * 60 * 1000, // 10 minutes for critical data
      })
    )
  );
};

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export { queryClient };
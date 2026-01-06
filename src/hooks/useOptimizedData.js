/**
 * Optimized Data Fetching - Smart caching and deferred loading
 * Critical vs non-critical data separation
 */
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/PersistentAuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Optimized fetch function with auth
const fetchWithAuth = async (url) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

// Critical data - loads immediately
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchWithAuth('/analytics/dashboard/'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: true, // Always enabled for critical data
  });
};

// Non-critical data - deferred loading
export const useServices = (enabled = false) => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => fetchWithAuth('/services/'),
    staleTime: 5 * 60 * 1000,
    enabled, // Only load when component is visible
  });
};

// Infinite scroll for large datasets
export const useInfiniteServices = () => {
  return useInfiniteQuery({
    queryKey: ['services-infinite'],
    queryFn: ({ pageParam = 1 }) => 
      fetchWithAuth(`/services/?page=${pageParam}&limit=20`),
    getNextPageParam: (lastPage) => 
      lastPage.next ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Materials with search debouncing
export const useMaterials = (search = '', enabled = true) => {
  return useQuery({
    queryKey: ['materials', search],
    queryFn: () => fetchWithAuth(`/materials/?search=${search}&limit=50`),
    staleTime: 10 * 60 * 1000, // Materials change less frequently
    enabled: enabled && search.length >= 0,
    keepPreviousData: true,
  });
};

// Background prefetch for next likely page
export const usePrefetchNextPage = (currentRoute) => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const prefetchMap = {
      '/': ['/metalworks', '/projects'],
      '/metalworks': ['/materials'],
      '/projects': ['/materials', '/tools'],
    };
    
    const nextPages = prefetchMap[currentRoute] || [];
    nextPages.forEach(route => {
      // Prefetch route component
      import(`../pages/${route.slice(1)}`).catch(() => {});
    });
  }, [currentRoute, isAuthenticated]);
};
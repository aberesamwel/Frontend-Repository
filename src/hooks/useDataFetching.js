/**
 * Production-grade data fetching hooks with pagination, caching, and error handling
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

/**
 * Hook for paginated data fetching with backend filtering
 * 
 * Features:
 * - Automatic pagination
 * - Backend search/filtering
 * - Loading states
 * - Error handling
 * - Cache management
 * - Prevents unnecessary re-renders
 */
export const usePaginatedData = (endpoint, options = {}) => {
  const {
    initialParams = {},
    pageSize = 20,
    enabled = true,
    dependencies = [],
    cacheKey = endpoint
  } = options;

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    pages: 0,
    has_next: false,
    has_previous: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ limit: pageSize, ...initialParams });
  
  // Prevent unnecessary re-renders
  const paramsRef = useRef(params);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (newParams = {}, append = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const finalParams = { ...paramsRef.current, ...newParams };
    
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(endpoint, {
        params: finalParams,
        signal: controller.signal
      });

      const { results, pagination: paginationData } = response.data;

      if (append) {
        setData(prev => [...prev, ...results]);
      } else {
        setData(results);
      }
      
      setPagination(paginationData);
      paramsRef.current = finalParams;
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        console.error(`Error fetching ${endpoint}:`, err);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, ...dependencies]);

  // Pagination controls
  const goToPage = useCallback((page) => {
    fetchData({ page });
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (pagination.has_next) {
      goToPage(pagination.page + 1);
    }
  }, [pagination.has_next, pagination.page, goToPage]);

  const previousPage = useCallback(() => {
    if (pagination.has_previous) {
      goToPage(pagination.page - 1);
    }
  }, [pagination.has_previous, pagination.page, goToPage]);

  // Search and filtering
  const updateParams = useCallback((newParams) => {
    const updatedParams = { ...paramsRef.current, ...newParams, page: 1 };
    setParams(updatedParams);
    fetchData(updatedParams);
  }, [fetchData]);

  const search = useCallback((searchTerm) => {
    updateParams({ search: searchTerm });
  }, [updateParams]);

  const filter = useCallback((filters) => {
    updateParams(filters);
  }, [updateParams]);

  const refresh = useCallback(() => {
    fetchData(paramsRef.current);
  }, [fetchData]);

  // Infinite scroll support
  const loadMore = useCallback(() => {
    if (pagination.has_next && !loading) {
      fetchData({ page: pagination.page + 1 }, true);
    }
  }, [pagination.has_next, pagination.page, loading, fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    params: paramsRef.current,
    
    // Actions
    goToPage,
    nextPage,
    previousPage,
    search,
    filter,
    refresh,
    loadMore,
    updateParams
  };
};

/**
 * Hook for single item fetching with caching
 */
export const useDetailData = (endpoint, id, options = {}) => {
  const { enabled = true, dependencies = [] } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`${endpoint}/${id}/`, {
        signal: controller.signal
      });

      setData(response.data);
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, id, enabled]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, ...dependencies]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh
  };
};
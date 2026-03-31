// Custom hooks for API operations
import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook for handling async API calls with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState(immediate ? 'pending' : 'idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  return { execute, status, data, error };
};

/**
 * Hook for fetching data from API
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url, options);
      setData(response.data?.data || response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

/**
 * Hook for handling form submissions
 */
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  }, [values, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    loading,
    handleChange,
    handleSubmit,
    reset
  };
};

/**
 * Hook for pagination
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage
  };
};

/**
 * Hook for handling API mutations (POST, PUT, DELETE)
 */
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Add React import for useEffect
import React from 'react';

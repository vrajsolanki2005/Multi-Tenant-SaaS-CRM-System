import { useState, useEffect, useCallback } from 'react';
import { PAGINATION } from '../constants';
import { PaginatedResponse } from '../types';

interface UsePaginationOptions<T> {
  fetchFn: (page: number, ...args: any[]) => Promise<{ data: PaginatedResponse<T> }>;
  initialPage?: number;
  limit?: number;
  dependencies?: any[];
}

interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reload: () => void;
}

export function usePagination<T>({
  fetchFn,
  initialPage = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
  dependencies = [],
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn(page, ...dependencies);
      const result = response.data;
      
      setData(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, fetchFn, ...dependencies]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage(p => p + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage(p => p - 1);
  }, [hasPrevPage]);

  return {
    data,
    loading,
    error,
    page,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage,
    nextPage,
    prevPage,
    reload: load,
  };
}

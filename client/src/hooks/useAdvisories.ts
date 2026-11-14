import { useState, useCallback } from 'react';
import { Advisory } from '../../../shared/types';
import { apiGet, apiPost } from '../lib/api';

export function useAdvisories() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisories = useCallback(async (params?: { page?: number; pageSize?: number; cropType?: string }) => {
    try {
      setLoading(true);
      setError(null);
      let query = `?page=${params?.page || 1}&pageSize=${params?.pageSize || 10}`;
      if (params?.cropType && params.cropType !== 'All') {
        query += `&cropType=${params.cropType}`;
      }
      const res = await apiGet<{ data: Advisory[] }>(`/advisories${query}`);
      if (res?.data) {
        setAdvisories(res.data);
      }
      return res;
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch advisories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdvisory = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiPost<{ data: Advisory }>('/advisories', formData);
      if (res?.data) {
        setAdvisories((prev) => [res.data, ...prev]);
      }
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Failed to create advisory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    advisories,
    loading,
    error,
    fetchAdvisories,
    createAdvisory,
  };
}

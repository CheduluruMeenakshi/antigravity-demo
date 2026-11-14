import { useState, useCallback } from 'react';
import { Field, CreateFieldInput } from '../../../shared/types';
import { apiGet, apiPost, apiDelete } from '../lib/api';

export function useFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet<{ data: Field[] }>('/fields');
      if (res?.data) {
        setFields(res.data);
      }
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch fields');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createField = useCallback(async (data: Partial<Field>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiPost<{ data: Field }>('/fields', data);
      if (res?.data) {
        setFields((prev) => [res.data, ...prev]);
      }
      return res?.data;
    } catch (err: any) {
      setError(err?.message || 'Failed to create field');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteField = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiDelete(`/fields/${id}`);
      setFields((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete field');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fields,
    loading,
    error,
    fetchFields,
    createField,
    deleteField,
  };
}

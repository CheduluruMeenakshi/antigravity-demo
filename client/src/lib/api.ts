import { supabase } from './supabase';

const API_BASE = '/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return {
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function apiPost<T>(
  path: string,
  body: FormData | Record<string, unknown>
): Promise<T> {
  const headers = await getAuthHeaders();
  const isFormData = body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: isFormData
      ? headers
      : { ...headers, 'Content-Type': 'application/json' },
    body: isFormData ? body : JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
}

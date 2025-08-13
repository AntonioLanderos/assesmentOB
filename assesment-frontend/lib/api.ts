export const API = process.env.NEXT_PUBLIC_API_URL;

export async function api<T = any>(
  path: string,
  opts: RequestInit = {},
  withAuth = true
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  const headers: Record<string, string> = { ...(opts.headers as any) };

  if (!headers['Content-Type'] && opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (withAuth && token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  // Si no hay cuerpo o es 204
  const ct = res.headers.get('content-type') || '';
  return (ct.includes('application/json') ? res.json() : (await res.text()) as any) as T;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('jwt', token);
}
export function getToken() {
  return (typeof window !== 'undefined') ? localStorage.getItem('jwt') : null;
}
export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('jwt');
}

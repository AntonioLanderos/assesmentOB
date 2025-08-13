'use client';
import { useEffect, useState } from 'react';
import { api } from './api';

export type Role = 'PATIENT'|'DOCTOR'|'ADMIN';
export type Me = { user: { id:number; email:string; role:Role; status:'free'|'active'|'past_due'|'canceled' } };

export function useMe() {
  const [me, setMe] = useState<Me['user']|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try { const data = await api<Me>('/auth/me'); setMe(data.user); }
      catch (e:any) { setErr(e.message || 'ERR'); }
      finally { setLoading(false); }
    })();
  }, []);

  return { me, loading, error };
}

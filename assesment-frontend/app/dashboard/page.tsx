'use client';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';

type Me = { user: { id:number; email:string; role:'PATIENT'|'DOCTOR'|'ADMIN'; status:'free'|'active'|'past_due'|'canceled'; current_period_end?: string|null } };

export default function Dashboard() {
  const [me, setMe] = useState<Me['user']| null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try { const r = await api<Me>('/auth/me'); setMe(r.user); }
    finally { setLoading(false); }
  })(); }, []);

  async function goPremium() {
    const { url } = await api<{url:string}>('/billing/checkout', { method: 'POST' });
    location.href = url;
  }

  if (loading) return <p>Cargando…</p>;
  if (!me) return <p>Sin sesión</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>Cuenta</CardHeader>
        <CardBody className="grid gap-2">
          <div><span className="text-slate-500">Email:</span> {me.email}</div>
          <div><span className="text-slate-500">Rol:</span> {me.role}</div>
          <div>
            <span className="text-slate-500">Plan:</span>{' '}
            <b className={me.status==='active' ? 'text-green-600' : me.status==='past_due' ? 'text-amber-600' : 'text-slate-900'}>
              {me.status}
            </b>
          </div>
          {me.status !== 'active' && (
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={goPremium}>Actualizar a Premium</Button>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Accesos rápidos</CardHeader>
        <CardBody className="flex gap-2 flex-wrap">
          <a className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" href="/files">Mis archivos</a>
          <a className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" href="/doctor">Doctor</a>
          <a className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" href="/admin">Admin</a>
        </CardBody>
      </Card>
    </div>
  );
}

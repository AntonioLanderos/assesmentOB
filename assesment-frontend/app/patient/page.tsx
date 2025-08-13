'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';

type MeResp = { user: { id:number; email:string; role:'PATIENT'|'DOCTOR'|'ADMIN'; status:'free'|'active'|'past_due'|'canceled' } };

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5"/></svg>);
}
function IconHistory(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M13 3a9 9 0 1 0 8.95 10h-2.02A7 7 0 1 1 13 5v4l3.5 2.1l1-1.64L14 8.5V3"/></svg>);
}
function IconFollow(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3t6.375 2.625T21 12t-2.625 6.375T12 21m0-2q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m-1-4.25l6.2-6.2l-1.4-1.4L11 12.95L8.2 10.2l-1.4 1.4z"/></svg>);
}
function IconReport(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8zM6 20V4h7v5h5v11zm2-2h2v-6H8zm4 0h2v-9h-2zm4 0h2v-4h-2z"/></svg>);
}
function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><path fill="currentColor" d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h8V8a4 4 0 1 0-8 0z"/></svg>);
}

export default function PatientPage() {
  const [me, setMe] = useState<MeResp['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const r = await api<MeResp>('/auth/me'); setMe(r.user); }
      finally { setLoading(false); }
    })();
  }, []);

  const isPremium = me?.status === 'active';

  if (loading) return <p>Cargando…</p>;
  if (!me) return <p>Sin sesión</p>;
  if (me.role !== 'PATIENT' && me.role !== 'ADMIN')
    return <p className="text-sm text-slate-600">Esta vista es para pacientes.</p>;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>Panel del paciente</CardHeader>
        <CardBody className="grid gap-4">
          <div className="text-sm text-slate-600">
            Plan: <b className={isPremium ? 'text-green-600' : 'text-slate-900'}>{me.status}</b>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button className="gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <IconUser className="h-4 w-4" />
              Perfil
            </Button>

            <Button className="gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <IconHistory className="h-4 w-4" />
              Historial básico
            </Button>

            <Button className="gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={!isPremium} title={!isPremium ? 'Requiere Premium' : undefined}>
              {!isPremium ? <IconLock className="h-4 w-4" /> : <IconFollow className="h-4 w-4" />}
              Seguimiento post-consulta
              <span className="ml-2 text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">Premium</span>
            </Button>

            <Button className="gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={!isPremium} title={!isPremium ? 'Requiere Premium' : undefined}>
              {!isPremium ? <IconLock className="h-4 w-4" /> : <IconReport className="h-4 w-4" />}
              Reportes
              <span className="ml-2 text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">Premium</span>
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            Las opciones Premium se habilitan automáticamente cuando tu suscripción está activa.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

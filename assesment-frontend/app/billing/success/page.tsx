'use client';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Success() {
  const [status, setStatus] = useState('checking');

  useEffect(()=>{
    let tries = 0;
    const id = setInterval(async ()=>{
      tries++;
      try {
        const { user } = await api<{user:{status:string}}>('/auth/me');
        if (user.status === 'active') {
          setStatus('active');
          clearInterval(id);
        } else if (tries > 15) {
          setStatus('timeout'); clearInterval(id);
        }
      } catch { /* ignore */ if (tries > 15) { setStatus('timeout'); clearInterval(id); } }
    }, 2000);
    return ()=> clearInterval(id);
  },[]);

  return (
    <main style={{padding:24}}>
      <h1>Pago recibido</h1>
      {status==='active' && <p>✅ Tu plan está activo. <Link href="/dashboard">Ir al dashboard</Link></p>}
      {status==='checking' && <p>Esperando confirmación del webhook…</p>}
      {status==='timeout' && <p>⏱️ Tardó demasiado. Actualiza o vuelve al <Link href="/dashboard">dashboard</Link>.</p>}
    </main>
  );
}

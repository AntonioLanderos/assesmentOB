'use client';
import { RequireAuth, RoleGate } from '@/components/guards';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function AdminPage() {
  const [doctorUserId, setD] = useState(''); const [patientUserId, setP] = useState('');
  async function assign() {
    await api('/admin/assign', { method:'POST', body: JSON.stringify({ doctorUserId: Number(doctorUserId), patientUserId: Number(patientUserId) }) });
    alert('Asignado');
  }
  return (
    <RequireAuth>
      <RoleGate allow={['ADMIN']}>
        <main style={{padding:24}}>
          <h1>Admin • Asignar doctor ↔ paciente</h1>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <input placeholder="doctorUserId" value={doctorUserId} onChange={e=>setD(e.target.value)} />
            <input placeholder="patientUserId" value={patientUserId} onChange={e=>setP(e.target.value)} />
            <button onClick={assign}>Asignar</button>
          </div>
        </main>
      </RoleGate>
    </RequireAuth>
  );
}

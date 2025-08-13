'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, setToken } from '@/lib/api';
import { Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) {
      setErr('Las contraseñas no coinciden');
      return;
    }
    setBusy(true);
    try {
      const data = await api<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, false);
      setToken(data.token);
      router.push('/dashboard');
    } catch (e: any) {
      setErr(e.message || 'Error al registrar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container grid place-items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>Crear cuenta</CardHeader>
        <CardBody>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <div className="label">Email</div>
              <Input
                type="email"
                placeholder="tú@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="label">Contraseña</div>
              <Input
                type="password"
                placeholder="Mín. 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="label">Confirmar contraseña</div>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            {err && <div className="text-sm text-red-600">{err}</div>}
            <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" type="submit" disabled={busy}>
              {busy ? 'Creando cuenta…' : 'Registrarme'}
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-4 text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-[--color-brand] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

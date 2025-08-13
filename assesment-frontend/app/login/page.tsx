'use client';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('pt@demo.com');
  const [password, setPassword] = useState('Demo123!');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const data = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, false);
      setToken(data.token);
      router.push('/dashboard');
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="container grid place-items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>Iniciar sesión</CardHeader>
        <CardBody>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <div className="label">Email</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tú@correo.com" />
            </div>
            <div>
              <div className="label">Contraseña</div>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {err && <div className="text-sm text-red-600">{err}</div>}
            <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" type="submit">Entrar</Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-4 text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-[--color-brand] hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}

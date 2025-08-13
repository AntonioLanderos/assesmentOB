'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    router.replace(t ? '/dashboard' : '/login');
  }, [router]);

  return <main style={{ padding: 24 }}>Redirigiendo…</main>;
}

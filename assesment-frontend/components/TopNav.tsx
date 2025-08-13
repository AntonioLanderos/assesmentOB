'use client';

import Link from 'next/link';

export default function TopNav() {
  const logout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  };

  return (
    <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
      <span className="font-semibold">🩺 Assesment</span>
      <Link href="/dashboard" className="text-sm hover:text-blue-600">Dashboard</Link>
      <Link href="/files" className="text-sm hover:text-blue-600">Files</Link>
      <Link href="/doctor" className="text-sm hover:text-blue-600">Doctor</Link>
      <Link href="/admin" className="text-sm hover:text-blue-600">Admin</Link>
      <Link href="/patient" className="text-sm hover:text-blue-600">Paciente</Link>
      <button
        type="button"
        onClick={logout}
        className="ml-auto text-sm text-slate-500 hover:text-slate-900 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Logout
      </button>
    </nav>
  );
}

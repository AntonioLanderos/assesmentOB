import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TopNav from '@/components/TopNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { title: 'MVP', description: 'Demo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <header className="border-b bg-white">
          <TopNav /> 
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t bg-white mt-12">
          <div className="mx-auto max-w-6xl px-4 h-12 flex items-center text-xs text-slate-500">
            © {new Date().getFullYear()} Assesment — Demo
          </div>
        </footer>
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { LayoutDashboard, BookOpen, Inbox, LogOut, Loader2 } from 'lucide-react';
import Logo from '@/components/ebia/Logo';
import { Button } from '@/components/ui/button';

const fetcher = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject(r));

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, error, isLoading } = useSWR('/api/admin/me', fetcher);

  useEffect(() => {
    if (!isLoading && (error || !data?.authenticated)) router.replace('/admin/login');
  }, [data, error, isLoading, router]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (isLoading || !data?.authenticated) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const nav = [
    { href: '/admin', label: 'Inicio', icon: LayoutDashboard },
    { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/admin/contactos', label: 'Contactos', icon: Inbox },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border"><Logo size="md" /></div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(n => {
            const Icon = n.icon;
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 truncate">{data.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}><LogOut className="h-3.5 w-3.5 mr-1.5" /> Salir</Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Logo size="sm" />
          <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-3.5 w-3.5" /></Button>
        </header>
        <nav className="md:hidden flex gap-1 p-2 bg-card border-b border-border overflow-x-auto">
          {nav.map(n => {
            const Icon = n.icon;
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-3.5 w-3.5" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

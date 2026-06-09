'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { BookOpen, Inbox, CheckCircle2, MailOpen, ArrowRight } from 'lucide-react';
import AdminShell from '@/components/ebia/AdminShell';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const fetcher = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject(r));

function Dashboard() {
  const { data: stats } = useSWR('/api/admin/stats', fetcher);
  const { data: contacts } = useSWR('/api/admin/contacts', fetcher);
  const recent = (contacts || []).slice(0, 5);

  const cards = [
    { label: 'Cursos totales', value: stats?.courses ?? '—', icon: BookOpen, color: 'from-indigo-500 to-violet-500' },
    { label: 'Cursos activos', value: stats?.activeCourses ?? '—', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
    { label: 'Contactos totales', value: stats?.contacts ?? '—', icon: Inbox, color: 'from-amber-500 to-orange-500' },
    { label: 'Sin leer', value: stats?.unread ?? '—', icon: MailOpen, color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <AdminShell>
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl">
        <h1 className="text-3xl font-extrabold mb-2">Hola de nuevo 👋</h1>
        <p className="text-muted-foreground mb-8">Aquí tienes un resumen rápido de tu plataforma EBIA.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="bg-card border border-border rounded-2xl p-5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold">{c.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Gestión rápida</h2>
            </div>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-between"><Link href="/admin/cursos">Gestionar cursos <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="w-full justify-between"><Link href="/admin/contactos">Ver contactos <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="w-full justify-between"><Link href="/" target="_blank">Ver sitio público <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Últimos mensajes</h2>
              <Button asChild variant="ghost" size="sm"><Link href="/admin/contactos">Ver todos</Link></Button>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay mensajes.</p>
            ) : (
              <ul className="space-y-3">
                {recent.map(c => (
                  <li key={c.id} className="flex items-start justify-between gap-2 pb-3 border-b border-border last:border-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.message}</p>
                    </div>
                    {c.status === 'unread' && <span className="flex-shrink-0 text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Nuevo</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
export default Dashboard;

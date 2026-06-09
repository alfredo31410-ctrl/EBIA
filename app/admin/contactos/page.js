'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { Mail, Phone, Trash2, Check, MailOpen, Loader2 } from 'lucide-react';
import AdminShell from '@/components/ebia/AdminShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const fetcher = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject(r));
const KEY = '/api/admin/contacts';

function ContactosAdmin() {
  const { data, isLoading } = useSWR(KEY, fetcher);
  const list = Array.isArray(data) ? data : [];
  const [filter, setFilter] = useState('all');

  const filtered = list.filter(c => filter === 'all' || c.status === filter);

  const markRead = async (c) => {
    const newStatus = c.status === 'read' ? 'unread' : 'read';
    const res = await fetch(`${KEY}/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    if (res.ok) { mutate(KEY); toast.success(newStatus === 'read' ? 'Marcado como leído' : 'Marcado sin leer'); }
  };
  const remove = async (c) => {
    if (!confirm(`¿Eliminar mensaje de ${c.name}?`)) return;
    const res = await fetch(`${KEY}/${c.id}`, { method: 'DELETE' });
    if (res.ok) { mutate(KEY); toast.success('Mensaje eliminado'); }
  };

  return (
    <AdminShell>
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold mb-2">Contactos</h1>
        <p className="text-muted-foreground text-sm mb-6">{list.length} mensaje(s) recibidos</p>

        <div className="flex gap-2 mb-5">
          {[{v: 'all', l: 'Todos'}, {v: 'unread', l: 'Sin leer'}, {v: 'read', l: 'Leídos'}].map(t => (
            <button key={t.v} onClick={() => setFilter(t.v)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === t.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
              {t.l}
            </button>
          ))}
        </div>

        {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : (
          <div className="space-y-3">
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">No hay mensajes</div>}
            {filtered.map(c => (
              <div key={c.id} className={`bg-card border rounded-2xl p-5 ${c.status === 'unread' ? 'border-primary/30 shadow-sm' : 'border-border'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{c.name}</h3>
                      {c.status === 'unread' && <Badge className="bg-rose-100 text-rose-700 border-0">Nuevo</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> {c.email}</a>
                      {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> {c.phone}</a>}
                      <span>{new Date(c.created_at).toLocaleString('es-MX')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => markRead(c)} title={c.status === 'read' ? 'Marcar sin leer' : 'Marcar leído'}>
                      {c.status === 'read' ? <MailOpen className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(c)} className="text-rose-600 hover:text-rose-700"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
export default ContactosAdmin;

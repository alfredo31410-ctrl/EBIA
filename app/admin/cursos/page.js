'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Loader2, Search } from 'lucide-react';
import AdminShell from '@/components/ebia/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { CATEGORIES, LEVELS, getCategoryLabel, getLevelLabel } from '@/lib/ebia/constants';

const fetcher = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject(r));
const KEY = '/api/admin/courses';

function emptyCourse() {
  return {
    title: '', slug: '', category: 'ia', level: 'principiante',
    short_description: '', full_description: '', image_url: '',
    price: '', whatsapp_url: '', is_active: true, featured: false,
    promise: '', learn: '', audience: '', benefits: '',
    syllabus_text: '', faqs_text: '',
  };
}

function parseLines(s) { return (s || '').split('\n').map(x => x.trim()).filter(Boolean); }
function parseSyllabus(s) {
  const blocks = (s || '').split(/\n\s*\n/).filter(Boolean);
  return blocks.map(b => {
    const lines = b.split('\n').map(l => l.trim()).filter(Boolean);
    return { title: lines[0] || '', items: lines.slice(1) };
  });
}
function parseFaqs(s) {
  const blocks = (s || '').split(/\n\s*\n/).filter(Boolean);
  return blocks.map(b => {
    const lines = b.split('\n').map(l => l.trim()).filter(Boolean);
    return { q: lines[0] || '', a: lines.slice(1).join(' ') };
  });
}
function syllabusToText(arr) { return (arr || []).map(m => [m.title, ...(m.items || [])].join('\n')).join('\n\n'); }
function faqsToText(arr) { return (arr || []).map(f => [f.q, f.a].join('\n')).join('\n\n'); }

function CursosAdmin() {
  const { data, isLoading } = useSWR(KEY, fetcher);
  const list = Array.isArray(data) ? data : [];
  const [search, setSearch] = useState('');
  const filtered = list.filter(c => !search || c.title?.toLowerCase().includes(search.toLowerCase()));

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCourse());
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(emptyCourse()); setOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      title: c.title || '', slug: c.slug || '', category: c.category || 'ia', level: c.level || 'principiante',
      short_description: c.short_description || '', full_description: c.full_description || '', image_url: c.image_url || '',
      price: c.price ?? '', whatsapp_url: c.whatsapp_url || '', is_active: c.is_active !== false, featured: !!c.featured,
      promise: c.promise || '',
      learn: (c.learn || []).join('\n'),
      audience: (c.audience || []).join('\n'),
      benefits: (c.benefits || []).join('\n'),
      syllabus_text: syllabusToText(c.syllabus),
      faqs_text: faqsToText(c.faqs),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title) { toast.error('El título es obligatorio'); return; }
    setSaving(true);
    const payload = {
      title: form.title, slug: form.slug, category: form.category, level: form.level,
      short_description: form.short_description, full_description: form.full_description,
      image_url: form.image_url, price: form.price === '' ? null : Number(form.price),
      whatsapp_url: form.whatsapp_url, is_active: form.is_active, featured: form.featured,
      promise: form.promise,
      learn: parseLines(form.learn), audience: parseLines(form.audience), benefits: parseLines(form.benefits),
      syllabus: parseSyllabus(form.syllabus_text), faqs: parseFaqs(form.faqs_text),
    };
    try {
      const res = await fetch(editing ? `${KEY}/${editing.id}` : KEY, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? 'Curso actualizado' : 'Curso creado');
      setOpen(false);
      mutate(KEY);
    } catch { toast.error('No se pudo guardar'); }
    finally { setSaving(false); }
  };

  const remove = async (c) => {
    if (!confirm(`¿Eliminar "${c.title}"?`)) return;
    const res = await fetch(`${KEY}/${c.id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Curso eliminado'); mutate(KEY); }
    else toast.error('No se pudo eliminar');
  };

  const toggleActive = async (c) => {
    const res = await fetch(`${KEY}/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !c.is_active }) });
    if (res.ok) { mutate(KEY); toast.success(c.is_active ? 'Desactivado' : 'Activado'); }
  };
  const toggleFeatured = async (c) => {
    const res = await fetch(`${KEY}/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: !c.featured }) });
    if (res.ok) { mutate(KEY); }
  };

  return (
    <AdminShell>
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Cursos</h1>
            <p className="text-muted-foreground text-sm">{list.length} cursos en total</p>
          </div>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-1.5" /> Nuevo curso</Button>
        </div>

        <div className="relative max-w-md mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cursos…" className="pl-9 h-10" />
        </div>

        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {filtered.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">No hay cursos. Crea el primero.</div>
              )}
              {filtered.map(c => (
                <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  <div className="h-16 w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {c.image_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.image_url} alt={c.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{c.title}</h3>
                      {!c.is_active && <Badge variant="outline" className="text-muted-foreground">Inactivo</Badge>}
                      {c.featured && <Badge className="bg-amber-100 text-amber-800 border-0"><Star className="h-3 w-3 mr-1" fill="currentColor" /> Destacado</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                      <span>{getCategoryLabel(c.category)}</span>
                      <span>{getLevelLabel(c.level)}</span>
                      {c.price && <span>${c.price} MXN</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(c)} title={c.is_active ? 'Desactivar' : 'Activar'}>
                      {c.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleFeatured(c)} title="Destacar">
                      <Star className={`h-4 w-4 ${c.featured ? 'text-amber-500 fill-amber-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(c)} className="text-rose-600 hover:text-rose-700"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar curso' : 'Nuevo curso'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Título *</Label>
                  <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="mt-1.5" />
                </div>
                <div>
                  <Label>Slug (opcional)</Label>
                  <Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className="mt-1.5" placeholder="se-genera-automaticamente" />
                </div>
                <div>
                  <Label>Imagen (URL)</Label>
                  <Input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} className="mt-1.5" placeholder="https://..." />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nivel</Label>
                  <Select value={form.level} onValueChange={(v) => setForm({...form, level: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Precio (MXN)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="mt-1.5" />
                </div>
                <div>
                  <Label>URL de WhatsApp personalizada (opcional)</Label>
                  <Input value={form.whatsapp_url} onChange={(e) => setForm({...form, whatsapp_url: e.target.value})} className="mt-1.5" placeholder="https://wa.me/..." />
                </div>
              </div>

              <div>
                <Label>Descripción corta</Label>
                <Textarea rows={2} value={form.short_description} onChange={(e) => setForm({...form, short_description: e.target.value})} className="mt-1.5" />
              </div>
              <div>
                <Label>Promesa del curso</Label>
                <Input value={form.promise} onChange={(e) => setForm({...form, promise: e.target.value})} className="mt-1.5" />
              </div>
              <div>
                <Label>Descripción completa</Label>
                <Textarea rows={4} value={form.full_description} onChange={(e) => setForm({...form, full_description: e.target.value})} className="mt-1.5" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Lo que aprenderán (una línea por punto)</Label>
                  <Textarea rows={4} value={form.learn} onChange={(e) => setForm({...form, learn: e.target.value})} className="mt-1.5" />
                </div>
                <div>
                  <Label>Para quién es (una línea por punto)</Label>
                  <Textarea rows={4} value={form.audience} onChange={(e) => setForm({...form, audience: e.target.value})} className="mt-1.5" />
                </div>
                <div className="md:col-span-2">
                  <Label>Beneficios (una línea por beneficio)</Label>
                  <Textarea rows={3} value={form.benefits} onChange={(e) => setForm({...form, benefits: e.target.value})} className="mt-1.5" />
                </div>
                <div className="md:col-span-2">
                  <Label>Temario (Módulo en primera línea, items debajo; separa módulos con línea en blanco)</Label>
                  <Textarea rows={6} value={form.syllabus_text} onChange={(e) => setForm({...form, syllabus_text: e.target.value})} className="mt-1.5 font-mono text-xs" placeholder={'Módulo 1\nIntroducción\nConceptos\n\nMódulo 2\nPráctica'} />
                </div>
                <div className="md:col-span-2">
                  <Label>FAQs (Pregunta en una línea, respuesta debajo; separa con línea en blanco)</Label>
                  <Textarea rows={5} value={form.faqs_text} onChange={(e) => setForm({...form, faqs_text: e.target.value})} className="mt-1.5 font-mono text-xs" placeholder={'¿Necesito experiencia?\nNo, empezamos desde cero.\n\n¿Cuánto dura?\n4 semanas.'} />
                </div>
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm({...form, is_active: v})} />
                  <Label>Activo (visible al público)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={(v) => setForm({...form, featured: v})} />
                  <Label>Destacado</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />} Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminShell>
  );
}
export default CursosAdmin;

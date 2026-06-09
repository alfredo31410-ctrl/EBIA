'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/ebia/Navbar';
import Footer from '@/components/ebia/Footer';
import CourseCard from '@/components/ebia/CourseCard';
import WhatsappButton from '@/components/ebia/WhatsappButton';
import { CATEGORIES } from '@/lib/ebia/constants';

const fetcher = (url) => fetch(url).then(r => r.json());

function CursosPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useSWR('/api/courses', fetcher);
  const all = Array.isArray(data) ? data : [];
  const filtered = all
    .filter(c => category === 'all' || c.category === category)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.short_description?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="gradient-mesh border-b border-border">
        <div className="container py-16 md:py-20">
          <Badge variant="outline" className="mb-4">Catálogo</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-balance">Nuestros cursos</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Elige tu camino: IA, Excel o herramientas digitales. Todos los cursos están pensados para empezar desde cero, paso a paso.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar curso…"
                className="pl-9 h-11"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${category === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}
              >Todos</button>
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${category === c.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}
                >{c.emoji} {c.label}</button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No encontramos cursos con ese filtro. Prueba con otro.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsappButton floating />
    </div>
  );
}

export default CursosPage;

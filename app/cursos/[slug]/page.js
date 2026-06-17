'use client';

import { use } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Check, MessageCircle, Sparkles, Users, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/ebia/Navbar';
import Footer from '@/components/ebia/Footer';
import WhatsappButton from '@/components/ebia/WhatsappButton';
import { getCategoryLabel, getLevelLabel, whatsappLink } from '@/lib/ebia/constants';

const fetcher = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject(r));

function CursoDetail({ params }) {
  const resolved = typeof params?.then === 'function' ? use(params) : params;
  const slug = resolved.slug;
  const { data: course, error, isLoading } = useSWR(`/api/courses/slug/${slug}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20">
          <div className="h-96 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }
  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-20 text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">Curso no encontrado</h1>
          <Button asChild><Link href="/cursos">Volver a cursos</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const waMsg = `Hola EBIA, me interesa el curso "${course.title}". ¿Pueden darme más información?`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-mesh border-b border-border">
        <div className="container py-12 md:py-16">
          <Link href="/cursos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Todos los cursos
          </Link>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-0">{getCategoryLabel(course.category)}</Badge>
                <Badge variant="outline">{getLevelLabel(course.level)}</Badge>
                {course.featured && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0"><Sparkles className="h-3 w-3 mr-1" /> Destacado</Badge>}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-balance">{course.title}</h1>
              {course.promise && (
                <p className="mt-5 text-xl text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Promesa: </span>{course.promise}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {course.price && (
                  <div>
                    <div className="text-4xl font-extrabold">${course.price} <span className="text-base font-medium text-muted-foreground">MXN</span></div>
                    <p className="text-sm text-muted-foreground">Pago único · acceso de por vida</p>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button asChild size="lg" className="h-12 px-6 bg-[#25D366] hover:bg-[#1ebe5b] text-white">
                    <a href="/acceso-gratis">
                      <MessageCircle className="h-4 w-4 mr-2" fill="currentColor" /> Inscribirme
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 px-6">
                    <Link href="/contacto">Más información</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              {course.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.image_url} alt={course.title} className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover" />
              ) : (
                <div className="relative rounded-3xl shadow-2xl w-full h-[400px] bg-muted grid-pattern" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {course.full_description && (
              <div>
                <h2 className="text-2xl font-extrabold mb-4">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{course.full_description}</p>
              </div>
            )}

            {course.learn?.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Lo que aprenderás</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {course.learn.map((it, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><Check className="h-3 w-3" /></div>
                      <span className="text-sm leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.audience?.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Para quién es</h2>
                <ul className="space-y-2">
                  {course.audience.map((it, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Heart className="h-4 w-4 text-rose-500 mt-1 flex-shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.syllabus?.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold mb-4">Temario</h2>
                <div className="space-y-3">
                  {course.syllabus.map((m, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5">
                      <h3 className="font-bold mb-2">{m.title}</h3>
                      <ul className="space-y-1.5">
                        {(m.items || []).map((it, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span> {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.faqs?.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold mb-4">Preguntas frecuentes</h2>
                <Accordion type="single" collapsible className="w-full">
                  {course.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            {course.benefits?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold mb-4">Beneficios incluidos</h3>
                <ul className="space-y-2.5">
                  {course.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
              <h3 className="font-bold text-lg mb-2">¿Tienes dudas?</h3>
              <p className="text-sm text-white/85 mb-4">Escríbenos a WhatsApp y te respondemos personalmente.</p>
              <Button asChild className="w-full bg-white text-primary hover:bg-white/90">
                <a href={course.whatsapp_url || whatsappLink(waMsg)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" fill="currentColor" /> Hablar por WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
      <WhatsappButton message={waMsg} floating />
    </div>
  );
}

export default CursoDetail;

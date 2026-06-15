'use client';

import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Wrench,
  Check,
  Heart,
  ShieldCheck,
  Clock,
  Users,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/ebia/Navbar';
import Footer from '@/components/ebia/Footer';
import CourseCard from '@/components/ebia/CourseCard';
import WhatsappButton from '@/components/ebia/WhatsappButton';

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error al cargar la información');
  }

  return response.json();
};

const pillars = [
  {
    icon: Sparkles,
    title: 'Inteligencia Artificial desde cero',
    desc: 'Aprende a usar ChatGPT, Gemini y otras IAs de forma práctica.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: BarChart3,
    title: 'Excel práctico',
    desc: 'Fórmulas, tablas y dashboards que de verdad usan en el trabajo.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Wrench,
    title: 'Herramientas digitales',
    desc: 'Apps para estudiar, trabajar y organizarte sin complicarte.',
    color: 'from-amber-500 to-orange-500',
  },
];

const audiences = [
  'Personas que sienten que la tecnología las dejó atrás',
  'Profesionales que quieren actualizarse sin complicaciones',
  'Adultos que prefieren aprender paso a paso, con paciencia',
  'Estudiantes y emprendedores que quieren ganar tiempo',
  'Quienes ya intentaron antes y se frustraron con los tecnicismos',
  'Cualquier persona curiosa que quiere usar la tecnología a su favor',
];

const trust = [
  {
    icon: Heart,
    title: 'Trato cercano',
    desc: 'Te acompañamos paso a paso, sin juicios ni prisa.',
  },
  {
    icon: ShieldCheck,
    title: 'Sin tecnicismos',
    desc: 'Explicamos todo en palabras claras y simples.',
  },
  {
    icon: Clock,
    title: 'A tu ritmo',
    desc: 'Aprende cuando puedas, las clases quedan grabadas.',
  },
  {
    icon: Users,
    title: 'Comunidad cálida',
    desc: 'Pregunta, comparte y aprende con otras personas como tú.',
  },
];

function Home() {
  const {
    data,
    error,
    isLoading,
  } = useSWR('/api/courses?featured=1', fetcher);

  const courses = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.courses)
        ? data.courses
        : Array.isArray(data?.items)
          ? data.items
          : [];

  const featured = courses.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden gradient-mesh">
        <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

        <div className="container relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/15 border-0 px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3 w-3 mr-1.5" />
                Aprende tecnología desde cero
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
                Deja de sentirte atrasado.{' '}
                <span className="gradient-text">Usa IA, Excel y tecnología</span>{' '}
                a tu favor.
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                EBIA es la escuela digital para personas que quieren aprender
                Inteligencia Artificial, Excel y herramientas tecnológicas{' '}
                <strong className="text-foreground">paso a paso</strong>, sin
                tecnicismos y con ejemplos prácticos.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-6 text-base bg-primary hover:bg-primary/90"
                >
                  <Link href="/cursos">
                    Ver cursos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                >
                  <Link href="/contacto">Quiero más información</Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full ring-2 ring-background bg-gradient-to-br ${
                        i === 1
                          ? 'from-indigo-400 to-violet-500'
                          : i === 2
                            ? 'from-amber-400 to-orange-500'
                            : i === 3
                              ? 'from-emerald-400 to-teal-500'
                              : 'from-rose-400 to-pink-500'
                      }`}
                    />
                  ))}
                </div>

                <span>Cientos de personas ya empezaron su camino.</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24"
                alt="Persona aprendiendo con laptop"
                className="relative rounded-3xl shadow-2xl w-full h-[460px] object-cover"
              />

              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl shadow-xl p-4 max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Aprende</p>
                    <p className="font-bold text-sm">A tu ritmo</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl shadow-xl p-4 max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Sin tecnicismos</p>
                    <p className="font-bold text-sm">Paso a paso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="py-20 lg:py-24">
        <div className="container max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-4 text-rose-600 border-rose-200 bg-rose-50"
          >
            El problema
          </Badge>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-balance">
            ¿Sientes que la tecnología te está dejando atrás?
          </h2>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            No estás solo. Cada día aparecen nuevas herramientas, IAs y formas de
            trabajar. Es fácil sentirse abrumado, perdido o creer que{' '}
            <em>“esto no es para mí”</em>. Los cursos técnicos están llenos de
            palabras complicadas y nadie te explica desde el principio.
          </p>
        </div>
      </section>

      {/* SOLUCION */}
      <section className="py-20 lg:py-24 bg-muted/40">
        <div className="container max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
              La solución
            </Badge>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-balance">
              Una ruta clara, práctica y cálida para aprender de verdad
            </h2>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              En EBIA aprendes paso a paso, con ejemplos reales y sin sentirte
              tonto en el camino.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Empezamos desde cero',
                desc: 'No damos nada por sabido. Te explicamos cada concepto con calma.',
              },
              {
                num: '02',
                title: 'Aprendes practicando',
                desc: 'Cada lección viene con ejercicios reales que vas a poder aplicar.',
              },
              {
                num: '03',
                title: 'Avanzas a tu ritmo',
                desc: 'Repite cuando quieras, pregunta cuando lo necesites.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition"
              >
                <div className="text-5xl font-extrabold gradient-text mb-3">
                  {step.num}
                </div>

                <h3 className="font-bold text-lg mb-2">{step.title}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="py-20 lg:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">
              Nuestros pilares
            </Badge>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-balance">
              Tres mundos, una sola escuela
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="relative group bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all"
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mb-5 shadow-lg`}
                >
                  <p.icon className="h-6 w-6" />
                </div>

                <h3 className="font-bold text-xl mb-2">{p.title}</h3>

                <p className="text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURSOS DESTACADOS */}
      <section className="py-20 lg:py-24 bg-muted/40">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="outline" className="mb-3">
                <BookOpen className="h-3 w-3 mr-1" />
                Cursos destacados
              </Badge>

              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Empieza por uno
              </h2>

              <p className="mt-3 text-muted-foreground">
                Cursos pensados para personas que empiezan desde cero.
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href="/cursos">
                Ver todos los cursos <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              No se pudieron cargar los cursos destacados. Revisa la conexión
              con la API.
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
              Todavía no hay cursos destacados disponibles.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((c) => (
                <CourseCard key={c.id || c._id || c.slug} course={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PARA QUIEN */}
      <section className="py-20 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Para quién es EBIA
              </Badge>

              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6 text-balance">
                EBIA es para ti si…
              </h2>

              <ul className="space-y-3">
                {audiences.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-foreground leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/40 to-primary/20 rounded-3xl blur-2xl" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/6238120/pexels-photo-6238120.jpeg"
                alt="Personas aprendiendo juntas"
                className="relative rounded-3xl shadow-2xl w-full h-[480px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="py-20 lg:py-24 bg-muted/40">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">
              Por qué EBIA
            </Badge>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-balance">
              Un lugar donde de verdad puedes aprender
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trust.map((t) => (
              <div
                key={t.title}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <t.icon className="h-6 w-6" />
                </div>

                <h3 className="font-bold mb-2">{t.title}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 lg:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500 p-10 md:p-16 text-white">
            <div className="absolute inset-0 grid-pattern opacity-30" />

            <div className="relative max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-balance">
                Hoy es el día en que dejas de sentirte atrasado.
              </h2>

              <p className="mt-5 text-lg text-white/90 max-w-2xl">
                Empieza con nosotros. Te acompañamos paso a paso para que uses
                la tecnología con confianza.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-6 text-base bg-white text-primary hover:bg-white/90"
                >
                  <Link href="/cursos">
                    Ver cursos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contacto">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Quiero más información
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappButton floating />
    </div>
  );
}

function App() {
  return <Home />;
}

export default App;
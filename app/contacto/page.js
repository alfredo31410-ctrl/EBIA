'use client';

import { useState } from 'react';
import { MessageCircle, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/ebia/Navbar';
import Footer from '@/components/ebia/Footer';
import WhatsappButton from '@/components/ebia/WhatsappButton';
import { whatsappLink } from '@/lib/ebia/constants';

const faqs = [
  { q: '¿Necesito experiencia previa?', a: 'No. Todos nuestros cursos empiezan desde cero, sin tecnicismos.' },
  { q: '¿Cómo se imparten las clases?', a: 'Son grabadas, accesibles las 24 horas. Avanzas a tu ritmo.' },
  { q: '¿Hay algún certificado?', a: 'Sí, al terminar el curso recibes un certificado digital.' },
  { q: '¿Puedo pagar en efectivo o transferencia?', a: 'Sí, escríbenos por WhatsApp y vemos juntos la mejor opción.' },
  { q: '¿Qué pasa si no me gusta el curso?', a: 'Tienes 7 días para probarlo. Si no es para ti, te devolvemos tu dinero.' },
];

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Por favor completa los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setSent(true);
      toast.success('¡Mensaje enviado! Te respondemos pronto.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error('No pudimos enviar tu mensaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-center" richColors />

      <section className="gradient-mesh border-b border-border">
        <div className="container py-16 md:py-20 text-center max-w-3xl">
          <Badge variant="outline" className="mb-4">Contacto</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-balance">Hablemos. Estamos para ayudarte.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Cuéntanos qué quieres aprender o qué dudas tienes. Te respondemos con calma y claridad.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              {sent ? (
                <div className="text-center py-10">
                  <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-2">¡Mensaje recibido!</h2>
                  <p className="text-muted-foreground mb-6">Te responderemos muy pronto al correo o teléfono que nos compartiste.</p>
                  <Button onClick={() => setSent(false)} variant="outline">Enviar otro mensaje</Button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <h2 className="text-2xl font-extrabold">Cuéntanos</h2>
                  <p className="text-muted-foreground text-sm -mt-2">Respondemos en menos de 24 horas.</p>
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input id="name" value={form.name} onChange={update('name')} placeholder="Tu nombre" className="mt-1.5 h-11" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Correo *</Label>
                      <Input id="email" type="email" value={form.email} onChange={update('email')} placeholder="tu@correo.com" className="mt-1.5 h-11" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" value={form.phone} onChange={update('phone')} placeholder="Opcional" className="mt-1.5 h-11" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea id="message" rows={5} value={form.message} onChange={update('message')} placeholder="¿Qué quieres aprender o sobre qué quieres preguntar?" className="mt-1.5" />
                  </div>
                  <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto h-12 px-8">
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando…</> : 'Enviar mensaje'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <MessageCircle className="h-8 w-8 mb-3" fill="currentColor" />
              <h3 className="font-bold text-lg mb-1">WhatsApp directo</h3>
              <p className="text-sm text-white/90 mb-4">La forma más rápida y cálida de hablar con nosotros.</p>
              <Button asChild className="w-full bg-white text-emerald-700 hover:bg-white/90">
                <a href={whatsappLink()} target="_blank" rel="noreferrer">Escribir por WhatsApp</a>
              </Button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4">Otras formas</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hola@ebia.com</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Resp. en 24h</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-extrabold text-center mb-8">Dudas frecuentes</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
      <WhatsappButton floating />
    </div>
  );
}

export default ContactPage;

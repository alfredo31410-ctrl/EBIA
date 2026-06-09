import Link from 'next/link';
import Logo from './Logo';
import { Mail, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/ebia/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-24">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              EBIA es la escuela digital para aprender IA, Excel y herramientas tecnológicas desde cero. Paso a paso, sin tecnicismos, con ejemplos prácticos.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Explora</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
              <li><Link href="/cursos" className="hover:text-primary">Cursos</Link></li>
              <li><Link href="/contacto" className="hover:text-primary">Contacto</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Contáctanos</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
              <li><a href="mailto:hola@ebia.com" className="inline-flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" /> hola@ebia.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} EBIA · Aprende tecnología desde cero.</p>
          <p>Hecho con cariño para quienes empiezan.</p>
        </div>
      </div>
    </footer>
  );
}

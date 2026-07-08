import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import LeadTracker from '@/components/ebia/LeadTracker';
import TrackedAnchor from '@/components/ebia/TrackedAnchor';
import { whatsappLink } from '@/lib/ebia/constants';
import styles from './page.module.css';

const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ||
  whatsappLink(
    'Hola EBIA, ya complete mi registro para IA desde cero. Quiero unirme al grupo y recibir el acceso.'
  );

export const metadata = {
  title: 'Registro IA desde cero completado | EBIA',
  description:
    'Pagina de gracias para la clase gratis de IA desde cero de EBIA.',
};

export default function GraciasIaDesdeCeroPage() {
  return (
    <main className={styles.page}>
      <LeadTracker contentName="IA desde cero thank you page" />
      <div className={styles.backdrop} />

      <section className={styles.shell}>
        <Link href="/" className={styles.logo} aria-label="Volver a EBIA">
          <span>e</span>
          <strong>EBIA</strong>
        </Link>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Registro IA desde cero</p>
            <h1>
              Tu registro <span>esta casi</span> completo
            </h1>
            <p className={styles.subtitle}>
              Ultimo paso obligatorio: unete al grupo de WhatsApp para recibir
              el acceso, avisos e instrucciones de la clase.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Sparkles className={styles.sparkle} />
              <span>Falta poco</span>
            </div>

            <div className={styles.progressBox}>
              <div className={styles.progressLabel}>
                <strong>Proceso de registro</strong>
                <span>80%</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
              </div>
            </div>

            <h2>Ya casi terminas el proceso.</h2>
            <p>
              Para completar tu registro, entra al WhatsApp de EBIA. Ahi
              recibiras instrucciones, recordatorios y el acceso cuando este
              disponible.
            </p>

            <TrackedAnchor
              eventName="WhatsAppClick"
              eventParams={{ content_name: 'IA desde cero thank you WhatsApp link' }}
              className={styles.whatsappButton}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle fill="currentColor" />
              Unirme al grupo
            </TrackedAnchor>
          </div>

          <div className={styles.visual}>
            <img
              src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=1200&q=85"
              alt="Persona usando una laptop para aprender tecnologia"
            />
            <div className={styles.visualBadge}>
              <CheckCircle2 />
              <span>Registro guardado en EBIA</span>
            </div>
          </div>
        </div>

        <Link href="/ia-desde-cero" className={styles.backLink}>
          <ArrowLeft />
          Volver a la clase
        </Link>
      </section>
    </main>
  );
}

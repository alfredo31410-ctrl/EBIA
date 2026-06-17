import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { whatsappLink } from '@/lib/ebia/constants';
import styles from './page.module.css';

const whatsappUrl = whatsappLink(
  'Hola EBIA, ya vi la pagina de registro. Quiero unirme al grupo y recibir el acceso.'
);

export const metadata = {
  title: 'Registro casi completo | EBIA',
  description:
    'Pagina de gracias de EBIA para completar el registro por WhatsApp y recibir acceso al curso.',
};

export default function GraciasLanding() {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} />

      <section className={styles.shell}>
        <Link href="/" className={styles.logo} aria-label="Volver a EBIA">
          <span>e</span>
          <strong>EBIA</strong>
        </Link>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Registro EBIA</p>
            <h1>
              Tu registro <span>esta casi</span> completo
            </h1>
            <p className={styles.subtitle}>
              Ultimo paso obligatorio: unete al grupo de WhatsApp para recibir
              el acceso, avisos e instrucciones del curso.
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
              recibiras las instrucciones, recordatorios y el acceso cuando este
              disponible.
            </p>

            <a className={styles.whatsappButton} href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle fill="currentColor" />
              Unirme al grupo
            </a>
          </div>

          <div className={styles.visual}>
            <img
              src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=1200&q=85"
              alt="Persona usando una laptop para aprender tecnologia"
            />
            <div className={styles.visualBadge}>
              <CheckCircle2 />
              <span>Acceso guiado por EBIA</span>
            </div>
          </div>
        </div>

        <Link href="/cursos" className={styles.backLink}>
          <ArrowLeft />
          Volver a cursos
        </Link>
      </section>
    </main>
  );
}

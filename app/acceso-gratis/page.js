import Link from 'next/link';
import { ArrowRight, BrainCircuit, CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';
import styles from './page.module.css';

const highlights = ['Prompts practicos', 'Reportes con IA', 'Automatizacion simple'];

export const metadata = {
  title: 'Acceso gratis | EBIA',
  description:
    'Landing intermedia de EBIA para registrar el acceso gratuito antes de entrar a la pagina de gracias.',
};

export default function AccesoGratisPage() {
  return (
    <main className={styles.page}>
      <div className={styles.scan} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <section className={styles.hero}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            <span>e</span>
            <strong>EBIA</strong>
          </Link>
          <p>Estudios digitales, innovacion y negocios</p>
        </header>

        <div className={styles.content}>
          <div className={styles.copy}>
            <div className={styles.badge}>
              <Sparkles />
              Clase gratuita en vivo
            </div>

            <h1>
              ABC de <span>Inteligencia Artificial</span> para empezar desde cero
            </h1>

            <p className={styles.description}>
              Aprende a usar herramientas de inteligencia artificial para crear
              ideas, organizar informacion, trabajar mas rapido y ganar confianza
              con tecnologia.
            </p>

            <div className={styles.actions}>
              <Link href="/landings/gracias" className={styles.primaryButton}>
                Quiero mi acceso gratis
                <ArrowRight />
              </Link>
              <a href="#aprendizaje" className={styles.secondaryButton}>
                Ver que aprendere
              </a>
            </div>

            <p className={styles.microcopy}>Registrate gratis y asegura tu lugar</p>

            <div className={styles.metaGrid}>
              <div>
                <CalendarDays />
                <small>Fecha</small>
                <strong>Proximamente</strong>
              </div>
              <div>
                <Clock3 />
                <small>Horario</small>
                <strong>11:00 AM</strong>
              </div>
              <div>
                <MapPin />
                <small>Modalidad</small>
                <strong>Online</strong>
              </div>
            </div>

            <div className={styles.tags}>
              {highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className={styles.visual} aria-label="Panel de flujo inteligente">
            <div className={styles.aiPanel}>
              <div className={styles.panelHeader}>
                <span>AI Learning Console</span>
                <strong>LIVE</strong>
              </div>

              <div className={styles.flowItem}>
                <span>01</span>
                <div>
                  <strong>Analiza</strong>
                  <p>Resume ideas, documentos y dudas en segundos.</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <span>02</span>
                <div>
                  <strong>Detecta</strong>
                  <p>Encuentra oportunidades para ahorrar tiempo.</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <span>03</span>
                <div>
                  <strong>Entrega</strong>
                  <p>Genera respuestas claras para trabajo y estudio.</p>
                </div>
              </div>

              <div className={styles.terminal} id="aprendizaje">
                <p>&gt; Crea prompts utiles</p>
                <p>&gt; Ordena informacion</p>
                <p>&gt; Automatiza tareas simples</p>
                <p>&gt; Aprende sin tecnicismos</p>
              </div>
            </div>

            <div className={styles.faceCard}>
              <BrainCircuit />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';
import ActiveCampaignRegistrationTracker from '@/components/ebia/ActiveCampaignRegistrationTracker';
import styles from './page.module.css';

const highlights = ['Prompts utiles', 'IA practica', 'Sin tecnicismos'];

export const metadata = {
  title: 'Clase gratis de IA desde cero | EBIA',
  description:
    'Clase gratis de EBIA para aprender Inteligencia Artificial desde cero. 15 de julio, de 12 a 1 PM hora CDMX.',
};

export default function AccesoGratisPage() {
  return (
    <main className={styles.page}>
      <input className={styles.formToggle} id="registro-toggle" type="checkbox" />

      <aside className={styles.stickyEventBar} aria-label="Datos principales de la clase">
        <span>Fecha <strong>15 de julio</strong></span>
        <span>Horario <strong>12 a 1 PM</strong></span>
        <span>Hora local <strong>CDMX</strong></span>
      </aside>

      <div className={styles.scan} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <section className={styles.hero}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            <span>e</span>
            <strong>EBIA</strong>
          </Link>
          <p>Clase gratis &middot; 15 de julio</p>
        </header>

        <div className={styles.content}>
          <div className={styles.copy}>
            <div className={styles.badge}>
              <Sparkles />
              Clase gratuita en vivo
            </div>

            <h1>
              ABC de <span>Inteligencia Artificial</span> desde cero
            </h1>

            <p className={styles.description}>
              Aprende a usar IA para trabajar mas rapido, ordenar ideas, crear
              mejores prompts y aplicar herramientas digitales sin tecnicismos.
            </p>

            <div className={styles.actions}>
              <label htmlFor="registro-toggle" className={styles.primaryButton} role="button" tabIndex={0}>
                Quiero mi acceso gratis
                <ArrowRight />
              </label>
              <a href="#aprendizaje" className={styles.secondaryButton}>
                Ver que aprendere
              </a>
            </div>

            <p className={styles.microcopy}>Registrate gratis y asegura tu lugar</p>

            <div className={styles.metaGrid}>
              <div>
                <CalendarDays />
                <small>Fecha</small>
                <strong>15 de julio</strong>
              </div>
              <div>
                <Clock3 />
                <small>Horario</small>
                <strong>12 a 1 PM</strong>
              </div>
              <div>
                <MapPin />
                <small>Hora local</small>
                <strong>CDMX</strong>
              </div>
            </div>

            <div className={styles.tags}>
              {highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className={styles.visual} aria-label="Instructora de EBIA para la clase gratis">
            <img
              src="/ia-desde-cero/instructora-ebia.jpeg"
              alt="Instructora de EBIA para la clase gratis de inteligencia artificial"
            />

            <div className={styles.aiPanel} id="aprendizaje">
              <div className={styles.panelHeader}>
                <span>AI Learning Console</span>
                <strong>LIVE</strong>
              </div>

              <div className={styles.flowItem}>
                <span>01</span>
                <div>
                  <strong>Analiza</strong>
                  <p>Convierte ideas sueltas en respuestas claras.</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <span>02</span>
                <div>
                  <strong>Crea</strong>
                  <p>Aprende prompts para trabajo, estudio y negocio.</p>
                </div>
              </div>
              <div className={styles.flowItem}>
                <span>03</span>
                <div>
                  <strong>Aplica</strong>
                  <p>Usa IA en tareas reales desde el primer dia.</p>
                </div>
              </div>

              <div className={styles.terminal}>
                <p>&gt; Escribe mejores prompts</p>
                <p>&gt; Ahorra tiempo con IA</p>
                <p>&gt; Aprende paso a paso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formModal} aria-label="Formulario de registro">
        <label className={styles.formBackdrop} htmlFor="registro-toggle" aria-label="Cerrar formulario" />
        <div className={styles.formCard} role="dialog" aria-modal="true" aria-labelledby="form-title">
          <label className={styles.closeButton} htmlFor="registro-toggle" aria-label="Cerrar formulario">
            &times;
          </label>
          <p className={styles.formKicker}>Reserva tu lugar</p>
          <h2 id="form-title">Completa tu registro gratis</h2>
          <p className={styles.formCopy}>
            Deja tus datos para recibir la informacion de acceso a la clase del
            15 de julio, de 12 a 1 PM hora CDMX.
          </p>
          <div className={styles.activeFormWrap}>
            <div className="_form_273" />
          </div>
        </div>
      </section>

      <Script src="https://cefincapacitacion.activehosted.com/f/embed.php?id=273" strategy="afterInteractive" />
      <ActiveCampaignRegistrationTracker
        contentName="Acceso gratis ActiveCampaign form"
        redirectUrl="/ia-desde-cero/gracias"
        trackEvent="none"
      />
    </main>
  );
}

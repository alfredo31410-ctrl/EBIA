'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import ActiveCampaignRegistrationTracker from '@/components/ebia/ActiveCampaignRegistrationTracker';

export default function IaDesdeCeroLanding() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isFormOpen);

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isFormOpen]);

  return (
    <>
      <aside className="sticky-event-bar" aria-label="Datos principales de la clase">
        <span className="sticky-label">Clase gratuita</span>
        <span>Fecha <strong>15 de julio</strong></span>
        <span>Horario <strong>12 a 1 PM</strong></span>
        <span>Hora local <strong>CDMX</strong></span>
      </aside>

      <main className="page-shell">
        <div className="grid-overlay" aria-hidden="true" />
        <div className="blue-glow" aria-hidden="true" />
        <div className="amber-glow" aria-hidden="true" />

        <header className="site-header">
          <a
            className="brand"
            href="https://ebiacapacitacion.com/"
            aria-label="Ir a EBIA"
          >
            <span className="brand-mark">e</span>

            <span>
              <strong>EBIA</strong>
              <small>Escuela digital</small>
            </span>
          </a>

          <p className="header-pill">15 de julio &middot; 12 a 1 PM CDMX</p>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              En vivo para principiantes
            </div>

            <h1>
              Aprende Inteligencia Artificial
              <span>Sin Ser Experto</span>
            </h1>

            <p className="intro-card">
              Aprende a usar IA para trabajar mas rapido, ordenar ideas, crear
              mejores prompts y aplicar herramientas digitales sin tecnicismos.
            </p>

            <div className="actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => setIsFormOpen(true)}
              >
                Quiero mi acceso gratis
                <span>-&gt;</span>
              </button>

              <a className="secondary-button" href="#aprendizaje">
                Ver que aprendere
              </a>
            </div>

            <p className="microcopy">
              Registrate gratis y asegura tu lugar
            </p>

            <div className="event-grid" aria-label="Datos de la clase">
              <article>
                <small>Fecha</small>
                <strong>15 de julio</strong>
              </article>

              <article>
                <small>Horario</small>
                <strong>12 a 1 PM</strong>
              </article>

              <article>
                <small>Hora local</small>
                <strong>CDMX</strong>
              </article>
            </div>

            <div className="tag-row">
              <span>Prompts utiles</span>
              <span>IA practica</span>
              <span>Sin tecnicismos</span>
            </div>
          </div>

          <div className="hero-visual" id="aprendizaje">
            <div className="hero-stage">
              <div className="hero-glow" aria-hidden="true" />

              <div className="hero-orbit orbit-one" aria-hidden="true" />
              <div className="hero-orbit orbit-two" aria-hidden="true" />

              <img
                className="hero-character"
                src="/ia-desde-cero/assets/Foto1.png"
                alt="Instructora de EBIA para la clase gratuita de Inteligencia Artificial"
                fetchPriority="high"
              />

              <div className="floating-chip chip-top">
                IA para principiantes
              </div>

              <div className="floating-chip chip-middle">
                Aprende mas rapido
              </div>

              <div className="ai-panel visual-card">
                <div className="panel-heading">
                  <strong>AI Learning Console</strong>
                  <span>LIVE</span>
                </div>

                <div className="panel-step">
                  <b>01</b>

                  <div>
                    <strong>Analiza</strong>
                    <p>Convierte ideas sueltas en respuestas claras.</p>
                  </div>
                </div>

                <div className="panel-step">
                  <b>02</b>

                  <div>
                    <strong>Crea</strong>
                    <p>Aprende prompts para trabajo, estudio y negocio.</p>
                  </div>
                </div>

                <div className="panel-step">
                  <b>03</b>

                  <div>
                    <strong>Aplica</strong>
                    <p>Usa IA en tareas reales desde el primer dia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section
        className={`form-modal${isFormOpen ? ' is-open' : ''}`}
        id="registro-form"
        aria-hidden={!isFormOpen}
      >
        <div
          className="form-backdrop"
          role="button"
          tabIndex={0}
          aria-label="Cerrar formulario"
          onClick={() => setIsFormOpen(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsFormOpen(false);
            }
          }}
        />

        <div
          className="form-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-title"
        >
          <button
            className="close-button"
            type="button"
            aria-label="Cerrar formulario"
            onClick={() => setIsFormOpen(false)}
          >
            &times;
          </button>

          <p className="form-kicker">Reserva tu lugar</p>

          <h2 id="form-title">Completa tu registro gratis</h2>

          <p className="form-copy">
            Deja tus datos para recibir la informacion de acceso a la clase del
            15 de julio, de 12 a 1 PM hora CDMX.
          </p>

          <div className="active-form-wrap">
            <div className="_form_273" />
          </div>
        </div>
      </section>

      <Script src="https://cefincapacitacion.activehosted.com/f/embed.php?id=273" strategy="afterInteractive" />
      <ActiveCampaignRegistrationTracker
        contentName="IA desde cero ActiveCampaign form"
        redirectUrl="/landings/gracias"
        submitProxyUrl="/api/activecampaign/ia-desde-cero"
        trackEvent="none"
      />
    </>
  );
}

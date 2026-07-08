import RetoCheckoutTracker from '@/components/ebia/RetoCheckoutTracker';

export const metadata = {
  title: 'Reto 5 dias IA | EBIA',
  description:
    'Reto intensivo de Inteligencia Artificial para principiantes. Aprende de no saber nada a usar IA con claridad en 5 dias.',
};

export default function Reto5DiasIaPage() {
  return (
    <>
      <link rel="stylesheet" href="/reto-5-dias-ia/styles.css?v=20260708-1" />
      <RetoCheckoutTracker />

      <aside className="sticky-bar" aria-label="Datos principales del reto">
        <span>Inteligencia Artificial: de no saber nada a crack en 5 dias</span>
        <strong>27 al 31 de julio</strong>
        <strong>12 a 1 PM CDMX</strong>
        <strong>$190 MX</strong>
      </aside>

      <main className="page">
        <div className="neural-bg" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="scan-grid" aria-hidden="true" />
        <div className="orb orb-one" aria-hidden="true" />
        <div className="orb orb-two" aria-hidden="true" />

        <header className="header">
          <a
            className="brand"
            href="/"
            aria-label="Ir al sitio principal de EBIA"
          >
            <span>e</span>

            <div>
              <strong>EBIA</strong>
              <small>Escuela digital</small>
            </div>
          </a>

          <a className="header-cta" href="#inscripcion">Inscribirme ahora</a>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Reto intensivo en vivo</p>

            <h1>
              Inteligencia Artificial
              <span>de no saber nada a crack en 5 dias</span>
            </h1>

            <p className="lead">
              Entra a una experiencia practica para entender, usar y aplicar
              Inteligencia Artificial con claridad, aunque hoy sientas que empiezas
              completamente desde cero.
            </p>

            <div className="actions">
              <a className="primary-button" href="#inscripcion">
                Inscribirme ahora
              </a>

              <a className="ghost-button" href="#agenda">
                Ver plan de 5 dias
              </a>
            </div>

            <div className="event-grid" aria-label="Informacion del reto">
              <article>
                <small>Fechas</small>
                <strong>27 al 31 de julio</strong>
              </article>

              <article>
                <small>Horario</small>
                <strong>12 a 1 PM</strong>
              </article>

              <article>
                <small>Hora local</small>
                <strong>CDMX</strong>
              </article>

              <article>
                <small>Inversion</small>
                <strong>$190 MX</strong>
              </article>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-stage">
              <div className="hero-glow" aria-hidden="true" />

              <div className="hero-orbit orbit-one" aria-hidden="true" />
              <div className="hero-orbit orbit-two" aria-hidden="true" />

              <img
                className="hero-character"
                src="/reto-5-dias-ia/assets/Foto2.png"
                alt="Instructora de EBIA para el reto de Inteligencia Artificial"
                fetchPriority="high"
              />

              <div className="floating-chip chip-one">Prompt listo</div>
              <div className="floating-chip chip-two">IA aplicada</div>
              <div className="floating-chip chip-three">5 dias en vivo</div>

              <div className="mini-proof-card">
                <strong>Aprende desde cero</strong>
                <p>
                  Con estructura, ejemplos claros y aplicacion en tareas reales.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="console-band" id="agenda">
          <div className="section-heading">
            <p>Ruta de 5 dias</p>
            <h2>Del cero absoluto a usar IA con criterio</h2>
          </div>

          <div className="day-grid">
            <article>
              <span>01</span>
              <h3>Entiende la IA</h3>
              <p>
                Aprende que pedir, como pedirlo y que revisar antes de confiar en
                una respuesta.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Prompts utiles</h3>
              <p>
                Construye instrucciones claras para obtener respuestas mas utiles
                y especificas.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Trabajo real</h3>
              <p>
                Usa IA para ordenar ideas, redactar, investigar y resolver tareas
                concretas.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Flujos simples</h3>
              <p>
                Conecta pasos para ahorrar tiempo sin complicarte con tecnologia.
              </p>
            </article>

            <article>
              <span>05</span>
              <h3>Plan de accion</h3>
              <p>
                Termina con una ruta clara para seguir practicando y mejorar tus
                resultados.
              </p>
            </article>
          </div>

          <a className="wide-button" href="#inscripcion">
            Reservar mi lugar
          </a>
        </section>

        <section className="proof-section">
          <div className="ai-card">
            <div className="ai-card-header">
              <span>AI Skill Console</span>
              <strong>LIVE</strong>
            </div>

            <div className="terminal-lines">
              <p>&gt; Genera ideas accionables</p>
              <p>&gt; Mejora instrucciones paso a paso</p>
              <p>&gt; Convierte dudas en respuestas claras</p>
              <p>&gt; Aplica IA sin tecnicismos</p>
            </div>
          </div>

          <div className="proof-copy">
            <p className="eyebrow">Para empezar sin miedo</p>

            <h2>
              Aprende haciendo, con estructura y acompanamiento
            </h2>

            <p>
              Esta experiencia esta pensada para que entiendas lo esencial, uses
              herramientas de IA con proposito y salgas con una base practica para
              aplicarla en tu vida, trabajo o negocio.
            </p>

            <a className="primary-button" href="#inscripcion">
              Ver precio y fechas
            </a>
          </div>
        </section>

        <section className="price-section" id="inscripcion">
          <div className="price-card">
            <p className="eyebrow">Acceso especial</p>

            <h2>$190 <span>MX</span></h2>

            <p>
              Incluye 5 sesiones en vivo del 27 al 31 de julio, de 12 a 1 PM hora
              CDMX.
            </p>

            <a
              className="checkout-button"
              href="#inscripcion"
              data-ebia-track="checkout"
            >
              Inscribirme ahora
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

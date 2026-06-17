import Link from 'next/link';
import styles from './page.module.css';

const whatsappUrl =
  'https://wa.me/5215555555555?text=Hola%20EBIA%2C%20quiero%20informaci%C3%B3n%20sobre%20la%20clase%20de%20IA%20desde%20cero.';

const steps = [
  {
    number: '01',
    title: 'Entender la IA sin miedo',
    text: 'Que es, para que sirve y como aprovecharla en tareas reales.',
  },
  {
    number: '02',
    title: 'Crear prompts efectivos',
    text: 'Aprende a pedir respuestas mas claras, utiles y accionables.',
  },
  {
    number: '03',
    title: 'Usarla con Excel y herramientas digitales',
    text: 'Organiza ideas, resume informacion y acelera procesos cotidianos.',
  },
];

const benefits = [
  'Empiezas desde cero, sin dar nada por sabido.',
  'Aprendes con ejemplos practicos y cotidianos.',
  'Descubres como usar IA para ahorrar tiempo.',
  'Sales con una ruta clara para seguir aprendiendo.',
];

export const metadata = {
  title: 'EBIA | IA desde cero',
  description:
    'Landing de EBIA para aprender Inteligencia Artificial, Excel y herramientas digitales desde cero, paso a paso y sin tecnicismos.',
};

export default function IaDesdeCeroLanding() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>e</span>
          <span>
            <strong>EBIA</strong>
            <small>Escuela digital</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegacion principal">
          <a href="#programa">Programa</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#registro">Registro</a>
        </nav>

        <a className={styles.headerCta} href="#registro">
          Empezar ahora
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Clase gratuita · Inteligencia Artificial</p>
            <h1>Aprende IA desde cero y usala a tu favor.</h1>
            <p className={styles.heroText}>
              Una landing de EBIA para personas que quieren dejar de sentirse
              atrasadas y empezar a usar ChatGPT, Excel y herramientas
              tecnologicas con ejemplos practicos.
            </p>

            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={whatsappUrl} target="_blank" rel="noreferrer">
                Reservar mi lugar
              </a>
              <a className={styles.secondaryButton} href="#programa">
                Ver contenido
              </a>
            </div>

            <div className={styles.trustRow} aria-label="Puntos clave">
              <span>Desde cero</span>
              <span>Sin tecnicismos</span>
              <span>Ejemplos reales</span>
            </div>
          </div>

          <div className={styles.heroMedia}>
            <img
              src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=1200&q=85"
              alt="Persona aprendiendo tecnologia con una laptop"
            />
            <div className={`${styles.floatingCard} ${styles.cardTop}`}>
              <span>01</span>
              <strong>Aprende paso a paso</strong>
            </div>
            <div className={`${styles.floatingCard} ${styles.cardBottom}`}>
              <span>IA</span>
              <strong>Prompts claros y utiles</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.problem}>
        <div className={styles.sectionKicker}>El problema</div>
        <h2>La tecnologia avanza rapido, pero aprenderla no tiene que ser complicado.</h2>
        <p>
          En EBIA convertimos temas como Inteligencia Artificial, Excel y
          herramientas digitales en explicaciones simples, humanas y aplicables
          para el trabajo, el estudio o tu proyecto personal.
        </p>
      </section>

      <section className={styles.steps} id="programa">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionKicker}>Que aprenderas</span>
          <h2>Una ruta clara para empezar con confianza</h2>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.split} id="beneficios">
        <div>
          <span className={styles.sectionKicker}>Para quien es</span>
          <h2>Para personas curiosas que quieren aprender sin sentirse perdidas.</h2>
          <p>
            Si ya intentaste aprender tecnologia y te frustraste con palabras
            complicadas, esta clase esta pensada para ti.
          </p>
        </div>

        <ul className={styles.benefitList}>
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>

      <section className={styles.proof}>
        <div className={styles.proofCard}>
          <strong>EBIA</strong>
          <span>IA · Excel · Tecnologia</span>
          <p>
            Aprende con una escuela digital que explica con calma, acompana el
            proceso y te ayuda a aplicar lo aprendido desde el primer dia.
          </p>
        </div>
        <img
          src="https://images.pexels.com/photos/6238120/pexels-photo-6238120.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Personas aprendiendo juntas"
        />
      </section>

      <section className={styles.ctaSection} id="registro">
        <div>
          <span className={styles.sectionKicker}>Registro</span>
          <h2>Da el primer paso para usar la tecnologia con confianza.</h2>
          <p>
            Reserva tu lugar y recibe la informacion para entrar a la clase de
            IA desde cero de EBIA.
          </p>
        </div>
        <a className={styles.primaryButton} href={whatsappUrl} target="_blank" rel="noreferrer">
          Escribir por WhatsApp
        </a>
      </section>
    </main>
  );
}

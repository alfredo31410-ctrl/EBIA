import IaDesdeCeroLanding from '@/components/ebia/IaDesdeCeroLanding';

export const metadata = {
  title: 'EBIA | Aprende Inteligencia Artificial Sin Ser Experto',
  description:
    'Clase gratuita de EBIA: Aprende Inteligencia Artificial Sin Ser Experto. 15 de julio, de 12 a 1 PM hora CDMX.',
};

export default function IaDesdeCeroPage() {
  return (
    <>
      <link rel="stylesheet" href="/ia-desde-cero/styles.css?v=20260709-1" />
      <IaDesdeCeroLanding />
    </>
  );
}

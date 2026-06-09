export const CATEGORIES = [
  { value: 'ia', label: 'Inteligencia Artificial', emoji: '✨' },
  { value: 'excel', label: 'Excel', emoji: '📊' },
  { value: 'herramientas', label: 'Herramientas digitales', emoji: '🧰' },
];

export const LEVELS = [
  { value: 'principiante', label: 'Principiante' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

export function getCategoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label || value;
}

export function getLevelLabel(value) {
  return LEVELS.find(l => l.value === value)?.label || value;
}

export function whatsappLink(message) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215555555555';
  const msg = encodeURIComponent(message || process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hola EBIA, quiero más información.');
  return `https://wa.me/${phone}?text=${msg}`;
}

'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/ebia/constants';
import { trackWhatsAppClick } from '@/lib/meta-pixel';

export default function WhatsappButton({ message, label = 'Escríbenos por WhatsApp', floating = false }) {
  const handleClick = () => {
    trackWhatsAppClick({
      content_name: floating ? 'Floating WhatsApp button' : label,
    });
  };

  if (floating) {
    return (
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-green-500/30 hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </a>
    );
  }
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold text-sm shadow-lg shadow-green-500/20 transition"
    >
      <MessageCircle className="h-4 w-4" fill="currentColor" />
      {label}
    </a>
  );
}

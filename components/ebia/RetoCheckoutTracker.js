'use client';

import { useEffect } from 'react';
import { trackInitiateCheckout } from '@/lib/meta-pixel';

export default function RetoCheckoutTracker() {
  useEffect(() => {
    const checkoutButtons = document.querySelectorAll('[data-ebia-track="checkout"]');

    const handleCheckoutClick = () => {
      trackInitiateCheckout({
        content_name: 'Reto 5 dias IA',
        value: 190,
        currency: 'MXN',
      });
    };

    checkoutButtons.forEach((button) => {
      button.addEventListener('click', handleCheckoutClick);
    });

    return () => {
      checkoutButtons.forEach((button) => {
        button.removeEventListener('click', handleCheckoutClick);
      });
    };
  }, []);

  return null;
}

export const META_PIXEL_ID = '1928404584468392';

function getFbq() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    return null;
  }

  return window.fbq;
}

export function trackPageView(params) {
  const fbq = getFbq();
  if (fbq) fbq('track', 'PageView', params);
}

export function trackLead(params) {
  const fbq = getFbq();
  if (fbq) fbq('track', 'Lead', params);
}

export function trackCompleteRegistration(params) {
  const fbq = getFbq();
  if (fbq) fbq('track', 'CompleteRegistration', params);
}

export function trackInitiateCheckout(params) {
  const fbq = getFbq();
  if (fbq) fbq('track', 'InitiateCheckout', params);
}

export function trackPurchase(params) {
  const fbq = getFbq();
  if (fbq) fbq('track', 'Purchase', params);
}

export function trackWhatsAppClick(params) {
  const fbq = getFbq();
  if (fbq) fbq('trackCustom', 'WhatsAppClick', params);
}

export function trackCompleteRegistrationOnce(params, key = 'ebia_complete_registration_tracked') {
  if (typeof window === 'undefined') return;

  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');
  } catch (error) {
    if (window[key]) return;
    window[key] = true;
  }

  trackCompleteRegistration(params);
}

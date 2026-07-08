'use client';

import { useEffect } from 'react';
import { trackCompleteRegistrationOnce } from '@/lib/meta-pixel';

const SUCCESS_SELECTORS = [
  '._form-thank-you',
  '._form_success',
  '._form-success',
  '._success',
  '.thank-you',
  '[data-form-success]',
];

function isVisible(element) {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
}

function detectSuccess(root) {
  return SUCCESS_SELECTORS.some((selector) => {
    const element = root.querySelector(selector);
    return element && isVisible(element);
  });
}

export default function ActiveCampaignRegistrationTracker({
  selector = '._form_273',
  contentName = 'ActiveCampaign registration form',
}) {
  useEffect(() => {
    const root = document.querySelector(selector);
    if (!root) return undefined;

    const trackSuccess = () => {
      if (!detectSuccess(root)) return;

      trackCompleteRegistrationOnce({
        content_name: contentName,
      });
    };

    trackSuccess();

    const observer = new MutationObserver(trackSuccess);
    observer.observe(root, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'aria-hidden'],
    });

    return () => observer.disconnect();
  }, [contentName, selector]);

  return null;
}

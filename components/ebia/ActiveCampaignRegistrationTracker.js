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

const SUBMIT_FRAME_NAME = 'ebia-activecampaign-submit-frame';

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

function getRedirectTarget(redirectUrl) {
  if (!redirectUrl) return null;

  return new URL(redirectUrl, window.location.origin).href;
}

function syncRedirectFields(root, redirectTarget) {
  if (!redirectTarget) return;

  root
    .querySelectorAll(
      'input[name="redirect"], input[name="_redirect"], input[name="redirect_url"], input[name="thank_you_url"], input[name="success_url"]'
    )
    .forEach((input) => {
      input.value = redirectTarget;
    });
}

function syncFormTargets(root, redirectTarget) {
  if (!redirectTarget) return;

  root.querySelectorAll('form').forEach((form) => {
    form.target = SUBMIT_FRAME_NAME;
  });
}

function ensureSubmissionFrame() {
  let frame = document.querySelector(`iframe[name="${SUBMIT_FRAME_NAME}"]`);

  if (!frame) {
    frame = document.createElement('iframe');
    frame.name = SUBMIT_FRAME_NAME;
    frame.title = 'Formulario de registro EBIA';
    frame.style.display = 'none';
    frame.setAttribute('aria-hidden', 'true');
    document.body.appendChild(frame);
  }

  return frame;
}

export default function ActiveCampaignRegistrationTracker({
  selector = '._form_273',
  contentName = 'ActiveCampaign registration form',
  redirectUrl,
  submitProxyUrl,
  trackEvent = 'CompleteRegistration',
}) {
  useEffect(() => {
    const root = document.querySelector(selector);
    if (!root) return undefined;

    let hasRedirected = false;
    const redirectTarget = getRedirectTarget(redirectUrl);
    if (redirectTarget) {
      ensureSubmissionFrame();
    }

    syncRedirectFields(root, redirectTarget);
    syncFormTargets(root, redirectTarget);

    const redirectAfterSuccess = () => {
      if (!redirectTarget || hasRedirected) return;

      hasRedirected = true;
      window.location.replace(redirectTarget);
    };

    const trackRegistration = () => {
      if (trackEvent === 'CompleteRegistration') {
        trackCompleteRegistrationOnce({
          content_name: contentName,
        });
      }
      redirectAfterSuccess();
    };

    const trackSuccess = () => {
      syncRedirectFields(root, redirectTarget);
      syncFormTargets(root, redirectTarget);
      if (!detectSuccess(root)) return;

      trackRegistration();
    };

    trackSuccess();

    const handleSubmit = async (event) => {
      const form = event.target;

      if (!redirectTarget || !(form instanceof HTMLFormElement) || !root.contains(form)) {
        return;
      }

      if (submitProxyUrl) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') {
          form.reportValidity();
        }

        return;
      }

      syncRedirectFields(root, redirectTarget);
      ensureSubmissionFrame();
      form.target = SUBMIT_FRAME_NAME;

      if (submitProxyUrl) {
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        submitButtons.forEach((button) => {
          button.disabled = true;
          button.classList.add('processing');
        });

        try {
          const response = await fetch(submitProxyUrl, {
            method: 'POST',
            body: new FormData(form),
          });

          if (!response.ok) {
            throw new Error('ActiveCampaign proxy submit failed');
          }

          trackRegistration();
        } catch {
          submitButtons.forEach((button) => {
            button.disabled = false;
            button.classList.remove('processing');
          });

          window.alert('No se pudo enviar el registro. Revisa tus datos e intenta de nuevo.');
        }

        return;
      }

      window.setTimeout(trackRegistration, 900);
    };

    root.addEventListener('submit', handleSubmit, true);

    const previousCallback = window._form_callback;
    const formCallback = (id) => {
      if (redirectTarget) {
        trackRegistration();
        return;
      }

      if (typeof previousCallback === 'function') {
        previousCallback(id);
      }

      window.setTimeout(() => {
        if (detectSuccess(root)) {
          trackRegistration();
        }
      }, 0);
    };

    window._form_callback = formCallback;

    const observer = new MutationObserver(trackSuccess);
    observer.observe(root, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'aria-hidden'],
    });

    return () => {
      root.removeEventListener('submit', handleSubmit, true);
      observer.disconnect();

      if (window._form_callback === formCallback) {
        window._form_callback = previousCallback;
      }
    };
  }, [contentName, redirectUrl, selector, submitProxyUrl, trackEvent]);

  return null;
}

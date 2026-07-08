'use client';

import { useEffect } from 'react';
import { trackCompleteRegistrationOnce } from '@/lib/meta-pixel';

export default function RegistrationCompleteTracker({ contentName = 'Registration thank you page' }) {
  useEffect(() => {
    trackCompleteRegistrationOnce({
      content_name: contentName,
    });
  }, [contentName]);

  return null;
}

'use client';

import { useEffect } from 'react';
import { trackLeadOnce } from '@/lib/meta-pixel';

export default function LeadTracker({ contentName = 'Lead thank you page' }) {
  useEffect(() => {
    trackLeadOnce({
      content_name: contentName,
    });
  }, [contentName]);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/meta-pixel';

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const lastPathname = useRef(null);

  useEffect(() => {
    if (!pathname || lastPathname.current === pathname) return;

    if (lastPathname.current === null) {
      lastPathname.current = pathname;
      return;
    }

    lastPathname.current = pathname;
    trackPageView();
  }, [pathname]);

  return null;
}

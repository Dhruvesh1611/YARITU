"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

// Simple GA4 pageview helper. Expects NEXT_PUBLIC_GA_ID to be set.
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_ID;
    const debug = !!process.env.NEXT_PUBLIC_GA_DEBUG;
    if (!measurementId) return;

    // If debug flag is set at build time, enable debug_mode on gtag
    if (debug && typeof window.gtag === 'function') {
      try {
        window.gtag('set', { debug_mode: true });
      } catch (e) {
        // ignore
      }
    }

    // send a page_view event when the pathname/search changes
    if (typeof window.gtag === 'function') {
      const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
      try {
        const payload = { page_path: url };
        if (debug) payload.debug_mode = true;
        window.gtag('event', 'page_view', payload);
      } catch (e) {
        // swallow any errors in analytics
      }
    }
  }, [pathname, searchParams]);

  // We also include the loader Script tags here via next/script in layout,
  // but this component ensures page_view events are emitted on navigation.
  return null;
}

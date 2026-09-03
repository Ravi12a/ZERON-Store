import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route change in this SPA
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);

  return null;
}

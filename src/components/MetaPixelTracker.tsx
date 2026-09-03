import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/metaPixel';

export default function MetaPixelTracker() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip first render as index.html already fires PageView
    }
    
    // Track page views on route change in this SPA
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
}

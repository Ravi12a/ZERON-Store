export const fbq = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq(...args);
  }
};

export const trackPageView = () => {
  fbq('track', 'PageView');
};

export const trackViewContent = (data: { content_ids: string[]; content_type: string; value: number; currency: string }) => {
  fbq('track', 'ViewContent', data);
};

export const trackAddToCart = (data: { content_ids: string[]; content_type: string; value: number; currency: string }) => {
  fbq('track', 'AddToCart', data);
};

export const trackInitiateCheckout = (data: { content_ids: string[]; content_type: string; value: number; currency: string; num_items: number }) => {
  fbq('track', 'InitiateCheckout', data);
};

export const trackPurchase = (data: { content_ids: string[]; content_type: string; value: number; currency: string; num_items: number }) => {
  fbq('track', 'Purchase', data);
};

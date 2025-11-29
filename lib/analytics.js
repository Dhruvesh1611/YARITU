/**
 * frontend/lib/analytics.js
 *
 * Small helper wrapper around window.gtag for GA4 custom events.
 * Provides safe no-op behaviour when GA isn't configured and optional
 * console debug logs when NEXT_PUBLIC_GA_DEBUG is enabled.
 */

/**
 * Returns true when gtag is available on window.
 */
export function isGtagAvailable() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Send a generic GA4 event.
 * name: event name (string)
 * params: object of event parameters
 */
export function trackEvent(name, params = {}) {
  const debug = !!process.env.NEXT_PUBLIC_GA_DEBUG;
  if (!isGtagAvailable()) {
    if (debug) console.debug('[analytics] gtag not ready — dropping event', name, params);
    return;
  }

  try {
    const payload = { ...params };
    if (debug) payload.debug_mode = true;
    window.gtag('event', name, payload);
    if (debug) console.debug('[analytics] sent event', name, payload);
  } catch (err) {
    if (debug) console.warn('[analytics] gtag send failed', err);
  }
}

// Higher-level helpers for common events used across the app.

/**
 * Track product view
 * product: { id, name, category, price }
 */
export function trackProductView(product = {}) {
  const params = {
    item_id: product.id || product._id || null,
    item_name: product.name || product.title || null,
    item_category: product.category || product.collection || null,
    value: product.price || null,
    currency: product.currency || 'INR',
  };
  trackEvent('view_item', params);
}

/**
 * Track add to cart
 * product: same shape as above
 * quantity: number
 */
export function trackAddToCart(product = {}, quantity = 1) {
  const params = {
    item_id: product.id || product._id || null,
    item_name: product.name || product.title || null,
    item_category: product.category || product.collection || null,
    quantity: quantity || 1,
    value: product.price || null,
    currency: product.currency || 'INR',
  };
  trackEvent('add_to_cart', params);
}

/**
 * Track collection save (when an admin edits/saves a collection)
 * collection: { id, title }
 */
export function trackCollectionSave(collection = {}) {
  const params = {
    collection_id: collection._id || collection.id || null,
    collection_title: collection.title || collection.name || null,
  };
  trackEvent('collection_save', params);
}

/**
 * Track signup / lead
 * user: { id, method }
 */
export function trackSignup(user = {}) {
  const params = {
    user_id: user.id || null,
    method: user.method || null,
  };
  trackEvent('sign_up', params);
}

export default {
  isGtagAvailable,
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackCollectionSave,
  trackSignup,
};

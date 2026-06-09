/**
 * @fileoverview Google Analytics 4 integration utilities.
 * Wraps react-ga4 with safe initialization and event tracking.
 * @module utils/analytics
 */

import ReactGA from 'react-ga4';

/**
 * Initializes Google Analytics 4.
 * Safe to call multiple times — GA4 deduplicates.
 * No-ops gracefully when measurement ID is missing.
 */
export function initAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) return;
  ReactGA.initialize(id);
}

/**
 * Tracks a page view.
 * @param {string} path - Route path
 * @param {string} title - Page title
 */
export function trackPageView(path, title) {
  ReactGA.send({ hitType: 'pageview', page: path, title });
}

/**
 * Tracks a custom user event.
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} [label] - Optional label
 */
export function trackEvent(category, action, label) {
  ReactGA.event({ category, action, label });
}

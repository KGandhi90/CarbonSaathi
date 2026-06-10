import { describe, it, expect } from 'vitest';
import ReactGA from 'react-ga4';
import {
  initAnalytics,
  trackPageView,
  trackEvent,
} from '../utils/analytics';

describe('analytics', () => {
  it('initAnalytics calls ReactGA.initialize', () => {
    initAnalytics();
    expect(ReactGA.initialize).toHaveBeenCalled();
  });

  it('trackPageView calls ReactGA.send', () => {
    trackPageView('/', 'Dashboard');
    expect(ReactGA.send).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: '/',
      title: 'Dashboard',
    });
  });

  it('trackEvent fires with correct params', () => {
    trackEvent('Log', 'ActivitySaved', 'Total: 2.4 kg');
    expect(ReactGA.event).toHaveBeenCalledWith({
      category: 'Log',
      action: 'ActivitySaved',
      label: 'Total: 2.4 kg',
    });
  });

  it('trackEvent works without label', () => {
    expect(() => trackEvent('Chat', 'MessageSent')).not.toThrow();
  });

  it('does not throw when GA key is missing', () => {
    expect(() => initAnalytics()).not.toThrow();
  });
});

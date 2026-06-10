import { describe, it, expect } from 'vitest';
import {
  formatShareText,
  getGreeting,
  getMockReply,
} from '../utils/helpers';

describe('formatShareText', () => {
  it('includes the total CO₂ value', () => {
    expect(formatShareText(2.40)).toContain('2.40');
  });

  it('includes CarbonSaathi branding', () => {
    expect(formatShareText(1.5)).toContain('CarbonSaathi');
  });

  it('includes current URL origin', () => {
    expect(formatShareText(3.0)).toContain(window.location.origin);
  });
});

describe('getGreeting', () => {
  it('returns a non-empty string', () => {
    expect(typeof getGreeting()).toBe('string');
    expect(getGreeting().length).toBeGreaterThan(0);
  });

  it('contains morning/afternoon/evening', () => {
    const greeting = getGreeting().toLowerCase();
    const valid =
      greeting.includes('morning') ||
      greeting.includes('afternoon') ||
      greeting.includes('evening');
    expect(valid).toBe(true);
  });
});

describe('getMockReply', () => {
  it('responds to transport keywords', () => {
    const reply = getMockReply('mumbai transport');
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(0);
  });

  it('responds to EV keywords', () => {
    const reply = getMockReply('is an ev worth it');
    expect(reply.toLowerCase()).toMatch(/ev|electric/);
  });

  it('responds to diet keywords', () => {
    const reply = getMockReply('food and diet');
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(0);
  });

  it('responds to energy keywords', () => {
    const reply = getMockReply('home energy electricity');
    expect(typeof reply).toBe('string');
  });

  it('returns default for unknown input', () => {
    const reply = getMockReply('xyzabc123random');
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(10);
  });

  it('is case insensitive', () => {
    const lower = getMockReply('ev');
    const upper = getMockReply('EV');
    expect(lower).toBe(upper);
  });

  it('always returns a string for any input', () => {
    ['', 'hello', 'cricket', 'Zomato', 'solar', 'flight'].forEach((input) => {
      expect(typeof getMockReply(input)).toBe('string');
    });
  });
});

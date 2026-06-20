import { describe, it, expect } from 'vitest';
import {
  calcTransport,
  calcFood,
  calcEnergy,
  calcShopping,
  calcTotal,
  calcScore,
  formatCO2,
  clampValue,
  getScoreLabel,
} from '../utils/carbonCalc';
import { transportModes, foodTypes, shoppingTypes } from '../data/mockData';

describe('calcTransport', () => {
  it('calculates car emissions correctly', () => {
    expect(calcTransport('car', 10, transportModes)).toBe(2.1);
  });

  it('calculates metro emissions correctly', () => {
    expect(calcTransport('metro', 10, transportModes)).toBe(0.4);
  });

  it('returns 0 for walking', () => {
    expect(calcTransport('walk', 20, transportModes)).toBe(0);
  });

  it('returns 0 for unknown mode', () => {
    expect(calcTransport('spaceship', 10, transportModes)).toBe(0);
  });

  it('handles 0 km correctly', () => {
    expect(calcTransport('car', 0, transportModes)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calcTransport('car', 3, transportModes);
    expect(result.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
  });
});

describe('calcFood', () => {
  it('calculates veg meals correctly', () => {
    expect(calcFood('veg', 3, foodTypes)).toBe(1.5);
  });

  it('calculates mutton meals correctly', () => {
    expect(calcFood('mutton', 2, foodTypes)).toBe(6.0);
  });

  it('returns 0 for unknown food type', () => {
    expect(calcFood('pizza', 2, foodTypes)).toBe(0);
  });

  it('handles 0 meals correctly', () => {
    expect(calcFood('chicken', 0, foodTypes)).toBe(0);
  });
});

describe('calcEnergy', () => {
  it('calculates without renewable', () => {
    expect(calcEnergy(2, 3, false)).toBe(1.6);
  });

  it('applies 50% reduction for renewable', () => {
    expect(calcEnergy(2, 3, true)).toBe(0.8);
  });

  it('returns 0 for no usage', () => {
    expect(calcEnergy(0, 0, false)).toBe(0);
  });

  it('handles only AC usage', () => {
    expect(calcEnergy(4, 0, false)).toBe(2.0);
  });

  it('handles only appliances', () => {
    expect(calcEnergy(0, 5, false)).toBe(1.0);
  });
});

describe('calcShopping', () => {
  it('calculates electronics correctly', () => {
    expect(calcShopping('electronics', 1000, shoppingTypes)).toBe(4.0);
  });

  it('returns 0 for none category', () => {
    expect(calcShopping('none', 5000, shoppingTypes)).toBe(0);
  });

  it('calculates partial spend correctly', () => {
    expect(calcShopping('clothing', 500, shoppingTypes)).toBe(1.0);
  });

  it('returns 0 for 0 spend', () => {
    expect(calcShopping('electronics', 0, shoppingTypes)).toBe(0);
  });
});

describe('calcTotal', () => {
  it('sums all categories correctly', () => {
    expect(
      calcTotal({
        transport: 2.1,
        food: 1.5,
        energy: 1.6,
        shopping: 0,
      })
    ).toBe(5.2);
  });

  it('returns 0 for all zero inputs', () => {
    expect(calcTotal({ a: 0, b: 0, c: 0 })).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calcTotal({ a: 1.333, b: 1.333, c: 1.333 });
    expect(Number.isFinite(result)).toBe(true);
    expect(result.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
  });
});

describe('calcScore', () => {
  it('returns 100 for 0 emissions', () => {
    expect(calcScore(0)).toBe(100);
  });

  it('returns 0 for max emissions', () => {
    expect(calcScore(7.5)).toBe(0);
  });

  it('returns 0 for above max emissions', () => {
    expect(calcScore(100)).toBe(0);
  });

  it('calculates mid-range correctly', () => {
    expect(calcScore(3.75)).toBe(50);
  });

  it('always returns value between 0 and 100', () => {
    [-1, 0, 2.4, 5, 7.5, 10].forEach((val) => {
      const score = calcScore(val);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});

describe('formatCO2', () => {
  it('formats to 2 decimal places', () => {
    expect(formatCO2(2.4)).toBe('2.40');
    expect(formatCO2(1)).toBe('1.00');
    expect(formatCO2(0)).toBe('0.00');
  });
});

describe('clampValue', () => {
  it('clamps below minimum', () => {
    expect(clampValue(-5, 0, 100)).toBe(0);
  });

  it('clamps above maximum', () => {
    expect(clampValue(150, 0, 100)).toBe(100);
  });

  it('returns value within range unchanged', () => {
    expect(clampValue(50, 0, 100)).toBe(50);
  });

  it('returns min for NaN input', () => {
    expect(clampValue(NaN, 0, 100)).toBe(0);
  });

  it('handles string numbers', () => {
    expect(clampValue('25', 0, 100)).toBe(25);
  });
});

describe('getScoreLabel', () => {
  it('returns primary variant for high score', () => {
    expect(getScoreLabel(70).variant).toBe('primary');
    expect(getScoreLabel(100).variant).toBe('primary');
  });

  it('returns amber variant for medium score', () => {
    expect(getScoreLabel(40).variant).toBe('amber');
    expect(getScoreLabel(69).variant).toBe('amber');
  });

  it('returns coral variant for low score', () => {
    expect(getScoreLabel(0).variant).toBe('coral');
    expect(getScoreLabel(39).variant).toBe('coral');
  });

  it('always returns label and variant', () => {
    [0, 39, 40, 69, 70, 100].forEach((s) => {
      const result = getScoreLabel(s);
      expect(result).toHaveProperty('label');
      expect(result).toHaveProperty('variant');
    });
  });
});

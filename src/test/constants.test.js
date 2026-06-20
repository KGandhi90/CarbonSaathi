import { describe, it, expect } from 'vitest';
import {
  MAX_DAILY_CO2_KG,
  SCORE_THRESHOLDS,
  ENERGY_FACTORS,
  INPUT_LIMITS,
} from '../utils/constants';

describe('constants', () => {
  it('MAX_DAILY_CO2_KG is a positive number', () => {
    expect(MAX_DAILY_CO2_KG).toBeGreaterThan(0);
  });

  it('SCORE_THRESHOLDS has correct ordering', () => {
    expect(SCORE_THRESHOLDS.LOW_IMPACT).toBeGreaterThan(SCORE_THRESHOLDS.MODERATE_IMPACT);
  });

  it('ENERGY_FACTORS renewable multiplier reduces emissions', () => {
    expect(ENERGY_FACTORS.RENEWABLE_MULTIPLIER).toBeLessThan(1);
  });

  it('INPUT_LIMITS min values are non-negative', () => {
    expect(INPUT_LIMITS.TRANSPORT_KM_MIN).toBeGreaterThanOrEqual(0);
    expect(INPUT_LIMITS.MEALS_MIN).toBeGreaterThanOrEqual(0);
  });

  it('INPUT_LIMITS max exceeds min for all ranges', () => {
    expect(INPUT_LIMITS.TRANSPORT_KM_MAX).toBeGreaterThan(INPUT_LIMITS.TRANSPORT_KM_MIN);
    expect(INPUT_LIMITS.MEALS_MAX).toBeGreaterThan(INPUT_LIMITS.MEALS_MIN);
  });
});

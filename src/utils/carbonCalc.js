/**
 * @fileoverview Pure carbon emission calculation functions.
 * All values in kg CO₂ unless specified.
 * No side effects — easy to unit test.
 * @module utils/carbonCalc
 */

import { MAX_DAILY_CO2_KG, SCORE_THRESHOLDS, ENERGY_FACTORS } from './constants';

/**
 * Calculates transport CO₂ emissions.
 * @param {string} mode - Transport mode id
 * @param {number} km - Distance in kilometers
 * @param {Array<{ id: string, factor: number }>} modes - Transport modes array
 * @returns {number} CO₂ in kg, rounded to 2dp
 */
export function calcTransport(mode, km, modes) {
  const found = modes.find((m) => m.id === mode);
  if (!found) return 0;
  return Math.round(found.factor * km * 100) / 100;
}

/**
 * Calculates food CO₂ emissions.
 * @param {string} type - Food type id
 * @param {number} meals - Number of meals
 * @param {Array<{ id: string, factor: number }>} types - Food types array
 * @returns {number} CO₂ in kg, rounded to 2dp
 */
export function calcFood(type, meals, types) {
  const found = types.find((t) => t.id === type);
  if (!found) return 0;
  return Math.round(found.factor * meals * 100) / 100;
}

/**
 * Calculates energy CO₂ emissions.
 * Uses centralized emission factors from constants.
 * @param {number} acHours - AC usage in hours
 * @param {number} appHours - Appliance usage hours
 * @param {boolean} renewable - Whether renewable energy is used
 * @returns {number} CO₂ in kg, rounded to 2dp
 */
export function calcEnergy(acHours, appHours, renewable) {
  const raw = acHours * ENERGY_FACTORS.AC + appHours * ENERGY_FACTORS.APPLIANCES;
  const adjusted = renewable ? raw * ENERGY_FACTORS.RENEWABLE_MULTIPLIER : raw;
  return Math.round(adjusted * 100) / 100;
}

/**
 * Calculates shopping CO₂ emissions.
 * @param {string} type - Shopping type id
 * @param {number} spend - Spend in rupees
 * @param {Array<{ id: string, factor: number }>} types - Shopping types array
 * @returns {number} CO₂ in kg, rounded to 2dp
 */
export function calcShopping(type, spend, types) {
  const found = types.find((t) => t.id === type);
  if (!found) return 0;
  const per1000 = found.factor;
  return Math.round((spend / 1000) * per1000 * 100) / 100;
}

/**
 * Calculates total daily CO₂ from all categories.
 * @param {Object<string, number>} breakdown - Per-category values
 * @returns {number} Total CO₂ in kg
 */
export function calcTotal(breakdown) {
  return (
    Math.round(Object.values(breakdown).reduce((sum, val) => sum + val, 0) * 100) / 100
  );
}

/**
 * Calculates carbon score (0–100).
 * Lower emissions = higher score.
 * Uses MAX_DAILY_CO2_KG from constants (Indian avg ~7.5 kg CO₂/day).
 * @param {number} totalKg - Daily total in kg
 * @returns {number} Score 0–100
 */
export function calcScore(totalKg) {
  const score = Math.round((1 - Math.min(totalKg / MAX_DAILY_CO2_KG, 1)) * 100);
  return Math.max(0, Math.min(100, score));
}

/**
 * Formats a CO₂ value for display.
 * @param {number} value - Value in kg
 * @returns {string} Formatted string e.g. "2.40"
 */
export function formatCO2(value) {
  return value.toFixed(2);
}

/**
 * Clamps a numeric input within safe bounds.
 * Used to sanitize stepper and input values.
 * @param {number} value - Input value
 * @param {number} min - Minimum allowed
 * @param {number} max - Maximum allowed
 * @returns {number} Clamped value
 */
export function clampValue(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) return min;
  return Math.min(max, Math.max(min, num));
}

/**
 * Returns score label and color variant based on score thresholds.
 * Uses SCORE_THRESHOLDS from constants instead of hardcoded values.
 * @param {number} score - Score 0–100
 * @returns {{ label: string, variant: string }} Label text and color variant
 */
export function getScoreLabel(score) {
  if (score >= SCORE_THRESHOLDS.LOW_IMPACT) {
    return { label: 'Low Impact 🌿', variant: 'primary' };
  }
  if (score >= SCORE_THRESHOLDS.MODERATE_IMPACT) {
    return { label: 'Moderate Impact ⚡', variant: 'amber' };
  }
  return { label: 'High Impact ⚠️', variant: 'coral' };
}

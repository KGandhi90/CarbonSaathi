/**
 * @fileoverview Application-wide constants for CarbonSaathi.
 * Centralizes magic numbers to avoid scattered hardcoded values
 * across calculation logic, UI timing, and Firebase queries.
 * @module utils/constants
 */

// Carbon scoring
/** @type {number} Average daily CO₂ for urban Indians in kg */
export const MAX_DAILY_CO2_KG = 7.5;
/** @type {number} Maximum possible carbon score */
export const SCORE_MAX = 100;

/** @type {{ LOW_IMPACT: number, MODERATE_IMPACT: number }} Score tier thresholds */
export const SCORE_THRESHOLDS = {
  LOW_IMPACT: 70,
  MODERATE_IMPACT: 40,
};

/** @type {{ AC: number, APPLIANCES: number, RENEWABLE_MULTIPLIER: number }} Energy emission factors in kg CO₂/hour */
export const ENERGY_FACTORS = {
  AC: 0.5,
  APPLIANCES: 0.2,
  RENEWABLE_MULTIPLIER: 0.5,
};

/** @type {object} Input field bounds for sanitization */
export const INPUT_LIMITS = {
  TRANSPORT_KM_MIN: 0,
  TRANSPORT_KM_MAX: 500,
  MEALS_MIN: 1,
  MEALS_MAX: 5,
  HOURS_MIN: 0,
  HOURS_MAX: 24,
  SPEND_MIN: 0,
  SPEND_MAX: 999999,
};

// UI timing (milliseconds)
/** @type {number} Toast auto-dismiss duration */
export const TOAST_DURATION_MS = 5000;
/** @type {number} AI typing indicator simulation delay */
export const TYPING_SIMULATION_MS = 1000;
/** @type {number} Fact strip rotation interval */
export const FACT_ROTATION_MS = 5000;

// Firestore query limits
/** @type {number} Maximum recent logs fetched for dashboard */
export const RECENT_LOGS_LIMIT = 30;

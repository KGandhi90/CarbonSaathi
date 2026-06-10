/**
 * @fileoverview Manages the Log Activity page form state.
 * All calculations delegated to carbonCalc.js.
 * @module hooks/useLog
 */

import { useState, useCallback, useMemo } from 'react';
import {
  calcTransport,
  calcFood,
  calcEnergy,
  calcShopping,
  calcTotal,
  formatCO2,
  clampValue,
} from '../utils/carbonCalc';
import { trackEvent } from '../utils/analytics';
import { saveActivityLog } from '../api/firebase';

/**
 * Manages the Log Activity page form state.
 * All calculations delegated to carbonCalc.js pure functions.
 * @param {object} ctx - AppContext data
 * @param {Array} ctx.transportModes - Transport mode options
 * @param {Array} ctx.foodTypes - Food type options
 * @param {Array} ctx.shoppingTypes - Shopping category options
 * @returns {object} Log state, derived values, setters, and actions
 */
export function useLog({ transportModes, foodTypes, shoppingTypes }) {
  // Transport state
  const [transportMode, setTransportMode] = useState('metro');
  const [transportKm, setTransportKm] = useState(10);

  // Food state
  const [foodType, setFoodType] = useState('veg');
  const [foodMeals, setFoodMeals] = useState(3);

  // Energy state
  const [acHours, setAcHours] = useState(2);
  const [appHours, setAppHours] = useState(3);
  const [renewable, setRenewable] = useState(false);

  // Shopping state
  const [shoppingType, setShoppingType] = useState('none');
  const [shoppingSpend, setShoppingSpend] = useState(0);

  // UI state
  const [isSaved, setIsSaved] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // Derived CO₂ values — recalculated only when inputs change
  /** @type {number} Transport emissions in kg CO₂ */
  const transportCO2 = useMemo(
    () => calcTransport(transportMode, transportKm, transportModes),
    [transportMode, transportKm, transportModes]
  );

  /** @type {number} Food emissions in kg CO₂ */
  const foodCO2 = useMemo(
    () => calcFood(foodType, foodMeals, foodTypes),
    [foodType, foodMeals, foodTypes]
  );

  /** @type {number} Energy emissions in kg CO₂ */
  const energyCO2 = useMemo(
    () => calcEnergy(acHours, appHours, renewable),
    [acHours, appHours, renewable]
  );

  /** @type {number} Shopping emissions in kg CO₂ */
  const shoppingCO2 = useMemo(
    () => calcShopping(shoppingType, shoppingSpend, shoppingTypes),
    [shoppingType, shoppingSpend, shoppingTypes]
  );

  /** @type {number} Total daily emissions in kg CO₂ */
  const totalCO2 = useMemo(
    () => calcTotal({
      transport: transportCO2,
      food: foodCO2,
      energy: energyCO2,
      shopping: shoppingCO2,
    }),
    [transportCO2, foodCO2, energyCO2, shoppingCO2]
  );

  /**
   * Increments a numeric field by step, clamped to max.
   * @param {Function} setter - State setter function
   * @param {number} current - Current value
   * @param {number} max - Maximum allowed value
   * @param {number} [step=1] - Increment amount
   */
  const increment = useCallback((setter, current, max, step = 1) => {
    setter(clampValue(current + step, 0, max));
  }, []);

  /**
   * Decrements a numeric field by step, clamped to min.
   * @param {Function} setter - State setter function
   * @param {number} current - Current value
   * @param {number} min - Minimum allowed value
   * @param {number} [step=1] - Decrement amount
   */
  const decrement = useCallback((setter, current, min, step = 1) => {
    setter(clampValue(current - step, min, 999));
  }, []);

  /**
   * Handles direct numeric input with sanitization.
   * Strips non-numeric characters before setting.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   * @param {Function} setter - State setter function
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   */
  const handleNumericInput = useCallback((e, setter, min, max) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(raw);
    if (isNaN(parsed)) {
      setter(min);
      return;
    }
    setter(clampValue(parsed, min, max));
  }, []);

  /**
   * Saves the activity log entry.
   * Shows toast and fires GA event.
   */
  const saveLog = useCallback(() => {
    const entry = {
      transport: transportCO2,
      food: foodCO2,
      energy: energyCO2,
      shopping: shoppingCO2,
      total: totalCO2,
    };

    // Save to Firestore (non-blocking)
    saveActivityLog(entry);

    trackEvent('Log', 'ActivitySaved', `Total: ${totalCO2} kg`);

    setSaveToast(`Logged! Your CO₂ today: ${formatCO2(totalCO2)} kg 🌱`);
    setIsSaved(true);

    // Auto-dismiss toast after 3s
    setTimeout(() => setSaveToast(null), 3000);
  }, [transportCO2, foodCO2, energyCO2, shoppingCO2, totalCO2]);

  return {
    // State
    transportMode, transportKm,
    foodType, foodMeals,
    acHours, appHours, renewable,
    shoppingType, shoppingSpend,
    saveToast, isSaved,

    // Derived
    transportCO2, foodCO2,
    energyCO2, shoppingCO2, totalCO2,

    // Setters
    setTransportMode, setTransportKm,
    setFoodType, setFoodMeals,
    setAcHours, setAppHours, setRenewable,
    setShoppingType, setShoppingSpend,

    // Actions
    increment, decrement,
    handleNumericInput, saveLog,
  };
}

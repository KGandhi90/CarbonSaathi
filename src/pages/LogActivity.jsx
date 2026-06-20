/**
 * @fileoverview Log Activity page — track daily carbon emissions.
 * Displays the activity logging form across 4 categories:
 * Transport, Food, Energy, and Shopping. Calculates CO₂ emissions
 * live as the user fills in each field, then saves the entry to Firestore.
 * Uses ToggleGroup and Stepper components to eliminate markup duplication.
 * @module pages/LogActivity
 */

import { useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivitySection from '../components/ActivitySection';
import { ToggleGroup } from '../components/ToggleGroup';
import { Stepper } from '../components/Stepper';
import { useAppContext } from '../context/AppContext';
import { useLog } from '../hooks/useLog';
import { formatCO2 } from '../utils/carbonCalc';
import { INPUT_LIMITS } from '../utils/constants';

/**
 * Log Activity page component.
 * Renders the 4-category activity logging form with live CO₂ calculation.
 * @returns {React.ReactElement} Rendered log activity page
 */
function LogActivity() {
  const { transportModes, foodTypes, shoppingTypes } = useAppContext();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const headingRef = useRef(null);

  const {
    transportMode,
    transportKm,
    foodType,
    foodMeals,
    acHours,
    appHours,
    renewable,
    shoppingType,
    shoppingSpend,
    saveToast,
    isSaved,
    transportCO2,
    foodCO2,
    energyCO2,
    shoppingCO2,
    totalCO2,
    setTransportMode,
    setTransportKm,
    setFoodType,
    setFoodMeals,
    setAcHours,
    setAppHours,
    setRenewable,
    setShoppingType,
    setShoppingSpend,
    handleNumericInput,
    saveLog,
  } = useLog({ transportModes, foodTypes, shoppingTypes });

  // Focus heading on mount for accessibility
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Focus toast when it appears
  useEffect(() => {
    if (saveToast) {
      toastRef.current?.focus();
    }
  }, [saveToast]);

  // Navigate home after save toast dismisses
  useEffect(() => {
    if (isSaved && !saveToast) {
      navigate('/');
    }
  }, [isSaved, saveToast, navigate]);

  /**
   * Handles renewable energy checkbox toggle.
   */
  const handleRenewableToggle = useCallback(() => {
    setRenewable((prev) => !prev);
  }, [setRenewable]);

  /**
   * Handles shopping spend direct input with sanitization.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSpendInput = useCallback(
    (e) => {
      handleNumericInput(
        e,
        setShoppingSpend,
        INPUT_LIMITS.SPEND_MIN,
        INPUT_LIMITS.SPEND_MAX
      );
    },
    [handleNumericInput, setShoppingSpend]
  );

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <header>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-2xl sm:text-3xl text-dark outline-none"
        >
          Log Activity
        </h1>
        <p className="font-sans text-sm text-muted mt-1">Track what you did today</p>
      </header>

      {/* Live CO₂ Counter */}
      <div
        className="sticky z-10 bg-surface1/95 backdrop-blur-sm border border-surface3 rounded-2xl p-4 shadow-card"
        style={{ top: '72px' }}
        role="status"
        aria-label="Estimated CO₂ emissions today"
        aria-live="polite"
      >
        <p className="font-sans text-xs text-muted uppercase tracking-wide mb-2">
          Estimated CO₂ today
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-4xl font-medium text-primary transition-all duration-300">
            {formatCO2(totalCO2)}
          </span>
          <span className="font-mono text-sm text-muted">kg CO₂</span>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-amber/10 text-amber border-amber/20">
            {formatCO2(transportCO2)} kg
          </span>
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-secondary/10 text-secondary border-secondary/20">
            {formatCO2(foodCO2)} kg
          </span>
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-sky/10 text-sky border-sky/20">
            {formatCO2(energyCO2)} kg
          </span>
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-coral/10 text-coral border-coral/20">
            {formatCO2(shoppingCO2)} kg
          </span>
        </div>
      </div>

      {/* Transport Section */}
      <ActivitySection title="Transport" color="amber" icon="Car" subtotal={transportCO2}>
        <div className="mb-4">
          <ToggleGroup
            options={transportModes}
            selected={transportMode}
            onChange={setTransportMode}
            activeColor="amber"
            ariaLabel="Select transport mode"
          />
        </div>

        {/* Distance input */}
        <div className="flex items-center gap-3 mt-3">
          <label htmlFor="transport-distance" className="text-xs text-muted">
            Distance (km)
          </label>
          <Stepper
            value={transportKm}
            onChange={setTransportKm}
            min={INPUT_LIMITS.TRANSPORT_KM_MIN}
            max={INPUT_LIMITS.TRANSPORT_KM_MAX}
            label="Distance in kilometers"
            unit="km"
          />
        </div>

        {/* CO₂ result */}
        <p className="mt-3 font-mono text-sm text-primary">
          = {formatCO2(transportCO2)} kg CO₂
        </p>
      </ActivitySection>

      {/* Food Section */}
      <ActivitySection title="Food" color="secondary" icon="Leaf" subtotal={foodCO2}>
        <div className="mb-4">
          <ToggleGroup
            options={foodTypes}
            selected={foodType}
            onChange={setFoodType}
            activeColor="secondary"
            ariaLabel="Select food type"
          />
        </div>

        {/* Meals stepper */}
        <div className="flex items-center gap-3 mt-3">
          <label htmlFor="food-meals" className="text-xs text-muted">
            Number of meals
          </label>
          <Stepper
            value={foodMeals}
            onChange={setFoodMeals}
            min={INPUT_LIMITS.MEALS_MIN}
            max={INPUT_LIMITS.MEALS_MAX}
            label="Number of meals"
          />
        </div>
      </ActivitySection>

      {/* Energy Section */}
      <ActivitySection title="Energy" color="sky" icon="Zap" subtotal={energyCO2}>
        <div className="flex flex-col gap-3">
          {/* AC hours */}
          <div className="flex items-center justify-between">
            <label htmlFor="energy-ac" className="text-xs text-muted">
              AC used
            </label>
            <Stepper
              value={acHours}
              onChange={setAcHours}
              min={INPUT_LIMITS.HOURS_MIN}
              max={INPUT_LIMITS.HOURS_MAX}
              label="AC hours used"
            />
          </div>

          {/* Appliances hours */}
          <div className="flex items-center justify-between">
            <label htmlFor="energy-appliances" className="text-xs text-muted">
              Other appliances
            </label>
            <Stepper
              value={appHours}
              onChange={setAppHours}
              min={INPUT_LIMITS.HOURS_MIN}
              max={INPUT_LIMITS.HOURS_MAX}
              label="Appliance hours used"
            />
          </div>
        </div>

        {/* Renewable checkbox */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            id="renewable"
            checked={renewable}
            onChange={handleRenewableToggle}
            className="w-4 h-4 rounded border-surface3 text-primary"
            aria-describedby="renewable-desc"
          />
          <label htmlFor="renewable" className="text-sm text-dark">
            Used renewable energy today
          </label>
          <span id="renewable-desc" className="sr-only">
            Checking this applies a 50% reduction to energy emissions
          </span>
        </div>
      </ActivitySection>

      {/* Shopping Section */}
      <ActivitySection
        title="Shopping"
        color="coral"
        icon="ShoppingBag"
        subtotal={shoppingCO2}
      >
        <div className="mb-4">
          <ToggleGroup
            options={shoppingTypes}
            selected={shoppingType}
            onChange={setShoppingType}
            activeColor="coral"
            ariaLabel="Select shopping category"
          />
        </div>

        {/* Spend input */}
        <div className="mt-3">
          <label htmlFor="shopping-spend" className="text-xs text-muted block mb-2">
            Approx spend
          </label>
          <input
            id="shopping-spend"
            type="number"
            inputMode="numeric"
            placeholder="₹0"
            value={shoppingSpend}
            onChange={handleSpendInput}
            className="font-mono text-lg bg-surface2 rounded-xl px-4 py-3 w-full border border-surface3 text-dark"
            aria-label="Shopping spend in rupees"
          />
        </div>
      </ActivitySection>

      {/* Save Button */}
      <div className="sticky pb-4" style={{ bottom: '24px' }}>
        <button
          type="button"
          onClick={saveLog}
          disabled={isSaved}
          className={`w-full bg-primary text-white font-semibold text-sm rounded-2xl py-4 shadow-hero transition-colors duration-150 ${
            isSaved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
          aria-label="Save activity log"
        >
          Save Today&apos;s Log →
        </button>
      </div>

      {/* Toast notification */}
      {saveToast && (
        <div
          ref={toastRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bg-primary text-white rounded-2xl px-5 py-3 shadow-hero z-50 font-sans text-sm font-medium page-enter"
          style={{ bottom: '24px' }}
        >
          {saveToast}
        </div>
      )}
    </div>
  );
}

export default LogActivity;

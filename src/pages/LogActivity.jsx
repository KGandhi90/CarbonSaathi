/**
 * @fileoverview Log Activity page — track daily carbon emissions.
 * Contains sections for Transport, Food, Energy, and Shopping.
 * All calculations handled by useLog hook.
 * @module pages/LogActivity
 */

import { useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivitySection from '../components/ActivitySection';
import { useAppContext } from '../context/AppContext';
import { useLog } from '../hooks/useLog';
import { formatCO2 } from '../utils/carbonCalc';

/**
 * Log Activity page component.
 * @returns {React.ReactElement} Rendered log activity page
 */
function LogActivity() {
  const { transportModes, foodTypes, shoppingTypes } = useAppContext();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const headingRef = useRef(null);

  const {
    transportMode, transportKm,
    foodType, foodMeals,
    acHours, appHours, renewable,
    shoppingType, shoppingSpend,
    saveToast, isSaved,
    transportCO2, foodCO2,
    energyCO2, shoppingCO2, totalCO2,
    setTransportMode, setTransportKm,
    setFoodType, setFoodMeals,
    setAcHours, setAppHours, setRenewable,
    setShoppingType, setShoppingSpend,
    increment, decrement,
    handleNumericInput, saveLog,
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
   * Handles transport mode selection.
   * @param {string} modeId - Selected mode id
   */
  const handleTransportModeSelect = useCallback((modeId) => {
    setTransportMode(modeId);
  }, [setTransportMode]);

  /**
   * Handles food type selection.
   * @param {string} typeId - Selected food type id
   */
  const handleFoodTypeSelect = useCallback((typeId) => {
    setFoodType(typeId);
  }, [setFoodType]);

  /**
   * Handles shopping type selection.
   * @param {string} typeId - Selected shopping type id
   */
  const handleShoppingTypeSelect = useCallback((typeId) => {
    setShoppingType(typeId);
  }, [setShoppingType]);

  /**
   * Handles keyboard navigation for transport radio group.
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleTransportKeyDown = useCallback((e) => {
    const currentIndex = transportModes.findIndex((m) => m.id === transportMode);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % transportModes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + transportModes.length) % transportModes.length;
    }

    if (nextIndex !== currentIndex) {
      setTransportMode(transportModes[nextIndex].id);
    }
  }, [transportMode, transportModes, setTransportMode]);

  /**
   * Handles keyboard navigation for food radio group.
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleFoodKeyDown = useCallback((e) => {
    const currentIndex = foodTypes.findIndex((t) => t.id === foodType);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % foodTypes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + foodTypes.length) % foodTypes.length;
    }

    if (nextIndex !== currentIndex) {
      setFoodType(foodTypes[nextIndex].id);
    }
  }, [foodType, foodTypes, setFoodType]);

  /**
   * Handles keyboard navigation for shopping radio group.
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleShoppingKeyDown = useCallback((e) => {
    const currentIndex = shoppingTypes.findIndex((t) => t.id === shoppingType);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % shoppingTypes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + shoppingTypes.length) % shoppingTypes.length;
    }

    if (nextIndex !== currentIndex) {
      setShoppingType(shoppingTypes[nextIndex].id);
    }
  }, [shoppingType, shoppingTypes, setShoppingType]);

  // Stepper handlers — useCallback wrappers to avoid inline functions
  const handleTransportKmUp = useCallback(() => {
    increment(setTransportKm, transportKm, 500);
  }, [increment, setTransportKm, transportKm]);

  const handleTransportKmDown = useCallback(() => {
    decrement(setTransportKm, transportKm, 0);
  }, [decrement, setTransportKm, transportKm]);

  const handleTransportKmInput = useCallback((e) => {
    handleNumericInput(e, setTransportKm, 0, 500);
  }, [handleNumericInput, setTransportKm]);

  const handleFoodMealsUp = useCallback(() => {
    increment(setFoodMeals, foodMeals, 5);
  }, [increment, setFoodMeals, foodMeals]);

  const handleFoodMealsDown = useCallback(() => {
    decrement(setFoodMeals, foodMeals, 1);
  }, [decrement, setFoodMeals, foodMeals]);

  const handleFoodMealsInput = useCallback((e) => {
    handleNumericInput(e, setFoodMeals, 1, 5);
  }, [handleNumericInput, setFoodMeals]);

  const handleAcUp = useCallback(() => {
    increment(setAcHours, acHours, 24);
  }, [increment, setAcHours, acHours]);

  const handleAcDown = useCallback(() => {
    decrement(setAcHours, acHours, 0);
  }, [decrement, setAcHours, acHours]);

  const handleAcInput = useCallback((e) => {
    handleNumericInput(e, setAcHours, 0, 24);
  }, [handleNumericInput, setAcHours]);

  const handleAppUp = useCallback(() => {
    increment(setAppHours, appHours, 24);
  }, [increment, setAppHours, appHours]);

  const handleAppDown = useCallback(() => {
    decrement(setAppHours, appHours, 0);
  }, [decrement, setAppHours, appHours]);

  const handleAppInput = useCallback((e) => {
    handleNumericInput(e, setAppHours, 0, 24);
  }, [handleNumericInput, setAppHours]);

  const handleRenewableToggle = useCallback(() => {
    setRenewable((prev) => !prev);
  }, [setRenewable]);

  const handleSpendInput = useCallback((e) => {
    handleNumericInput(e, setShoppingSpend, 0, 999999);
  }, [handleNumericInput, setShoppingSpend]);

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
        <p className="font-sans text-sm text-muted mt-1">
          Track what you did today
        </p>
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
      <ActivitySection
        title="Transport"
        color="amber"
        icon="Car"
        subtotal={transportCO2}
      >
        {/* Mode toggle group */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="radiogroup"
          aria-label="Select transport mode"
          onKeyDown={handleTransportKeyDown}
        >
          {transportModes.map((mode) => {
            const isSelected = mode.id === transportMode;
            return (
              <button
                key={mode.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleTransportModeSelect(mode.id)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber text-white'
                    : 'bg-surface2 text-muted hover:bg-amber/10 hover:text-amber'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Distance input */}
        <div className="flex items-center gap-3 mt-3">
          <label htmlFor="transport-distance" className="text-xs text-muted">
            Distance (km)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Decrease distance"
              onClick={handleTransportKmDown}
            >
              −
            </button>
            <input
              id="transport-distance"
              type="number"
              min="0"
              max="500"
              value={transportKm}
              onChange={handleTransportKmInput}
              className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
              aria-label="Distance in kilometers"
            />
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Increase distance"
              onClick={handleTransportKmUp}
            >
              +
            </button>
          </div>
        </div>

        {/* CO₂ result */}
        <p className="mt-3 font-mono text-sm text-primary">
          = {formatCO2(transportCO2)} kg CO₂
        </p>
      </ActivitySection>

      {/* Food Section */}
      <ActivitySection
        title="Food"
        color="secondary"
        icon="Leaf"
        subtotal={foodCO2}
      >
        {/* Food type toggle */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="radiogroup"
          aria-label="Select food type"
          onKeyDown={handleFoodKeyDown}
        >
          {foodTypes.map((food) => {
            const isSelected = food.id === foodType;
            return (
              <button
                key={food.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleFoodTypeSelect(food.id)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-secondary text-white'
                    : 'bg-surface2 text-muted hover:bg-secondary/10 hover:text-secondary'
                }`}
              >
                {food.label}
              </button>
            );
          })}
        </div>

        {/* Meals stepper */}
        <div className="flex items-center gap-3 mt-3">
          <label htmlFor="food-meals" className="text-xs text-muted">
            Number of meals
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Decrease meals"
              onClick={handleFoodMealsDown}
            >
              −
            </button>
            <input
              id="food-meals"
              type="number"
              min="1"
              max="5"
              value={foodMeals}
              onChange={handleFoodMealsInput}
              className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
              aria-label="Number of meals"
            />
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Increase meals"
              onClick={handleFoodMealsUp}
            >
              +
            </button>
          </div>
        </div>
      </ActivitySection>

      {/* Energy Section */}
      <ActivitySection
        title="Energy"
        color="sky"
        icon="Zap"
        subtotal={energyCO2}
      >
        <div className="flex flex-col gap-3">
          {/* AC hours */}
          <div className="flex items-center justify-between">
            <label htmlFor="energy-ac" className="text-xs text-muted">
              AC used
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Decrease AC hours"
                onClick={handleAcDown}
              >
                −
              </button>
              <input
                id="energy-ac"
                type="number"
                min="0"
                max="24"
                value={acHours}
                onChange={handleAcInput}
                className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
                aria-label="AC hours used"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Increase AC hours"
                onClick={handleAcUp}
              >
                +
              </button>
            </div>
          </div>

          {/* Appliances hours */}
          <div className="flex items-center justify-between">
            <label htmlFor="energy-appliances" className="text-xs text-muted">
              Other appliances
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Decrease appliance hours"
                onClick={handleAppDown}
              >
                −
              </button>
              <input
                id="energy-appliances"
                type="number"
                min="0"
                max="24"
                value={appHours}
                onChange={handleAppInput}
                className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
                aria-label="Appliance hours"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Increase appliance hours"
                onClick={handleAppUp}
              >
                +
              </button>
            </div>
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
        {/* Type toggle */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="radiogroup"
          aria-label="Select shopping category"
          onKeyDown={handleShoppingKeyDown}
        >
          {shoppingTypes.map((type) => {
            const isSelected = type.id === shoppingType;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleShoppingTypeSelect(type.id)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-coral text-white'
                    : 'bg-surface2 text-muted hover:bg-coral/10 hover:text-coral'
                }`}
              >
                {type.label}
              </button>
            );
          })}
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
            isSaved
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary/90'
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

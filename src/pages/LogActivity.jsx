/**
 * @fileoverview Log Activity page — track daily carbon emissions.
 * Contains sections for Transport, Food, Energy, and Shopping.
 * @module pages/LogActivity
 */

import ActivitySection from '../components/ActivitySection';
import {
  transportModes,
  foodTypes,
  shoppingTypes,
} from '../data/mockData';

/**
 * Default selected transport mode ID.
 * @type {string}
 */
const DEFAULT_TRANSPORT = 'car';

/**
 * Default selected food type ID.
 * @type {string}
 */
const DEFAULT_FOOD = 'veg';

/**
 * Default selected shopping category ID.
 * @type {string}
 */
const DEFAULT_SHOPPING = 'none';

/**
 * No-op handler for save action.
 * Will be wired in Phase 2.
 */
const handleSave = () => {};

/**
 * Log Activity page component.
 * @returns {React.ReactElement} Rendered log activity page
 */
function LogActivity() {
  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <header>
        <h1 className="font-display text-2xl sm:text-3xl text-dark">
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
          <span className="font-mono text-4xl font-medium text-primary">
            2.40
          </span>
          <span className="font-mono text-sm text-muted">kg CO₂</span>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-amber/10 text-amber border-amber/20">
            0.80 kg
          </span>
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-secondary/10 text-secondary border-secondary/20">
            0.60 kg
          </span>
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-sky/10 text-sky border-sky/20">
            0.70 kg
          </span>
          <span className="font-mono text-xs rounded-full px-2.5 py-1 border font-medium bg-coral/10 text-coral border-coral/20">
            0.30 kg
          </span>
        </div>
      </div>

      {/* Transport Section */}
      <ActivitySection
        title="Transport"
        color="amber"
        icon="Car"
        subtotal={0.80}
      >
        {/* Mode toggle group */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="radiogroup"
          aria-label="Select transport mode"
        >
          {transportModes.map((mode) => {
            const isSelected = mode.id === DEFAULT_TRANSPORT;
            return (
              <button
                key={mode.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
          <label
            htmlFor="transport-distance"
            className="text-xs text-muted"
          >
            Distance (km)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Decrease distance"
            >
              −
            </button>
            <input
              id="transport-distance"
              type="number"
              min="0"
              max="500"
              defaultValue={10}
              className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
              aria-label="Distance in kilometers"
            />
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Increase distance"
            >
              +
            </button>
          </div>
        </div>

        {/* CO₂ result */}
        <p className="mt-3 font-mono text-sm text-primary">
          = 0.80 kg CO₂
        </p>
      </ActivitySection>

      {/* Food Section */}
      <ActivitySection
        title="Food"
        color="secondary"
        icon="Leaf"
        subtotal={0.60}
      >
        {/* Food type toggle */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="radiogroup"
          aria-label="Select food type"
        >
          {foodTypes.map((food) => {
            const isSelected = food.id === DEFAULT_FOOD;
            return (
              <button
                key={food.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
          <label
            htmlFor="food-meals"
            className="text-xs text-muted"
          >
            Number of meals
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Decrease meals"
            >
              −
            </button>
            <input
              id="food-meals"
              type="number"
              min="1"
              max="5"
              defaultValue={3}
              className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
              aria-label="Number of meals"
            />
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
              aria-label="Increase meals"
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
        subtotal={0.70}
      >
        <div className="flex flex-col gap-3">
          {/* AC hours */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="energy-ac"
              className="text-xs text-muted"
            >
              AC used
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Decrease AC hours"
              >
                −
              </button>
              <input
                id="energy-ac"
                type="number"
                min="0"
                max="24"
                defaultValue={4}
                className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
                aria-label="AC hours used"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Increase AC hours"
              >
                +
              </button>
            </div>
          </div>

          {/* Appliances hours */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="energy-appliances"
              className="text-xs text-muted"
            >
              Other appliances
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Decrease appliance hours"
              >
                −
              </button>
              <input
                id="energy-appliances"
                type="number"
                min="0"
                max="24"
                defaultValue={6}
                className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
                aria-label="Appliance hours"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors"
                aria-label="Increase appliance hours"
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
        subtotal={0.30}
      >
        {/* Type toggle */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="radiogroup"
          aria-label="Select shopping category"
        >
          {shoppingTypes.map((type) => {
            const isSelected = type.id === DEFAULT_SHOPPING;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
          <label
            htmlFor="shopping-spend"
            className="text-xs text-muted block mb-2"
          >
            Approx spend
          </label>
          <input
            id="shopping-spend"
            type="number"
            inputMode="numeric"
            placeholder="₹0"
            defaultValue={0}
            className="font-mono text-lg bg-surface2 rounded-xl px-4 py-3 w-full border border-surface3 text-dark"
            aria-label="Shopping spend in rupees"
          />
        </div>
      </ActivitySection>

      {/* Save Button */}
      <div className="sticky pb-4" style={{ bottom: '24px' }}>
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl py-4 shadow-hero transition-colors duration-150"
          aria-label="Save activity log"
        >
          Save Today&apos;s Log →
        </button>
      </div>
    </div>
  );
}

export default LogActivity;

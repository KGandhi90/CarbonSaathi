/**
 * @fileoverview Reusable numeric stepper input with +/- buttons.
 * Eliminates stepper markup duplication across LogActivity sections.
 * Sanitizes all direct input to prevent invalid values.
 * @module components/Stepper
 */

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { clampValue } from '../utils/carbonCalc';

/**
 * Numeric stepper input with increment/decrement buttons
 * and sanitized direct text input. Used for distance, meals,
 * and hours fields in the activity logging form.
 * @param {object} props - Component props
 * @param {number} props.value - Current numeric value
 * @param {Function} props.onChange - Value change handler
 * @param {number} props.min - Minimum allowed value
 * @param {number} props.max - Maximum allowed value
 * @param {number} [props.step=1] - Increment/decrement step size
 * @param {string} props.label - Accessible label for the input
 * @param {string} [props.unit] - Optional unit suffix displayed after input
 * @returns {React.ReactElement} Rendered stepper control
 */
export function Stepper({ value, onChange, min, max, step = 1, label, unit = '' }) {
  /**
   * Increments the value by step, clamped to max.
   */
  const handleIncrement = useCallback(() => {
    onChange(clampValue(value + step, min, max));
  }, [value, onChange, min, max, step]);

  /**
   * Decrements the value by step, clamped to min.
   */
  const handleDecrement = useCallback(() => {
    onChange(clampValue(value - step, min, max));
  }, [value, onChange, min, max, step]);

  /**
   * Sanitizes and parses direct numeric input.
   * Strips non-numeric characters before clamping to bounds.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = useCallback(
    (e) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(raw);
      onChange(isNaN(parsed) ? min : clampValue(parsed, min, max));
    },
    [onChange, min, max]
  );

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        aria-label={`Decrease ${label}`}
        className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors duration-150"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        aria-label={label}
        className="w-20 text-center font-mono text-lg text-dark bg-surface2 rounded-xl px-2 py-2 border border-surface3"
      />
      <button
        type="button"
        onClick={handleIncrement}
        aria-label={`Increase ${label}`}
        className="w-8 h-8 rounded-lg bg-surface2 text-dark font-mono flex items-center justify-center hover:bg-surface3 transition-colors duration-150"
      >
        +
      </button>
      {unit && <span className="text-xs text-muted font-sans">{unit}</span>}
    </div>
  );
}

Stepper.propTypes = {
  /** Current numeric value */
  value: PropTypes.number.isRequired,
  /** Value change handler */
  onChange: PropTypes.func.isRequired,
  /** Minimum allowed value */
  min: PropTypes.number.isRequired,
  /** Maximum allowed value */
  max: PropTypes.number.isRequired,
  /** Increment/decrement step size */
  step: PropTypes.number,
  /** Accessible label for the input */
  label: PropTypes.string.isRequired,
  /** Optional unit suffix */
  unit: PropTypes.string,
};

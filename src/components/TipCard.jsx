/**
 * @fileoverview Displays a single action tip with CO₂ savings estimate.
 * @module components/TipCard
 */

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Circle, CheckCircle } from 'lucide-react';

/**
 * Maps tip color names to border-left Tailwind classes.
 * @type {Record<string, string>}
 */
const BORDER_COLOR_MAP = {
  secondary: 'border-l-secondary',
  amber:     'border-l-amber',
  sky:       'border-l-sky',
};

/**
 * Maps tip color names to dot background Tailwind classes.
 * @type {Record<string, string>}
 */
const DOT_COLOR_MAP = {
  secondary: 'bg-secondary',
  amber:     'bg-amber',
  sky:       'bg-sky',
};

/**
 * Displays a single action tip with CO₂ savings estimate.
 * @param {object} props - Component props
 * @param {object} props.tip - Tip data object
 * @param {Function} props.onComplete - Mark done handler (receives tip id)
 * @returns {React.ReactElement} Rendered tip card
 */
function TipCard({ tip, onComplete }) {
  const borderClass = BORDER_COLOR_MAP[tip.color] || 'border-l-muted';
  const dotClass = DOT_COLOR_MAP[tip.color] || 'bg-muted';

  /**
   * Handles tip completion click, passing tip ID to parent.
   */
  const handleComplete = useCallback(() => {
    onComplete(tip.id);
  }, [onComplete, tip.id]);

  return (
    <div className={`bg-surface1 border-l-4 ${borderClass} rounded-xl p-4 flex items-center gap-3 shadow-card`}>
      {/* Color dot */}
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`}
        aria-hidden="true"
      />

      {/* Tip content */}
      <div className="flex-1">
        <p className="text-sm font-medium text-dark">
          {tip.text}
        </p>
        <span className="inline-flex items-center gap-1 text-xs text-muted font-mono mt-1">
          Saves {tip.saving} kg CO₂
        </span>
      </div>

      {/* Checkmark button */}
      <button
        type="button"
        onClick={handleComplete}
        aria-label={`Mark tip as complete: ${tip.text}`}
        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors duration-150 ${
          tip.done
            ? 'bg-secondary border-secondary'
            : 'bg-transparent border-surface3 hover:border-secondary'
        }`}
      >
        {tip.done ? (
          <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
        ) : (
          <Circle className="w-4 h-4 text-muted" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

TipCard.propTypes = {
  /** Tip data object */
  tip: PropTypes.shape({
    id:     PropTypes.number.isRequired,
    text:   PropTypes.string.isRequired,
    saving: PropTypes.number.isRequired,
    color:  PropTypes.string.isRequired,
    done:   PropTypes.bool.isRequired,
  }).isRequired,
  /** Handler when tip is marked complete */
  onComplete: PropTypes.func.isRequired,
};

export default TipCard;

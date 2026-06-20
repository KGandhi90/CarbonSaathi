/**
 * @fileoverview Reusable radio-style toggle button group.
 * Eliminates toggle markup duplication across LogActivity sections
 * for transport mode, food type, and shopping category selection.
 * @module components/ToggleGroup
 */

import { useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Static mapping of active state styles per color.
 * Uses pre-built class strings because Tailwind cannot
 * resolve dynamically interpolated class names.
 * @type {Object<string, string>}
 */
const ACTIVE_STYLES = {
  amber: 'bg-amber text-white',
  secondary: 'bg-secondary text-white',
  coral: 'bg-coral text-white',
};

/**
 * Static mapping of inactive hover styles per color.
 * @type {Object<string, string>}
 */
const INACTIVE_STYLES = {
  amber: 'hover:bg-amber/10 hover:text-amber',
  secondary: 'hover:bg-secondary/10 hover:text-secondary',
  coral: 'hover:bg-coral/10 hover:text-coral',
};

/** @type {string} Shared button base classes */
const BASE_CLASS = 'rounded-xl px-3 py-2 text-xs font-medium transition-all';

/**
 * Reusable radio-style toggle button group component.
 * Provides full keyboard navigation (arrow keys) and ARIA radiogroup semantics.
 * @param {object} props - Component props
 * @param {Array<{ id: string, label: string }>} props.options - Selectable options
 * @param {string} props.selected - Currently selected option id
 * @param {Function} props.onChange - Callback receiving the newly selected id
 * @param {string} props.activeColor - Color key for active state ('amber'|'secondary'|'coral')
 * @param {string} props.ariaLabel - Accessible label for the radiogroup
 * @returns {React.ReactElement} Rendered toggle group
 */
export function ToggleGroup({ options, selected, onChange, activeColor, ariaLabel }) {
  /**
   * Handles arrow-key navigation between radio options.
   * ArrowRight/Down moves forward, ArrowLeft/Up moves backward.
   * @param {React.KeyboardEvent} e - Keyboard event
   * @param {number} index - Current option index
   */
  const handleKeyDown = useCallback(
    (e, index) => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();

      const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
      const nextIndex = forward
        ? (index + 1) % options.length
        : (index - 1 + options.length) % options.length;

      onChange(options[nextIndex].id);
    },
    [options, onChange]
  );

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option, index) => {
        const isActive = selected === option.id;
        const colorClass = isActive
          ? ACTIVE_STYLES[activeColor]
          : `bg-surface2 text-muted ${INACTIVE_STYLES[activeColor]}`;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`${BASE_CLASS} ${colorClass}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

ToggleGroup.propTypes = {
  /** Selectable options with id and label */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Currently selected option id */
  selected: PropTypes.string.isRequired,
  /** Selection change handler */
  onChange: PropTypes.func.isRequired,
  /** Color key for active state */
  activeColor: PropTypes.string.isRequired,
  /** Accessible label for the radiogroup */
  ariaLabel: PropTypes.string.isRequired,
};

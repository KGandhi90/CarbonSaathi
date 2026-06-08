/**
 * @fileoverview Colored status badge component.
 * @module components/StatusBadge
 */

import PropTypes from 'prop-types';

/**
 * Maps variant names to Tailwind class strings.
 * @type {Record<string, string>}
 */
const VARIANT_CLASSES = {
  primary:   'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
  coral:     'bg-coral/10 text-coral border border-coral/20',
  amber:     'bg-amber/10 text-amber border border-amber/20',
  sky:       'bg-sky/10 text-sky border border-sky/20',
  muted:     'bg-surface3 text-muted border border-surface3',
};

/**
 * Colored status badge component.
 * @param {object} props - Component props
 * @param {string} props.label - Display text
 * @param {string} props.variant - Color variant
 * @returns {React.ReactElement} Rendered badge
 */
function StatusBadge({ label, variant }) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.muted;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans ${variantClass}`}
    >
      {label}
    </span>
  );
}

StatusBadge.propTypes = {
  /** Display text */
  label: PropTypes.string.isRequired,
  /** Color variant */
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'coral',
    'amber',
    'sky',
    'muted',
  ]).isRequired,
};

export default StatusBadge;

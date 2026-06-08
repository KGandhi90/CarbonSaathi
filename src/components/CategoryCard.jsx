/**
 * @fileoverview Displays carbon breakdown for one category.
 * @module components/CategoryCard
 */

import PropTypes from 'prop-types';
import { Car, Leaf, Zap, ShoppingBag } from 'lucide-react';

/**
 * Maps icon name strings to Lucide icon components.
 * @type {Record<string, React.ComponentType>}
 */
const ICON_MAP = {
  Car,
  Leaf,
  Zap,
  ShoppingBag,
};

/**
 * Maps color name strings to Tailwind background classes.
 * @type {Record<string, string>}
 */
const BAR_COLOR_MAP = {
  amber:     'bg-amber',
  secondary: 'bg-secondary',
  sky:       'bg-sky',
  coral:     'bg-coral',
};

/**
 * Maps color name strings to icon text color classes.
 * @type {Record<string, string>}
 */
const ICON_COLOR_MAP = {
  amber:     'text-amber',
  secondary: 'text-secondary',
  sky:       'text-sky',
  coral:     'text-coral',
};

/**
 * Maps trend direction to display symbol and color.
 * @type {Record<string, { symbol: string, className: string }>}
 */
const TREND_MAP = {
  up:     { symbol: '↑', className: 'text-coral' },
  down:   { symbol: '↓', className: 'text-secondary' },
  stable: { symbol: '→', className: 'text-muted' },
};

/**
 * Displays carbon breakdown for one category.
 * @param {object} props - Component props
 * @param {object} props.category - Category data object
 * @returns {React.ReactElement} Rendered category card
 */
function CategoryCard({ category }) {
  const IconComponent = ICON_MAP[category.icon];
  const trend = TREND_MAP[category.trend];
  const barColor = BAR_COLOR_MAP[category.color] || 'bg-muted';
  const iconColor = ICON_COLOR_MAP[category.color] || 'text-muted';

  return (
    <div className="bg-surface1 border border-surface3 rounded-2xl p-4 shadow-card pressable">
      {/* Top row: icon + label and trend */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {IconComponent && (
            <IconComponent
              className={`w-4 h-4 ${iconColor}`}
              aria-hidden="true"
            />
          )}
          <span className="text-xs font-medium text-muted font-sans uppercase tracking-wide">
            {category.label}
          </span>
        </div>
        <span className={`text-xs font-mono ${trend.className}`} aria-label={`Trend: ${category.trend}`}>
          {trend.symbol}
        </span>
      </div>

      {/* Value */}
      <div>
        <span className="font-mono text-2xl font-medium text-dark">
          {category.value}
        </span>
        <span className="font-mono text-xs text-muted ml-1">
          {category.unit}
        </span>
      </div>

      {/* Mini progress bar */}
      <div className="w-full h-1.5 bg-surface3 rounded-full mt-3" role="progressbar" aria-valuenow={category.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${category.label}: ${category.percent}% of daily emissions`}>
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${category.percent}%` }}
        />
      </div>
    </div>
  );
}

CategoryCard.propTypes = {
  /** Category data object */
  category: PropTypes.shape({
    id:      PropTypes.string.isRequired,
    label:   PropTypes.string.isRequired,
    value:   PropTypes.number.isRequired,
    unit:    PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    trend:   PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
    color:   PropTypes.string.isRequired,
    icon:    PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoryCard;

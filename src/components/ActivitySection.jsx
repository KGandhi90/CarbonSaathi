/**
 * @fileoverview Collapsible section for one activity category
 * in the Log Activity page.
 * @module components/ActivitySection
 */

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { Car, Leaf, Zap, ShoppingBag, ChevronDown } from 'lucide-react';

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
 * Maps color names to icon container background classes.
 * @type {Record<string, string>}
 */
const BG_COLOR_MAP = {
  amber:     'bg-amber/10',
  secondary: 'bg-secondary/10',
  sky:       'bg-sky/10',
  coral:     'bg-coral/10',
};

/**
 * Maps color names to icon text color classes.
 * @type {Record<string, string>}
 */
const TEXT_COLOR_MAP = {
  amber:     'text-amber',
  secondary: 'text-secondary',
  sky:       'text-sky',
  coral:     'text-coral',
};

/**
 * Collapsible section for one activity category.
 * @param {object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.color - Theme color name
 * @param {string} props.icon - Lucide icon name
 * @param {number} props.subtotal - Running CO₂ subtotal
 * @param {React.ReactNode} props.children - Form inputs
 * @returns {React.ReactElement} Rendered activity section
 */
function ActivitySection({ title, color, icon, subtotal, children }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const IconComponent = ICON_MAP[icon];
  const bgClass = BG_COLOR_MAP[color] || 'bg-surface2';
  const textClass = TEXT_COLOR_MAP[color] || 'text-muted';
  const sectionId = `activity-section-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="bg-surface1 border border-surface3 rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <button
        type="button"
        className="flex items-center gap-3 p-4 w-full cursor-pointer text-left"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={sectionId}
      >
        {/* Icon block */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass}`}
          aria-hidden="true"
        >
          {IconComponent && (
            <IconComponent className={`w-4 h-4 ${textClass}`} />
          )}
        </div>

        {/* Title */}
        <span className="text-sm font-semibold text-dark font-sans">
          {title}
        </span>

        {/* Subtotal pill */}
        <span className="ml-auto mr-2 font-mono text-xs bg-surface2 text-primary rounded-full px-2.5 py-1 border border-surface3">
          {subtotal.toFixed(2)} kg
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div
          id={sectionId}
          className="border-t border-surface3 p-4"
          role="region"
          aria-label={`${title} activity inputs`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

ActivitySection.propTypes = {
  /** Section title */
  title:    PropTypes.string.isRequired,
  /** Theme color name */
  color:    PropTypes.string.isRequired,
  /** Lucide icon name */
  icon:     PropTypes.string.isRequired,
  /** Running CO₂ subtotal in kg */
  subtotal: PropTypes.number.isRequired,
  /** Form input children */
  children: PropTypes.node.isRequired,
};

export default ActivitySection;

/**
 * @fileoverview Manages tip completion state on Dashboard.
 * @module hooks/useTips
 */

import { useState, useCallback, useMemo } from 'react';
import { tips as mockTips } from '../data/mockData';
import { trackEvent } from '../utils/analytics';

/**
 * @typedef {Object} TipsState
 * @property {Array} tips - Current tips with done state
 * @property {number} completedCount - Number of completed tips
 * @property {number} totalSavings - Total CO₂ savings from completed tips
 */

/**
 * @typedef {Object} TipsActions
 * @property {Function} completeTip - Marks a tip as complete
 */

/**
 * Manages tip completion state on Dashboard.
 * @returns {TipsState & TipsActions}
 */
export function useTips() {
  const [tips, setTips] = useState(() => mockTips.map((t) => ({ ...t, done: false })));

  /**
   * Marks a tip as complete by id.
   * Fires GA event on completion.
   * @param {number} tipId - Tip identifier
   */
  const completeTip = useCallback((tipId) => {
    setTips((prev) => {
      const tip = prev.find((t) => t.id === tipId);
      if (tip && !tip.done) {
        trackEvent('Dashboard', 'TipCompleted', tip.text);
      }
      return prev.map((t) => (t.id === tipId ? { ...t, done: true } : t));
    });
  }, []);

  /** @type {number} Number of completed tips */
  const completedCount = useMemo(() => tips.filter((t) => t.done).length, [tips]);

  /** @type {number} Total CO₂ savings from completed tips in kg */
  const totalSavings = useMemo(
    () => tips.filter((t) => t.done).reduce((sum, t) => sum + t.saving, 0),
    [tips]
  );

  return { tips, completeTip, completedCount, totalSavings };
}

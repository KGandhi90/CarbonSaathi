/**
 * @fileoverview Fetches and computes real-time dashboard data from Firebase.
 * Uses getRecentLogs() with client-side filtering to avoid Firestore index
 * requirements. Falls back to zero/empty state gracefully.
 * @module hooks/useDashboard
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getRecentLogs } from '../api/firebase';
import { calcScore, getScoreLabel, formatCO2 } from '../utils/carbonCalc';
import { getGreeting } from '../utils/helpers';
import { todayBreakdown as mockBreakdown } from '../data/mockData';

/**
 * Checks if a given JS Date is calendar-today.
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is today
 */
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Converts a Firestore Timestamp, Date, or ISO string to a JS Date.
 * @param {object|string|Date} ts - Timestamp value from Firestore
 * @returns {Date} JS Date object
 */
function toDate(ts) {
  if (!ts) return new Date(0);
  if (typeof ts.toDate === 'function') return ts.toDate(); // Firestore Timestamp
  if (ts instanceof Date) return ts;
  return new Date(ts); // ISO string fallback
}

/**
 * @typedef {object} DashboardState
 * @property {boolean} isLoading - True while Firebase data is loading
 * @property {boolean} hasRealData - True if any Firestore logs exist
 * @property {Array<object>} categoryBreakdown - Per-category CO₂ data for today
 * @property {Array<object>} weeklyChartData - 7-day chart data array
 * @property {number} todayTotal - Today's total CO₂ in kg
 * @property {number} weeklyTotal - This week's summed CO₂ in kg
 * @property {number} monthlyTotal - This month's summed CO₂ in kg
 * @property {number} score - Carbon score 0–100
 * @property {{ label: string, variant: string }} scoreLabel - Score label
 * @property {string} greeting - Time-based greeting string
 * @property {string} formattedToday - Formatted today string
 * @property {string} formattedWeekly - Formatted weekly string
 * @property {string} formattedMonthly - Formatted monthly string
 */

/**
 * Fetches real dashboard data from Firebase via getRecentLogs,
 * then derives all required values with client-side filtering.
 * Re-fetches every time the user navigates to the dashboard.
 * @returns {DashboardState}
 */
export function useDashboard() {
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    /**
     * Fetches the last 30 logs from Firestore.
     * All date math happens client-side so no composite index is needed.
     */
    async function fetchLogs() {
      setIsLoading(true);
      try {
        const logs = await getRecentLogs();
        setAllLogs(logs);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Dashboard fetch error:', err);
        setAllLogs([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
  }, [location.key]); // Re-fetch every time user navigates to this page

  /**
   * Most recent log from today, or null if none.
   * @type {object|null}
   */
  const todayLog = useMemo(() => {
    if (!allLogs.length) return null;
    const found = allLogs.find((log) => isToday(toDate(log.timestamp)));
    return found || null;
  }, [allLogs]);

  /**
   * Logs from the last 7 calendar days, grouped to one entry per day.
   * @type {Array<{ day: string, value: number, isToday: boolean }>}
   */
  const weeklyChartData = useMemo(() => {
    // Build a skeleton of the last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3),
        value: 0,
        isToday: isToday(d),
        _date: d,
      };
    });

    // Mark the cutoff: 6 days ago at midnight
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 6);
    cutoff.setHours(0, 0, 0, 0);

    // Sum logs into matching day slots
    allLogs.forEach((log) => {
      const logDate = toDate(log.timestamp);
      if (logDate < cutoff) return; // older than 7 days

      const dayLabel = logDate
        .toLocaleDateString('en-IN', { weekday: 'short' })
        .slice(0, 3);

      const slot = days.find((d) => d.day === dayLabel);
      if (slot) {
        // Accumulate — user may log multiple times per day
        slot.value = Math.round((slot.value + (log.total || 0)) * 10) / 10;
      }
    });

    // Strip the internal _date field before returning
    return days.map(({ day, value, isToday: it }) => ({ day, value, isToday: it }));
  }, [allLogs]);

  /**
   * Total CO₂ from all logs in the current calendar month.
   * @type {number}
   */
  const monthlyTotal = useMemo(() => {
    const now = new Date();
    return allLogs.reduce((sum, log) => {
      const d = toDate(log.timestamp);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        return sum + (log.total || 0);
      }
      return sum;
    }, 0);
  }, [allLogs]);

  /**
   * Weekly total summed from chart data.
   * @type {number}
   */
  const weeklyTotal = useMemo(
    () => weeklyChartData.reduce((sum, d) => sum + d.value, 0),
    [weeklyChartData]
  );

  /**
   * Category breakdown from today's log, or zeroed-out structure.
   * @type {Array<object>}
   */
  const categoryBreakdown = useMemo(() => {
    if (!todayLog) {
      return mockBreakdown.map((cat) => ({
        ...cat,
        value: 0,
        percent: 0,
        trend: 'stable',
      }));
    }

    const total = todayLog.total || 0;
    const categories = [
      {
        id: 'transport',
        label: 'Transport',
        value: todayLog.transport || 0,
        icon: 'Car',
        color: 'amber',
      },
      {
        id: 'food',
        label: 'Food',
        value: todayLog.food || 0,
        icon: 'Leaf',
        color: 'secondary',
      },
      {
        id: 'energy',
        label: 'Energy',
        value: todayLog.energy || 0,
        icon: 'Zap',
        color: 'sky',
      },
      {
        id: 'shopping',
        label: 'Shopping',
        value: todayLog.shopping || 0,
        icon: 'ShoppingBag',
        color: 'coral',
      },
    ];

    return categories.map((cat) => ({
      ...cat,
      unit: 'kg CO₂',
      percent: total > 0 ? Math.round((cat.value / total) * 100) : 0,
      trend: 'stable',
    }));
  }, [todayLog]);

  const hasRealData = allLogs.length > 0;
  const todayTotal = todayLog?.total || 0;
  const score = calcScore(todayTotal);
  const scoreLabel = getScoreLabel(score);
  const greeting = getGreeting();

  return {
    isLoading,
    hasRealData,
    categoryBreakdown,
    weeklyChartData,
    todayTotal: Math.round(todayTotal * 100) / 100,
    weeklyTotal: Math.round(weeklyTotal * 100) / 100,
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    score,
    scoreLabel,
    greeting,
    formattedToday: formatCO2(todayTotal),
    formattedWeekly: formatCO2(weeklyTotal),
    formattedMonthly: formatCO2(monthlyTotal),
  };
}

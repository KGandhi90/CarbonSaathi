/**
 * @fileoverview Fetches and computes real-time dashboard data from Firebase.
 * Falls back to zero/empty state gracefully when no logs exist yet.
 * @module hooks/useDashboard
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getTodayLog, getWeeklyLogs, getMonthlyTotal } from '../api/firebase';
import { calcScore, getScoreLabel, formatCO2 } from '../utils/carbonCalc';
import { getGreeting } from '../utils/helpers';
import { todayBreakdown as mockBreakdown } from '../data/mockData';

/**
 * Checks if a given date is today.
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
 * @typedef {object} DashboardState
 * @property {boolean} isLoading - True while Firebase data is loading
 * @property {boolean} hasRealData - True if any Firestore logs exist
 * @property {Array<object>} categoryBreakdown - Per-category CO₂ data
 * @property {Array<object>} weeklyChartData - 7-day chart data
 * @property {number} todayTotal - Today's total CO₂ in kg
 * @property {number} weeklyTotal - This week's total CO₂ in kg
 * @property {number} monthlyTotal - This month's total CO₂ in kg
 * @property {number} score - Carbon score 0–100
 * @property {{ label: string, variant: string }} scoreLabel - Score label info
 * @property {string} greeting - Time-based greeting string
 * @property {string} formattedToday - Formatted today total string
 * @property {string} formattedWeekly - Formatted weekly total string
 * @property {string} formattedMonthly - Formatted monthly total string
 */

/**
 * Fetches and computes real dashboard data from Firebase activity logs.
 * Re-fetches on every navigation to the dashboard via location.key.
 * @returns {DashboardState} Processed dashboard data and loading state
 */
export function useDashboard() {
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [todayLog, setTodayLog] = useState(null);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    /**
     * Fetches all dashboard data in parallel.
     * Uses Promise.allSettled so one failure doesn't block the others.
     */
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [todayResult, weeklyResult, monthlyResult] =
          await Promise.allSettled([
            getTodayLog(),
            getWeeklyLogs(),
            getMonthlyTotal(),
          ]);

        const today =
          todayResult.status === 'fulfilled' ? todayResult.value : null;
        const weekly =
          weeklyResult.status === 'fulfilled' ? weeklyResult.value : [];
        const monthly =
          monthlyResult.status === 'fulfilled' ? monthlyResult.value : 0;

        setTodayLog(today);
        setWeeklyLogs(weekly);
        setMonthlyTotal(monthly);
        setHasRealData(today !== null || weekly.length > 0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [location.key]); // Re-fetch every time user navigates to dashboard

  /**
   * Today's category breakdown.
   * Uses real log if available, else shows zeros (not mock data).
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
      percent:
        total > 0 ? Math.round((cat.value / total) * 100) : 0,
      trend: 'stable',
    }));
  }, [todayLog]);

  /**
   * Weekly chart data — all 7 days of the current week.
   * Days without logs show value: 0, not missing bars.
   * @type {Array<{ day: string, value: number, isToday: boolean }>}
   */
  const weeklyChartData = useMemo(() => {
    // Build last 7 days skeleton
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d
          .toLocaleDateString('en-IN', { weekday: 'short' })
          .slice(0, 3),
        value: 0,
        isToday: isToday(d),
      };
    });

    // Overlay real values where logs exist
    weeklyLogs.forEach((log) => {
      const match = days.find((d) => d.day === log.day);
      if (match) {
        match.value = Math.round(log.value * 10) / 10;
      }
    });

    return days;
  }, [weeklyLogs]);

  /**
   * Sum of all bars in the weekly chart.
   * @type {number}
   */
  const weeklyTotal = useMemo(
    () => weeklyChartData.reduce((sum, d) => sum + d.value, 0),
    [weeklyChartData]
  );

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

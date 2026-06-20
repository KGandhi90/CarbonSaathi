/**
 * @fileoverview Dashboard page — main view of CarbonSaathi.
 * Shows real-time carbon data from Firebase activity logs.
 * @module pages/Dashboard
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreRing from '../components/ScoreRing';
import CategoryCard from '../components/CategoryCard';
import WeeklyChart from '../components/WeeklyChart';
import TipCard from '../components/TipCard';
import { useAppContext } from '../context/AppContext';
import { useTips } from '../hooks/useTips';
import { useDashboard } from '../hooks/useDashboard';
import { trackEvent } from '../utils/analytics';

/**
 * Dashboard page component.
 * Main view of CarbonSaathi. Fetches real-time carbon data from Firebase
 * and displays the user's daily/weekly stats, carbon score, and category
 * breakdown. Also displays interactive actionable sustainability tips.
 * @returns {React.ReactElement} Rendered dashboard
 */
function Dashboard() {
  const { userProfile } = useAppContext();
  const { tips, completeTip, completedCount, totalSavings } = useTips();
  const navigate = useNavigate();

  const {
    isLoading,
    hasRealData,
    categoryBreakdown,
    weeklyChartData,
    score,
    scoreLabel,
    greeting,
    formattedToday,
    formattedWeekly,
    formattedMonthly,
  } = useDashboard();

  /**
   * Navigates to log page and fires analytics event.
   */
  const handleCTAClick = useCallback(() => {
    trackEvent('Dashboard', 'CTAClicked');
    navigate('/log');
  }, [navigate]);

  /**
   * Navigates to log page from empty-state prompt.
   */
  const handleEmptyStateClick = useCallback(() => {
    trackEvent('Dashboard', 'EmptyStateCTAClicked');
    navigate('/log');
  }, [navigate]);

  // ─── Loading skeleton ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="page-enter space-y-5"
        aria-busy="true"
        aria-label="Loading dashboard"
      >
        {/* Hero skeleton */}
        <div className="skeleton h-44 rounded-3xl" />

        {/* Category grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="skeleton h-40 rounded-2xl" />

        {/* Tips skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  // ─── Main Dashboard ──────────────────────────────────────────────────────
  return (
    <div className="page-enter space-y-5" role="main">
      {/* Hero Card */}
      <section
        className="bg-green-gradient rounded-3xl p-6 sm:p-8 shadow-hero text-white"
        role="region"
        aria-label="Carbon score overview"
      >
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-sans text-sm text-white/70 mb-1">{greeting}</p>
            <h1 className="font-display text-2xl sm:text-3xl text-white leading-tight">
              Your Carbon Score
            </h1>

            {/* Score chip — only shown when real data exists */}
            {hasRealData && (
              <span className="inline-block mt-3 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-medium">
                {scoreLabel.label}
              </span>
            )}
          </div>

          {/* Show score ring only when real data exists, else empty-state prompt */}
          {hasRealData ? (
            <ScoreRing score={score} size={80} light />
          ) : (
            <div
              className="text-center py-2 max-w-[160px]"
              aria-label="No activity logged yet"
            >
              <p className="font-display text-lg text-white mb-1">No logs yet!</p>
              <p className="font-sans text-xs text-white/70 mb-3">
                Log today&apos;s activities to see your real carbon footprint here
              </p>
              <button
                type="button"
                onClick={handleEmptyStateClick}
                className="bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-xl px-4 py-2 transition-colors duration-150"
                aria-label="Go to log activity page"
              >
                Log First Activity →
              </button>
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div className="flex gap-6 mt-6 pt-5 border-t border-white/20 overflow-x-auto no-scrollbar">
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono text-lg font-medium text-white">
              {formattedToday} kg
            </span>
            <span className="font-sans text-xs text-white/60 mt-0.5">Today</span>
          </div>
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono text-lg font-medium text-white">
              {formattedWeekly} kg
            </span>
            <span className="font-sans text-xs text-white/60 mt-0.5">This Week</span>
          </div>
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono text-lg font-medium text-white">
              {formattedMonthly} kg
            </span>
            <span className="font-sans text-xs text-white/60 mt-0.5">This Month</span>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section aria-label="Today's emission breakdown">
        <div className="flex items-center gap-2.5 border-l-4 border-primary pl-3 mb-4">
          <h2 className="font-sans text-sm font-medium text-dark">
            Today&apos;s Breakdown
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categoryBreakdown.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Weekly Chart */}
      <section aria-label="Weekly emission trend">
        <div className="flex items-center gap-2.5 border-l-4 border-primary pl-3 mb-4">
          <h2 className="font-sans text-sm font-medium text-dark">This Week</h2>
        </div>
        <div className="bg-surface1 border border-surface3 rounded-2xl p-5 shadow-card">
          <WeeklyChart data={weeklyChartData} />
          {/* Accessible data table for screen readers */}
          <table className="sr-only">
            <caption>Weekly CO₂ emissions in kg</caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">kg CO₂</th>
              </tr>
            </thead>
            <tbody>
              {weeklyChartData.map((d) => (
                <tr key={d.day}>
                  <td>{d.day}</td>
                  <td>{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips Section */}
      <section aria-label="Actionable tips for today">
        <div className="flex items-center gap-2.5 border-l-4 border-primary pl-3 mb-4">
          <h2 className="font-sans text-sm font-medium text-dark">Actions for Today</h2>
        </div>
        <div className="flex flex-col gap-3">
          {tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} onComplete={completeTip} />
          ))}
        </div>

        {/* Savings banner */}
        {completedCount > 0 && (
          <div
            className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 mt-2 text-center"
            role="status"
            aria-live="polite"
          >
            <span className="font-mono text-sm text-secondary">
              ✓ {completedCount} tip{completedCount > 1 ? 's' : ''} done · Saves{' '}
              {totalSavings.toFixed(1)} kg CO₂ today
            </span>
          </div>
        )}
      </section>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleCTAClick}
        className="block w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm text-center rounded-2xl py-4 mt-2 transition-colors duration-150 shadow-card"
        aria-label="Navigate to log activity page"
      >
        {hasRealData ? "Update Today's Log →" : "Log Today's Activities →"}
      </button>

      {/* Profile badge */}
      <p className="text-center text-xs text-muted pb-2 font-sans">
        📍 {userProfile.city}
      </p>
    </div>
  );
}

export default Dashboard;

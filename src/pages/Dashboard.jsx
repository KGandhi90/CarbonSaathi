/**
 * @fileoverview Dashboard page — main view of CarbonSaathi.
 * Shows carbon score hero, category breakdown, weekly chart, and tips.
 * @module pages/Dashboard
 */

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreRing from '../components/ScoreRing';
import CategoryCard from '../components/CategoryCard';
import WeeklyChart from '../components/WeeklyChart';
import TipCard from '../components/TipCard';
import { useAppContext } from '../context/AppContext';
import { useTips } from '../hooks/useTips';
import { calcScore, getScoreLabel } from '../utils/carbonCalc';
import { getGreeting } from '../utils/helpers';
import { trackEvent } from '../utils/analytics';
import { todayBreakdown } from '../data/mockData';

/**
 * Dashboard page component.
 * @returns {React.ReactElement} Rendered dashboard
 */
function Dashboard() {
  const { weeklyData, userProfile } = useAppContext();
  const { tips, completeTip, completedCount, totalSavings } = useTips();
  const navigate = useNavigate();

  /** @type {string} Time-based greeting */
  const greeting = useMemo(() => getGreeting(), []);

  /** @type {number} Carbon score derived from daily average */
  const score = useMemo(
    () => calcScore(userProfile.avgDaily),
    [userProfile.avgDaily]
  );

  /** @type {{ label: string, variant: string }} Score label and color */
  const scoreLabel = useMemo(() => getScoreLabel(score), [score]);

  /**
   * Navigates to log page and fires analytics event.
   */
  const handleCTAClick = useCallback(() => {
    trackEvent('Dashboard', 'CTAClicked');
    navigate('/log');
  }, [navigate]);

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
            <p className="font-sans text-sm text-white/70 mb-1">
              {greeting}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-white leading-tight">
              Your Carbon Score
            </h1>

            {/* Score chip */}
            <span className="inline-block mt-3 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-medium">
              {scoreLabel.label}
            </span>
          </div>

          <ScoreRing score={score} size={80} light />
        </div>

        {/* Stats strip */}
        <div className="flex gap-6 mt-6 pt-5 border-t border-white/20 overflow-x-auto no-scrollbar">
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono text-lg font-medium text-white">
              {userProfile.avgDaily} kg
            </span>
            <span className="font-sans text-xs text-white/60 mt-0.5">
              Today
            </span>
          </div>
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono text-lg font-medium text-white">
              16.8 kg
            </span>
            <span className="font-sans text-xs text-white/60 mt-0.5">
              This Week
            </span>
          </div>
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono text-lg font-medium text-white">
              68.2 kg
            </span>
            <span className="font-sans text-xs text-white/60 mt-0.5">
              This Month
            </span>
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
          {todayBreakdown.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Weekly Chart */}
      <section aria-label="Weekly emission trend">
        <div className="flex items-center gap-2.5 border-l-4 border-primary pl-3 mb-4">
          <h2 className="font-sans text-sm font-medium text-dark">
            This Week
          </h2>
        </div>
        <div className="bg-surface1 border border-surface3 rounded-2xl p-5 shadow-card">
          <WeeklyChart data={weeklyData} />
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
              {weeklyData.map((d) => (
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
          <h2 className="font-sans text-sm font-medium text-dark">
            Actions for Today
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {tips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onComplete={completeTip}
            />
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
              ✓ {completedCount} tip{completedCount > 1 ? 's' : ''} done · Saves {totalSavings.toFixed(1)} kg CO₂ today
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
        Log Today&apos;s Activities →
      </button>
    </div>
  );
}

export default Dashboard;

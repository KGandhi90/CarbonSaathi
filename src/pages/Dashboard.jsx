/**
 * @fileoverview Dashboard page — main view of CarbonSaathi.
 * Shows carbon score hero, category breakdown, weekly chart, and tips.
 * @module pages/Dashboard
 */

import { Link } from 'react-router-dom';
import ScoreRing from '../components/ScoreRing';
import CategoryCard from '../components/CategoryCard';
import WeeklyChart from '../components/WeeklyChart';
import TipCard from '../components/TipCard';
import {
  userProfile,
  todayBreakdown,
  weeklyData,
  tips,
} from '../data/mockData';

/**
 * No-op handler for tip completion.
 * Will be wired in Phase 2.
 */
const handleTipComplete = () => {};

/**
 * Returns the score label and emoji based on score value.
 * @param {number} score - Carbon score 0-100
 * @returns {{ label: string, emoji: string }} Score label data
 */
function getScoreLabel(score) {
  if (score < 40) {
    return { label: 'Low Impact', emoji: '🌿' };
  }
  if (score < 70) {
    return { label: 'Moderate Impact', emoji: '⚡' };
  }
  return { label: 'High Impact', emoji: '⚠️' };
}

/**
 * Dashboard page component.
 * @returns {React.ReactElement} Rendered dashboard
 */
function Dashboard() {
  const scoreLabel = getScoreLabel(userProfile.score);

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
              Good morning 🌱
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-white leading-tight">
              Your Carbon Score
            </h1>

            {/* Score chip */}
            <span className="inline-block mt-3 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-medium">
              {scoreLabel.label} {scoreLabel.emoji}
            </span>
          </div>

          <ScoreRing score={userProfile.score} size={80} light />
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
              onComplete={handleTipComplete}
            />
          ))}
        </div>
      </section>

      {/* CTA Button */}
      <Link
        to="/log"
        className="block w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm text-center rounded-2xl py-4 mt-2 transition-colors duration-150 shadow-card"
        aria-label="Navigate to log activity page"
      >
        Log Today&apos;s Activities →
      </Link>
    </div>
  );
}

export default Dashboard;

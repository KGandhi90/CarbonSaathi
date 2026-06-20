/**
 * @fileoverview Bar chart showing 7-day CO₂ emission trend.
 * @module components/WeeklyChart
 */

import PropTypes from 'prop-types';
import { useMemo } from 'react';

/**
 * Bar chart showing 7-day CO₂ emission trend.
 * Uses pure CSS bars rather than a charting library for simplicity.
 * @param {object} props - Component props
 * @param {Array} props.data - Weekly data array
 * @returns {React.ReactElement} Rendered weekly bar chart
 */
function WeeklyChart({ data }) {
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

  return (
    <div className="w-full" role="img" aria-label="Weekly carbon emissions bar chart">
      <div className="flex gap-3">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-32 text-right pr-2">
          <span className="font-mono text-xs text-muted">4</span>
          <span className="font-mono text-xs text-muted">2</span>
          <span className="font-mono text-xs text-muted">0</span>
        </div>

        {/* Bars area */}
        <div className="flex-1 flex items-end gap-1.5 h-32">
          {data.map((item) => {
            const heightPercent = maxVal > 0 ? (item.value / maxVal) * 100 : 0;

            return (
              <div key={item.day} className="flex flex-col items-center gap-1 flex-1">
                {/* Value label (only for today) */}
                <div className="h-4 flex items-center justify-center">
                  {item.isToday && (
                    <span className="font-mono text-xs text-primary font-medium">
                      {item.value}
                    </span>
                  )}
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${
                    item.isToday ? 'bg-primary' : 'bg-accent'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    minHeight: '4px',
                  }}
                  aria-hidden="true"
                />

                {/* Day label */}
                <span
                  className={`font-mono text-xs ${
                    item.isToday ? 'text-primary font-medium' : 'text-muted'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

WeeklyChart.propTypes = {
  /** Weekly emission data array */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      isToday: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default WeeklyChart;

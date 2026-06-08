/**
 * @fileoverview Circular SVG progress ring for carbon score.
 * @module components/ScoreRing
 */

import PropTypes from 'prop-types';

/**
 * Circular SVG progress ring for carbon score.
 * @param {object} props - Component props
 * @param {number} props.score - Score value 0-100
 * @param {number} [props.size=80] - Ring diameter in px
 * @param {boolean} [props.light=false] - White variant for hero
 * @returns {React.ReactElement} Rendered score ring
 */
function ScoreRing({ score, size = 80, light = false }) {
  const center = size / 2;
  const radius = center - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const bgStroke = light ? 'rgba(255,255,255,0.2)' : '#E8EFE8';
  const fgStroke = light ? 'white' : 'url(#scoreGrad)';
  const textColor = light ? 'text-white' : 'text-dark';
  const mutedColor = light ? 'text-white/60' : 'text-muted';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Carbon score: ${score} out of 100`}
    >
      {!light && (
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6A4F" />
            <stop offset="100%" stopColor="#52B788" />
          </linearGradient>
        </defs>
      )}

      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={bgStroke}
        strokeWidth={6}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={fgStroke}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />

      {/* Score number */}
      <text
        x={center}
        y={center - 2}
        textAnchor="middle"
        dominantBaseline="central"
        className={`font-mono text-xl font-medium ${textColor}`}
        fill="currentColor"
      >
        {score}
      </text>

      {/* /100 label */}
      <text
        x={center}
        y={center + 14}
        textAnchor="middle"
        dominantBaseline="central"
        className={`font-mono text-xs ${mutedColor}`}
        fill="currentColor"
      >
        /100
      </text>
    </svg>
  );
}

ScoreRing.propTypes = {
  /** Score value 0-100 */
  score: PropTypes.number.isRequired,
  /** Ring diameter in px */
  size: PropTypes.number,
  /** White variant for hero section */
  light: PropTypes.bool,
};

export default ScoreRing;

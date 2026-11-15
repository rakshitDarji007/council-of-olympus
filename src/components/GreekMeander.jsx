import React from 'react';

/**
 * Authentic Greek Key (Meander) decorative border ribbon.
 */
export default function GreekMeander({
  color = '#EE8A2E',
  height = 18,
  className = '',
  opacity = 0.85,
}) {
  return (
    <div
      className={`w-full overflow-hidden flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ height: `${height}px`, opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat-x"
        viewBox="0 0 100 20"
      >
        <pattern
          id={`meander-pattern-${color.replace('#', '')}`}
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          {/* Top and Bottom guide rails */}
          <line x1="0" y1="2" x2="40" y2="2" stroke={color} strokeWidth="2" />
          <line x1="0" y1="18" x2="40" y2="18" stroke={color} strokeWidth="2" />
          
          {/* Continuous Greek Key path */}
          <path
            d="M 2,18 L 2,6 L 14,6 L 14,14 L 8,14 L 8,10 L 10,10 M 18,2 L 18,14 L 30,14 L 30,6 L 24,6 L 24,10 L 26,10 M 34,18 L 34,6 L 42,6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="square"
          />
        </pattern>
        <rect
          width="100%"
          height="20"
          fill={`url(#meander-pattern-${color.replace('#', '')})`}
        />
      </svg>
    </div>
  );
}

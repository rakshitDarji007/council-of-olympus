import React, { useMemo } from 'react';

/**
 * Pixel-art clouds drifting across the sky and 4-pointed orange sparkle stars.
 */
export default function StarBackground() {
  // Deterministic star field
  const stars = useMemo(() => {
    const arr = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      const top = ((i * 37) % 92) + 2;
      const left = ((i * 73) % 96) + 2;
      const size = (i % 3 === 0 ? 16 : i % 2 === 0 ? 12 : 8);
      const delay = (i * 0.4) % 4;
      const duration = 2.5 + ((i * 0.7) % 3);
      arr.push({ top, left, size, delay, duration });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Drifting Pixel Clouds Layer */}
      <div className="absolute top-2 left-0 w-[200%] h-24 flex opacity-40 animate-wave-drift" style={{ animationDuration: '60s' }}>
        <svg viewBox="0 0 1000 80" className="w-1/2 h-full shrink-0" preserveAspectRatio="none">
          {/* Pixel Cloud 1 */}
          <g fill="#C1DDD0" opacity="0.6">
            <rect x="120" y="20" width="80" height="12" />
            <rect x="100" y="32" width="120" height="12" />
            <rect x="80" y="44" width="160" height="12" />
            <rect x="110" y="56" width="100" height="8" />
          </g>
          {/* Pixel Cloud 2 */}
          <g fill="#FDF4CC" opacity="0.45">
            <rect x="520" y="10" width="90" height="10" />
            <rect x="500" y="20" width="130" height="10" />
            <rect x="480" y="30" width="170" height="12" />
            <rect x="510" y="42" width="110" height="8" />
          </g>
          {/* Pixel Cloud 3 */}
          <g fill="#C1DDD0" opacity="0.5">
            <rect x="840" y="25" width="70" height="10" />
            <rect x="820" y="35" width="110" height="10" />
            <rect x="800" y="45" width="150" height="12" />
          </g>
        </svg>
        <svg viewBox="0 0 1000 80" className="w-1/2 h-full shrink-0" preserveAspectRatio="none">
          <g fill="#C1DDD0" opacity="0.6">
            <rect x="120" y="20" width="80" height="12" />
            <rect x="100" y="32" width="120" height="12" />
            <rect x="80" y="44" width="160" height="12" />
          </g>
          <g fill="#FDF4CC" opacity="0.45">
            <rect x="520" y="10" width="90" height="10" />
            <rect x="500" y="20" width="130" height="10" />
            <rect x="480" y="30" width="170" height="12" />
          </g>
        </svg>
      </div>

      {/* Four-Pointed Orange Sparkle Stars */}
      {stars.map((s, idx) => (
        <div
          key={idx}
          className="absolute text-[#EE8A2E] animate-star-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="currentColor">
            {/* Elegant 4-pointed star polygon */}
            <path d="M 12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

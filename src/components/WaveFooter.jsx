import React from 'react';

/**
 * Animated Teal Wave Band with Greek Trireme Galley Ship silhouette.
 * Palette: Teal #1F5C66, Deep Teal #133E46, Seafoam #C1DDD0, Orange #EE8A2E, Cream #FDF4CC.
 */
export default function WaveFooter({ isLoading = false }) {
  return (
    <div className="relative w-full overflow-hidden select-none pointer-events-none mt-auto">
      {/* Drifting Greek Galley Ship */}
      <div
        className={`absolute bottom-6 z-20 transition-all ${
          isLoading ? 'animate-ship-sail' : 'animate-ship-sail'
        }`}
        style={{
          animationDuration: isLoading ? '12s' : '26s',
          width: '90px',
          height: '60px',
        }}
      >
        <svg
          viewBox="0 0 100 65"
          className="w-full h-full drop-shadow-md"
        >
          {/* Mast */}
          <line x1="45" y1="8" x2="45" y2="48" stroke="#EE8A2E" strokeWidth="2.5" />
          <line x1="28" y1="12" x2="62" y2="12" stroke="#EE8A2E" strokeWidth="2" />

          {/* Square Billowing Sail (Cream #FDF4CC with Greek sun crest) */}
          <path
            d="M 30 14 Q 45 10 60 14 Q 63 30 58 38 Q 45 42 32 38 Q 27 30 30 14 Z"
            fill="#FDF4CC"
            stroke="#EE8A2E"
            strokeWidth="1.5"
          />
          {/* Sail Emblem */}
          <circle cx="45" cy="25" r="4" fill="#EE8A2E" />
          <path
            d="M 45 18 L 45 32 M 38 25 L 52 25"
            stroke="#EE8A2E"
            strokeWidth="1.2"
          />

          {/* Galley Hull (Odyssey Orange #EE8A2E with high curved stern & ram prow) */}
          <path
            d="M 12 40 Q 20 52 48 52 Q 78 52 90 42 L 96 46 L 88 48 Q 72 56 46 56 Q 16 56 6 42 Q 4 34 8 26 L 12 28 Q 8 36 12 40 Z"
            fill="#EE8A2E"
          />
          {/* Prow Eye (Ophthalmos) warding off monsters */}
          <circle cx="82" cy="46" r="2.5" fill="#FDF4CC" />
          <circle cx="82" cy="46" r="1.2" fill="#12233F" />

          {/* Row of Oars */}
          <g stroke="#FDF4CC" strokeWidth="1.2" opacity="0.85">
            <line x1="24" y1="48" x2="18" y2="58" />
            <line x1="32" y1="48" x2="26" y2="58" />
            <line x1="40" y1="48" x2="34" y2="58" />
            <line x1="48" y1="48" x2="42" y2="58" />
            <line x1="56" y1="48" x2="50" y2="58" />
            <line x1="64" y1="48" x2="58" y2="58" />
          </g>
        </svg>

        {/* Loading text pulse under ship */}
        {isLoading && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-serif text-[#EE8A2E] tracking-wider font-semibold glow-orange animate-pulse">
            The gods deliberate...
          </div>
        )}
      </div>

      {/* Wave Layer 1 (Back wave, dark teal) */}
      <div className="w-[200%] h-10 flex animate-wave-drift opacity-60">
        <svg
          viewBox="0 0 1200 40"
          className="w-1/2 h-full shrink-0"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 20 Q 75 5 150 20 T 300 20 T 450 20 T 600 20 T 750 20 T 900 20 T 1050 20 T 1200 20 L 1200 40 L 0 40 Z"
            fill="#133E46"
          />
        </svg>
        <svg
          viewBox="0 0 1200 40"
          className="w-1/2 h-full shrink-0"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 20 Q 75 5 150 20 T 300 20 T 450 20 T 600 20 T 750 20 T 900 20 T 1050 20 T 1200 20 L 1200 40 L 0 40 Z"
            fill="#133E46"
          />
        </svg>
      </div>

      {/* Wave Layer 2 (Foreground wave with Seafoam Crest, Teal #1F5C66) */}
      <div
        className="w-[200%] h-12 flex -mt-6 animate-wave-drift relative z-10"
        style={{ animationDuration: '8s', animationDirection: 'reverse' }}
      >
        <svg
          viewBox="0 0 1200 48"
          className="w-1/2 h-full shrink-0"
          preserveAspectRatio="none"
        >
          {/* Crest */}
          <path
            d="M 0 16 Q 100 0 200 16 T 400 16 T 600 16 T 800 16 T 1000 16 T 1200 16"
            fill="none"
            stroke="#C1DDD0"
            strokeWidth="2.5"
            opacity="0.9"
          />
          {/* Wave Body */}
          <path
            d="M 0 16 Q 100 0 200 16 T 400 16 T 600 16 T 800 16 T 1000 16 T 1200 16 L 1200 48 L 0 48 Z"
            fill="#1F5C66"
          />
        </svg>
        <svg
          viewBox="0 0 1200 48"
          className="w-1/2 h-full shrink-0"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 16 Q 100 0 200 16 T 400 16 T 600 16 T 800 16 T 1000 16 T 1200 16"
            fill="none"
            stroke="#C1DDD0"
            strokeWidth="2.5"
            opacity="0.9"
          />
          <path
            d="M 0 16 Q 100 0 200 16 T 400 16 T 600 16 T 800 16 T 1000 16 T 1200 16 L 1200 48 L 0 48 Z"
            fill="#1F5C66"
          />
        </svg>
      </div>
    </div>
  );
}

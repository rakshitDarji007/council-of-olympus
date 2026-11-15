import React from 'react';

/**
 * Ancient Greek Brazier Torch with animated flickering flame.
 * Colors: Maroon & Cream stand with Lime-Yellow (#E4EC6A) and Odyssey Orange (#EE8A2E) flame.
 */
export default function BrazierTorch({
  side = 'left',
  height = 140,
  isFlaring = false,
  className = '',
}) {
  return (
    <div
      className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Animated Flame Container */}
      <div
        className={`relative z-10 transition-transform duration-500 ${
          isFlaring ? 'scale-125' : 'scale-100'
        }`}
      >
        {/* Flame glow aura */}
        <div
          className={`absolute -inset-2 rounded-full blur-md opacity-75 transition-opacity ${
            isFlaring ? 'bg-[#E4EC6A] opacity-90' : 'bg-[#EE8A2E] opacity-60'
          }`}
        />

        {/* Multi-layered flickering flame SVG */}
        <svg
          width="44"
          height="60"
          viewBox="0 0 44 60"
          className="relative overflow-visible animate-flame"
        >
          {/* Outer orange flame */}
          <path
            d="M 22 2 C 14 16, 4 32, 4 44 C 4 54, 12 58, 22 58 C 32 58, 40 54, 40 44 C 40 32, 30 16, 22 2 Z"
            fill="#EE8A2E"
            opacity="0.9"
          />
          {/* Middle yellow-green flame */}
          <path
            d="M 22 14 C 17 24, 10 36, 10 46 C 10 54, 15 56, 22 56 C 29 56, 34 54, 34 46 C 34 36, 27 24, 22 14 Z"
            fill="#E4EC6A"
            opacity="0.95"
          />
          {/* Inner white-hot core */}
          <path
            d="M 22 26 C 19 33, 15 40, 15 48 C 15 53, 18 55, 22 55 C 26 55, 29 53, 29 48 C 29 40, 25 33, 22 26 Z"
            fill="#FFFBE8"
          />
        </svg>

        {/* Floating Sparks/Embers */}
        <div className="absolute -top-3 left-2 w-1.5 h-1.5 rounded-full bg-[#E4EC6A] animate-ping opacity-75" />
        <div
          className="absolute -top-6 right-2 w-1 h-1 rounded-full bg-[#EE8A2E] animate-pulse opacity-90"
          style={{ animationDelay: '0.7s' }}
        />
      </div>

      {/* Brazier Bowl (Terracotta Maroon #9B3B33 with Cream rim) */}
      <svg
        width="64"
        height="22"
        viewBox="0 0 64 22"
        className="-mt-2 relative z-20"
      >
        <ellipse cx="32" cy="7" rx="30" ry="6" fill="#FDF4CC" />
        <ellipse cx="32" cy="7" rx="27" ry="4" fill="#9B3B33" />
        <path
          d="M 2 7 Q 32 24 62 7 L 44 20 Q 32 22 20 20 Z"
          fill="#752B24"
        />
        <circle cx="16" cy="12" r="2" fill="#EE8A2E" opacity="0.8" />
        <circle cx="32" cy="15" r="2.5" fill="#EE8A2E" opacity="0.8" />
        <circle cx="48" cy="12" r="2" fill="#EE8A2E" opacity="0.8" />
      </svg>

      {/* Stone Column Pedestal */}
      <svg
        width="40"
        height="70"
        viewBox="0 0 40 70"
        className="relative z-10"
      >
        {/* Capital */}
        <rect x="6" y="0" width="28" height="6" fill="#DDD3C8" rx="1" />
        <rect x="8" y="6" width="24" height="4" fill="#9B3B33" />

        {/* Fluted Column Shaft */}
        <rect x="10" y="10" width="20" height="50" fill="#DDD3C8" />
        {/* Flute lines */}
        <line x1="14" y1="10" x2="14" y2="60" stroke="#B8AFA5" strokeWidth="1.5" />
        <line x1="18" y1="10" x2="18" y2="60" stroke="#B8AFA5" strokeWidth="1.5" />
        <line x1="22" y1="10" x2="22" y2="60" stroke="#B8AFA5" strokeWidth="1.5" />
        <line x1="26" y1="10" x2="26" y2="60" stroke="#B8AFA5" strokeWidth="1.5" />

        {/* Base */}
        <rect x="6" y="60" width="28" height="5" fill="#9B3B33" rx="1" />
        <rect x="2" y="65" width="36" height="5" fill="#DDD3C8" rx="1" />
      </svg>
    </div>
  );
}

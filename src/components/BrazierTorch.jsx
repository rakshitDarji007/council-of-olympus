import React from 'react';

/**
 * Minimalist, elegant architectural ambient light column.
 */
export default function BrazierTorch({
  side = 'left',
  height = 140,
  isFlaring = false,
  className = '',
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none pointer-events-none opacity-40 transition-opacity duration-700 ${
        isFlaring ? 'opacity-80' : 'opacity-30'
      } ${className}`}
      style={{ height: `${height}px`, width: '24px' }}
    >
      {/* Sleek vertical light filament */}
      <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D97746] to-transparent" />
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-500 ${
          isFlaring
            ? 'bg-[#D97746] shadow-[0_0_16px_#D97746] scale-125'
            : 'bg-[#94A3B8]/40 scale-100'
        }`}
      />
    </div>
  );
}

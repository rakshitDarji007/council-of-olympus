import React from 'react';

/**
 * Architectural keyline divider with classical Greek Odyssey center insignia in terracotta rust and sand.
 */
export default function GreekMeander({
  color = '#b4654d',
  className = '',
  opacity = 0.4,
}) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-3 select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#ded0bc] to-[#b4654d]/50" />
      <span className="text-[11px] tracking-widest text-[#b4654d] font-serif">❖</span>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#ded0bc] to-[#b4654d]/50" />
    </div>
  );
}

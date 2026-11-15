import React from 'react';

/**
 * Minimalist, elegant classical keyline divider.
 * Clean, subtle architectural accent line with a discreet meander center.
 */
export default function GreekMeander({
  color = '#D97746',
  className = '',
  opacity = 0.35,
}) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-3 select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D97746]/40 to-[#D97746]/60" />
      <div className="flex items-center gap-1 text-[#D97746] text-[10px] tracking-widest font-mono">
        <span>❖</span>
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#D97746]/40 to-[#D97746]/60" />
    </div>
  );
}

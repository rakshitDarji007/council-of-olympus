import React from 'react';

/**
 * Razor-sharp architectural keyline divider with classical center insignia in terracotta rose.
 */
export default function GreekMeander({
  color = '#E8A28E',
  className = '',
  opacity = 0.25,
}) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-3 select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E8A28E]/40 to-[#E8A28E]/60" />
      <span className="text-[10px] tracking-widest text-[#E8A28E] font-serif">❖</span>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#E8A28E]/40 to-[#E8A28E]/60" />
    </div>
  );
}

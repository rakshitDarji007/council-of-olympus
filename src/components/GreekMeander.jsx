import React from 'react';

/**
 * Razor-sharp architectural keyline divider with classical center insignia.
 */
export default function GreekMeander({
  color = '#D4A373',
  className = '',
  opacity = 0.3,
}) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-3 select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-white/20" />
      <span className="text-[9px] tracking-widest text-[#D4A373] font-serif">❖</span>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/10 to-white/20" />
    </div>
  );
}

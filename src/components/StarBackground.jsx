import React from 'react';

/**
 * Atmospheric Dawn-over-the-Aegean lighting (Inspired by Image 1 & Homer's Rosy-Fingered Dawn):
 * Soft terracotta-rose, dusty mauve, and champagne horizon illumination.
 */
export default function StarBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Primary Rose-Apricot Dawn Haze (Top Horizon) */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(228, 164, 149, 0.28) 0%, rgba(206, 132, 145, 0.16) 40%, rgba(25, 28, 48, 0.05) 75%, transparent 100%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Secondary Soft Mauve Horizon Drift */}
      <div 
        className="absolute top-20 left-1/4 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(216, 154, 175, 0.18) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Deep Aegean Indigo Depth (Bottom) */}
      <div 
        className="absolute -bottom-32 right-1/4 w-[700px] h-[400px] pointer-events-none opacity-35"
        style={{
          background: 'radial-gradient(circle at center, rgba(30, 91, 106, 0.18) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
}

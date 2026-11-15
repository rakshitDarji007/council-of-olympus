import React from 'react';

/**
 * Architectural atmospheric background:
 * Soft overhead zenith light and deep matte vignetting.
 * Minimalist, elegant, and quiet without distracting particle clutter.
 */
export default function StarBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Subtle zenith skylight */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[480px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 163, 115, 0.12) 0%, rgba(212, 163, 115, 0.02) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Discrete bottom corner depth */}
      <div 
        className="absolute -bottom-40 right-1/4 w-[600px] h-[350px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(42, 115, 133, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

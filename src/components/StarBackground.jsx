import React from 'react';

/**
 * Atmospheric Aegean & Homeric Odyssey backdrop:
 * Delicate sea mist, terracotta dawn reflection, and coastal clay warmth.
 */
export default function StarBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Top Left: Gentle Terracotta Sunrise Mist */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[500px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at center, rgba(180, 101, 77, 0.15) 0%, rgba(238, 227, 210, 0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top Right: Deep Aegean Ocean Haze */}
      <div 
        className="absolute -top-40 right-[-10%] w-[700px] h-[600px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(48, 88, 115, 0.18) 0%, rgba(26, 58, 82, 0.08) 45%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Center Subtle Homeric Gold Drift */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(232, 201, 122, 0.18) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Bottom Coastal Sand Warmth */}
      <div 
        className="absolute -bottom-40 left-1/3 w-[900px] h-[500px] pointer-events-none opacity-35"
        style={{
          background: 'radial-gradient(circle at center, rgba(222, 208, 188, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}

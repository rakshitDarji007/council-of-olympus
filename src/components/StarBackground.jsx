import React, { useMemo } from 'react';

/**
 * Clean, subtle ambient backdrop with refined micro-star points and soft atmospheric glow.
 * No cartoonish pixel clouds or distracting animations.
 */
export default function StarBackground() {
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 45; i++) {
      const top = ((i * 37) % 94) + 3;
      const left = ((i * 67) % 96) + 2;
      const size = i % 4 === 0 ? 2 : 1.5;
      const opacity = 0.15 + ((i * 0.08) % 0.45);
      list.push({ top, left, size, opacity });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Ambient gradient blooms */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#D97746]/10 via-[#1E5B6A]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-0 w-[500px] h-[300px] bg-[#1E5B6A]/10 blur-3xl pointer-events-none" />

      {/* Discrete micro-stars */}
      {stars.map((s, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-[#F8F6F0]"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

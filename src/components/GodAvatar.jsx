import React from 'react';

/**
 * Sophisticated, minimalist engraved insignia medallions for the Council voices:
 * - Athena (Strategy & Compounding Leverage)
 * - Poseidon (Risk & Downside Exposure)
 * - Hermes (Agility, Optionality & Loopholes)
 * - Odysseus (The Seasoned Decision-Maker)
 * - Oracle (The Inquiring Facilitator)
 */
export default function GodAvatar({
  speaker = 'athena',
  size = 96,
  isActive = false,
  className = '',
}) {
  const normalized = speaker.toLowerCase();

  return (
    <div
      className={`relative rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#0F172A',
        border: isActive ? '2px solid #D97746' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isActive
          ? '0 0 25px rgba(217, 119, 70, 0.35), inset 0 0 15px rgba(217, 119, 70, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* ATHENA: Strategic Crest & Corinthian Helm Geometry */}
      {normalized === 'athena' && (
        <svg viewBox="0 0 64 64" className="w-[68%] h-[68%] text-[#94B49F]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          {/* Corinthian helmet clean lines */}
          <path d="M 32 10 C 22 10, 16 18, 16 28 C 16 38, 22 42, 25 45 L 25 52 L 32 50 L 39 52 L 39 45 C 42 42, 48 38, 48 28 C 48 18, 42 10, 32 10 Z" strokeWidth="1.75" />
          {/* Eye T-slit */}
          <line x1="22" y1="28" x2="42" y2="28" strokeWidth="1.75" />
          <line x1="32" y1="28" x2="32" y2="38" strokeWidth="1.75" />
          {/* Strategic Crest Plume */}
          <path d="M 32 8 C 37 4, 44 8, 46 16 C 41 14, 35 12, 32 8 Z" fill="#D97746" stroke="#D97746" strokeWidth="1" />
        </svg>
      )}

      {/* POSEIDON: Minimalist Maritime Trident & Swell */}
      {normalized === 'poseidon' && (
        <svg viewBox="0 0 64 64" className="w-[68%] h-[68%] text-[#2A7385]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          {/* Trident geometry */}
          <line x1="32" y1="12" x2="32" y2="52" strokeWidth="2" strokeLinecap="round" />
          <path d="M 22 14 L 22 26 C 22 34, 42 34, 42 26 L 42 14" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M 18 14 L 22 10 L 26 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 28 14 L 32 8 L 36 14" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="#D97746" />
          <path d="M 38 14 L 42 10 L 46 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Subtle ocean break line */}
          <path d="M 18 46 Q 32 40 46 46" stroke="#D97746" strokeWidth="1.25" opacity="0.7" />
        </svg>
      )}

      {/* HERMES: Caduceus & Winged Staff Geometry */}
      {normalized === 'hermes' && (
        <svg viewBox="0 0 64 64" className="w-[68%] h-[68%] text-[#D97746]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          {/* Central staff */}
          <line x1="32" y1="14" x2="32" y2="52" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="32" cy="12" r="2.5" fill="currentColor" />
          {/* Intertwined caduceus curves */}
          <path d="M 22 24 C 22 18, 42 18, 42 24 C 42 30, 22 30, 22 36 C 22 42, 42 42, 42 36" strokeWidth="1.5" strokeLinecap="round" />
          {/* Wings */}
          <path d="M 32 18 C 24 14, 18 16, 14 22 C 20 22, 28 20, 32 18 Z" fill="#F8F6F0" opacity="0.8" stroke="none" />
          <path d="M 32 18 C 40 14, 46 16, 50 22 C 44 22, 36 20, 32 18 Z" fill="#F8F6F0" opacity="0.8" stroke="none" />
        </svg>
      )}

      {/* ODYSSEUS: Navigational Compass Star & Survivor Helm */}
      {normalized === 'odysseus' && (
        <svg viewBox="0 0 64 64" className="w-[68%] h-[68%] text-[#F8F6F0]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          {/* Compass rose star */}
          <polygon points="32,10 36,28 54,32 36,36 32,54 28,36 10,32 28,28" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="32" cy="32" r="4" fill="#D97746" stroke="none" />
        </svg>
      )}

      {/* ORACLE: Sacred Tripod & Inquiring Flame */}
      {normalized === 'oracle' && (
        <svg viewBox="0 0 64 64" className="w-[68%] h-[68%] text-[#D97746]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          {/* Sacred Flame */}
          <path d="M 32 14 C 27 20, 22 26, 22 34 C 22 40, 26 44, 32 44 C 38 44, 42 40, 42 34 C 42 26, 37 20, 32 14 Z" strokeWidth="1.5" fill="rgba(217,119,70,0.15)" />
          <circle cx="32" cy="34" r="3" fill="#F8F6F0" stroke="none" />
          {/* Tripod base */}
          <line x1="20" y1="50" x2="44" y2="50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="44" x2="22" y2="50" strokeWidth="1.5" />
          <line x1="38" y1="44" x2="42" y2="50" strokeWidth="1.5" />
          <line x1="32" y1="44" x2="32" y2="50" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
}

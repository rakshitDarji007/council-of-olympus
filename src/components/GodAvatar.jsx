import React from 'react';

/**
 * Minted insignia medallions for Council voices:
 * - Athena (Strategy & Compounding Leverage)
 * - Poseidon (Downside & Runway Friction)
 * - Hermes (Agility, Optionality & Loopholes)
 * - Odysseus (The Seasoned Survivor & Ruler)
 * - Oracle (The Inquiring Deliberator)
 */
export default function GodAvatar({
  speaker = 'athena',
  size = 64,
  isActive = false,
  className = '',
}) {
  const normalized = speaker.toLowerCase();

  const activeShadowByGod = {
    athena: '0 0 30px rgba(232, 201, 122, 0.65), 0 0 60px rgba(148, 180, 159, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    poseidon: '0 0 30px rgba(74, 144, 188, 0.75), 0 0 60px rgba(48, 88, 115, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    hermes: '0 0 30px rgba(212, 114, 87, 0.75), 0 0 60px rgba(232, 201, 122, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  };

  const activeBorderByGod = {
    athena: '2px solid #e8c97a',
    poseidon: '2px solid #4a90bc',
    hermes: '2px solid #d47257',
  };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(145deg, #102f46 0%, #041321 100%)',
        border: isActive
          ? (activeBorderByGod[normalized] || '2px solid #e8c97a')
          : '1px solid rgba(222, 208, 188, 0.25)',
        boxShadow: isActive
          ? (activeShadowByGod[normalized] || '0 0 28px rgba(232, 201, 122, 0.6)')
          : '0 4px 14px rgba(4, 19, 33, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* ATHENA: Corinthian Helm Geometry */}
      {normalized === 'athena' && (
        <svg viewBox="0 0 64 64" className="w-[66%] h-[66%] text-[#94B49F]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
          <path d="M 32 10 C 22 10, 16 18, 16 28 C 16 38, 22 42, 25 45 L 25 52 L 32 50 L 39 52 L 39 45 C 42 42, 48 38, 48 28 C 48 18, 42 10, 32 10 Z" strokeWidth="1.75" />
          <line x1="22" y1="28" x2="42" y2="28" strokeWidth="1.75" />
          <line x1="32" y1="28" x2="32" y2="38" strokeWidth="1.75" />
          <path d="M 32 8 C 37 4, 44 8, 46 16 C 41 14, 35 12, 32 8 Z" fill="#e8c97a" stroke="#e8c97a" strokeWidth="1" />
        </svg>
      )}

      {/* POSEIDON: Minimalist Maritime Trident */}
      {normalized === 'poseidon' && (
        <svg viewBox="0 0 64 64" className="w-[66%] h-[66%] text-[#8ca1aa]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
          <line x1="32" y1="12" x2="32" y2="52" strokeWidth="2" strokeLinecap="round" />
          <path d="M 22 14 L 22 26 C 22 34, 42 34, 42 26 L 42 14" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M 18 14 L 22 10 L 26 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 28 14 L 32 8 L 36 14" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="#e8c97a" />
          <path d="M 38 14 L 42 10 L 46 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 18 46 Q 32 40 46 46" stroke="#e8c97a" strokeWidth="1.25" opacity="0.7" />
        </svg>
      )}

      {/* HERMES: Caduceus & Winged Staff */}
      {normalized === 'hermes' && (
        <svg viewBox="0 0 64 64" className="w-[66%] h-[66%] text-[#b4654d]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
          <line x1="32" y1="14" x2="32" y2="52" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="32" cy="12" r="2.5" fill="currentColor" />
          <path d="M 22 24 C 22 18, 42 18, 42 24 C 42 30, 22 30, 22 36 C 22 42, 42 42, 42 36" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 32 18 C 24 14, 18 16, 14 22 C 20 22, 28 20, 32 18 Z" fill="#e8c97a" opacity="0.9" stroke="none" />
          <path d="M 32 18 C 40 14, 46 16, 50 22 C 44 22, 36 20, 32 18 Z" fill="#e8c97a" opacity="0.9" stroke="none" />
        </svg>
      )}

      {/* ODYSSEUS: Compass Rose */}
      {normalized === 'odysseus' && (
        <svg viewBox="0 0 64 64" className="w-[66%] h-[66%] text-[#f6eddf]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
          <polygon points="32,10 36,28 54,32 36,36 32,54 28,36 10,32 28,28" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="32" cy="32" r="3.5" fill="#e8c97a" stroke="none" />
        </svg>
      )}

      {/* ORACLE: Sacred Deliberative Flame */}
      {normalized === 'oracle' && (
        <svg viewBox="0 0 64 64" className="w-[66%] h-[66%] text-[#b4654d]" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
          <path d="M 32 14 C 27 20, 22 26, 22 34 C 22 40, 26 44, 32 44 C 38 44, 42 40, 42 34 C 42 26, 37 20, 32 14 Z" strokeWidth="1.5" fill="rgba(180, 101, 77, 0.2)" />
          <circle cx="32" cy="34" r="3" fill="#e8c97a" stroke="none" />
          <line x1="20" y1="50" x2="44" y2="50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="44" x2="22" y2="50" strokeWidth="1.5" />
          <line x1="38" y1="44" x2="42" y2="50" strokeWidth="1.5" />
          <line x1="32" y1="44" x2="32" y2="50" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
}

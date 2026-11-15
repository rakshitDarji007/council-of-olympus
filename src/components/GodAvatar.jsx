import React from 'react';

/**
 * Authentic Greek Vase Black/Red-Figure Avatars for:
 * - Athena (Wisdom, Helmet, Owl)
 * - Poseidon (Storms, Trident, Waves)
 * - Hermes (Messenger, Winged Hat, Caduceus)
 * - Odysseus (The Wanderer, Sailor Cap, Stern Survivor)
 * - Oracle (The Prophetic Veil, Delphic Fire)
 */
export default function GodAvatar({
  speaker = 'athena',
  size = 140,
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
        backgroundColor: '#1B1B16',
        border: isActive ? '3px solid #EE8A2E' : '2px solid #9B3B33',
        boxShadow: isActive
          ? '0 0 25px rgba(238, 138, 46, 0.65), inset 0 0 15px rgba(238, 138, 46, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Decorative Greek Meander Ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#EE8A2E]/30 pointer-events-none" />

      {/* ATHENA */}
      {normalized === 'athena' && (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
          {/* Circular halo / background motif */}
          <circle cx="50" cy="50" r="42" fill="#132338" />
          
          {/* Corinthian Helmet with tall crest */}
          <path
            d="M 50 10 Q 56 6 62 10 Q 72 20 68 36 L 50 34 L 32 36 Q 28 20 38 10 Z"
            fill="#9B3B33"
          />
          {/* Horsehair crest plume in Odyssey Orange */}
          <path
            d="M 50 6 C 65 4, 76 18, 74 34 Q 72 24 58 14 Q 50 10 50 6 Z"
            fill="#EE8A2E"
          />
          {/* Helmet Nose guard & Cheek plates */}
          <path
            d="M 38 32 L 62 32 L 64 54 L 56 50 L 52 56 L 48 56 L 44 50 L 36 54 Z"
            fill="#EE8A2E"
          />
          {/* Eyes (Calm, piercing, wise) */}
          <ellipse cx="44" cy="42" rx="3.5" ry="2" fill="#FDF4CC" />
          <circle cx="44.5" cy="42" r="1.2" fill="#1B1B16" />
          <ellipse cx="56" cy="42" rx="3.5" ry="2" fill="#FDF4CC" />
          <circle cx="55.5" cy="42" r="1.2" fill="#1B1B16" />

          {/* Neck & Robe with Aegis Gorgoneion brooch */}
          <path d="M 42 56 L 58 56 L 68 84 L 32 84 Z" fill="#FDF4CC" />
          <path d="M 40 64 L 60 64 L 64 84 L 36 84 Z" fill="#9B3B33" />
          {/* Little Owl of Athena icon on chest */}
          <circle cx="50" cy="74" r="5" fill="#EE8A2E" />
          <circle cx="48" cy="73" r="1.2" fill="#FDF4CC" />
          <circle cx="52" cy="73" r="1.2" fill="#FDF4CC" />
        </svg>
      )}

      {/* POSEIDON */}
      {normalized === 'poseidon' && (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
          {/* Dark Sea Halo */}
          <circle cx="50" cy="50" r="42" fill="#0E232B" />
          
          {/* Wild foaming beard and sea-spray hair */}
          <path
            d="M 30 36 Q 22 52 26 72 Q 38 88 50 88 Q 62 88 74 72 Q 78 52 70 36 Q 64 22 50 22 Q 36 22 30 36 Z"
            fill="#1F5C66"
          />
          {/* Visage (Gruff, weathered terracotta face) */}
          <path
            d="M 36 34 Q 50 28 64 34 L 64 54 Q 50 64 36 54 Z"
            fill="#EE8A2E"
          />
          {/* Heavy Brow & Stern Eyes */}
          <path d="M 38 40 L 48 44 M 62 40 L 52 44" stroke="#752B24" strokeWidth="2.5" />
          <ellipse cx="44" cy="46" rx="3" ry="1.8" fill="#FDF4CC" />
          <circle cx="44" cy="46" r="1" fill="#1B1B16" />
          <ellipse cx="56" cy="46" rx="3" ry="1.8" fill="#FDF4CC" />
          <circle cx="56" cy="46" r="1" fill="#1B1B16" />

          {/* Golden Trident emblem held up */}
          <g transform="translate(62, 14) scale(0.65)">
            <path
              d="M 12 0 L 12 36 M 4 4 L 4 16 Q 12 24 20 16 L 20 4 M 12 0 L 8 8 L 16 8 Z"
              stroke="#EE8A2E"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          {/* Sea foam waves across chest */}
          <path
            d="M 28 78 Q 38 72 50 78 Q 62 72 72 78 L 72 88 L 28 88 Z"
            fill="#C1DDD0"
            opacity="0.9"
          />
        </svg>
      )}

      {/* HERMES */}
      {normalized === 'hermes' && (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
          {/* Warm terracotta background */}
          <circle cx="50" cy="50" r="42" fill="#291812" />
          
          {/* Winged Petasos Traveler's Hat */}
          <ellipse cx="50" cy="30" rx="28" ry="8" fill="#9B3B33" />
          <path d="M 34 28 Q 50 14 66 28 Z" fill="#EE8A2E" />
          
          {/* Wings on hat */}
          <path
            d="M 22 28 C 12 22, 10 12, 18 6 C 24 14, 24 22, 28 28 Z"
            fill="#FDF4CC"
          />
          <path
            d="M 78 28 C 88 22, 90 12, 82 6 C 76 14, 76 22, 72 28 Z"
            fill="#FDF4CC"
          />

          {/* Witty, energetic youthful face */}
          <path
            d="M 38 34 L 62 34 L 60 58 Q 50 68 40 58 Z"
            fill="#FDF4CC"
          />
          {/* Curly hair bangs */}
          <circle cx="42" cy="34" r="3" fill="#EE8A2E" />
          <circle cx="48" cy="33" r="3.5" fill="#EE8A2E" />
          <circle cx="54" cy="34" r="3" fill="#EE8A2E" />

          {/* Clever eyes with slight smirk */}
          <ellipse cx="45" cy="44" rx="3" ry="2.2" fill="#1B1B16" />
          <ellipse cx="55" cy="44" rx="3" ry="2.2" fill="#1B1B16" />
          {/* Smirk */}
          <path d="M 46 54 Q 52 58 57 53" stroke="#9B3B33" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Caduceus Staff emblem */}
          <g transform="translate(18, 52) scale(0.55)">
            <line x1="12" y1="0" x2="12" y2="40" stroke="#EE8A2E" strokeWidth="3" />
            <path
              d="M 4 10 Q 12 18 20 10 Q 12 2 4 10 M 4 24 Q 12 32 20 24 Q 12 16 4 24"
              stroke="#E4EC6A"
              strokeWidth="2.5"
              fill="none"
            />
            <circle cx="12" cy="2" r="3" fill="#E4EC6A" />
          </g>

          {/* Traveler's Chlamys cloak */}
          <path d="M 36 64 L 64 64 L 72 88 L 28 88 Z" fill="#EE8A2E" />
        </svg>
      )}

      {/* ODYSSEUS */}
      {normalized === 'odysseus' && (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
          {/* Deep Navy Sea-farer halo */}
          <circle cx="50" cy="50" r="42" fill="#102036" />
          
          {/* Sailor's Pileus Cap */}
          <path
            d="M 34 32 C 34 16, 66 16, 66 32 Z"
            fill="#DDD3C8"
            stroke="#9B3B33"
            strokeWidth="2"
          />
          {/* Rugged trimmed survivor beard and hair */}
          <path
            d="M 32 36 Q 26 56 32 72 Q 50 86 68 72 Q 74 56 68 36 Z"
            fill="#752B24"
          />
          {/* Weathered face */}
          <path
            d="M 36 34 L 64 34 L 62 58 Q 50 68 38 58 Z"
            fill="#EE8A2E"
          />
          {/* Battle-tested eyes with crow's feet */}
          <ellipse cx="44" cy="46" rx="3.2" ry="1.8" fill="#FDF4CC" />
          <circle cx="44" cy="46" r="1.1" fill="#1B1B16" />
          <ellipse cx="56" cy="46" rx="3.2" ry="1.8" fill="#FDF4CC" />
          <circle cx="56" cy="46" r="1.1" fill="#1B1B16" />
          {/* Scars of Scylla/Troy */}
          <line x1="39" y1="42" x2="43" y2="48" stroke="#752B24" strokeWidth="1.2" />

          {/* Ithaca survivor wool cloak with gold pin */}
          <path d="M 32 68 L 68 68 L 76 88 L 24 88 Z" fill="#9B3B33" />
          <circle cx="42" cy="72" r="3" fill="#EE8A2E" />
        </svg>
      )}

      {/* ORACLE */}
      {normalized === 'oracle' && (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
          {/* Mystical Navy/Purple Halo */}
          <circle cx="50" cy="50" r="42" fill="#191B2E" />
          
          {/* Prophetic Priestess Veil */}
          <path
            d="M 28 26 C 28 12, 72 12, 72 26 C 76 46, 76 74, 74 88 L 26 88 C 24 74, 24 46, 28 26 Z"
            fill="#FDF4CC"
          />
          {/* Golden Laurel Crown */}
          <path
            d="M 34 30 Q 50 24 66 30"
            stroke="#EE8A2E"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="42" cy="28" r="2" fill="#E4EC6A" />
          <circle cx="50" cy="26" r="2.5" fill="#E4EC6A" />
          <circle cx="58" cy="28" r="2" fill="#E4EC6A" />

          {/* Serene, timeless face */}
          <path
            d="M 40 34 L 60 34 L 58 58 Q 50 66 42 58 Z"
            fill="#9B3B33"
          />
          {/* All-seeing luminous eyes */}
          <ellipse cx="46" cy="45" rx="3" ry="1.5" fill="#E4EC6A" />
          <ellipse cx="54" cy="45" rx="3" ry="1.5" fill="#E4EC6A" />

          {/* Delphic Tripod Flame motif */}
          <path
            d="M 50 68 C 47 74, 44 78, 50 84 C 56 78, 53 74, 50 68 Z"
            fill="#EE8A2E"
          />
        </svg>
      )}
    </div>
  );
}

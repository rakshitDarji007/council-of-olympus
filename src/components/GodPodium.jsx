import React from 'react';
import GodAvatar from './GodAvatar.jsx';
import { Shield, Anchor, Feather, Swords } from 'lucide-react';

const GOD_INFO = {
  athena: {
    name: 'ATHENA',
    greekTitle: 'Ἀθηνᾶ',
    domain: 'Wisdom & Long-term Strategy',
    quote: 'Master the machine, then command its soul.',
    color: '#C1DDD0',
    accent: '#EE8A2E',
    icon: Shield,
    glowClass: 'shadow-athena-glow border-[#C1DDD0]',
  },
  poseidon: {
    name: 'POSEIDON',
    greekTitle: 'Ποσειδῶν',
    domain: 'Storms, Risk & Consequence',
    quote: 'The sea does not negotiate with optimism.',
    color: '#1F5C66',
    accent: '#9B3B33',
    icon: Anchor,
    glowClass: 'shadow-poseidon-glow border-[#1F5C66]',
  },
  hermes: {
    name: 'HERMES',
    greekTitle: 'Ἑρμῆς',
    domain: 'Wayfinding, Loopholes & Agility',
    quote: 'Why drown when you can test the waters?',
    color: '#EE8A2E',
    accent: '#E4EC6A',
    icon: Feather,
    glowClass: 'shadow-hermes-glow border-[#EE8A2E]',
  },
};

export default function GodPodium({
  speaker = 'athena',
  isActive = false,
  currentStance = null,
  latestTurnText = null,
  onChallenge = null,
  isChallenging = false,
}) {
  const info = GOD_INFO[speaker.toLowerCase()] || GOD_INFO.athena;
  const IconComponent = info.icon;

  const stanceLabels = {
    for: { label: 'STRATEGIC ADVANCE', color: 'bg-[#1F5C66] text-[#C1DDD0] border-[#C1DDD0]' },
    against: { label: 'WRECKAGE WARNING', color: 'bg-[#9B3B33] text-[#FDF4CC] border-[#EE8A2E]' },
    conditional: { label: 'THE MIDDLE ROUTE', color: 'bg-[#2B2312] text-[#EE8A2E] border-[#EE8A2E]' },
  };

  const stanceInfo = currentStance ? stanceLabels[currentStance] : null;

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-700 select-none ${
        isActive
          ? 'scale-105 -translate-y-3 z-30 opacity-100'
          : 'scale-95 translate-y-1 z-10 opacity-70 hover:opacity-90'
      }`}
      style={{ width: '280px' }}
    >
      {/* Active God Halo Aura */}
      {isActive && (
        <div
          className="absolute -inset-4 rounded-3xl blur-xl opacity-60 animate-pulse pointer-events-none"
          style={{ backgroundColor: info.accent }}
        />
      )}

      {/* Stance Indicator Badge (Floats above Avatar) */}
      <div className="h-8 flex items-center justify-center mb-1">
        {stanceInfo && (
          <div
            className={`px-3 py-0.5 rounded-full text-[10px] tracking-widest font-serif uppercase border font-bold shadow-md transition-all ${stanceInfo.color}`}
          >
            {stanceInfo.label}
          </div>
        )}
      </div>

      {/* God Avatar */}
      <div className="relative">
        <GodAvatar
          speaker={speaker}
          size={135}
          isActive={isActive}
        />

        {/* Small Domain Icon Badge */}
        <div
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#FDF4CC] shadow-md"
          style={{ backgroundColor: '#1B1B16' }}
        >
          <IconComponent size={16} color={info.accent} />
        </div>
      </div>

      {/* Name & Domain Banner */}
      <div className="w-full mt-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <h3
            className={`font-heading text-xl tracking-wider transition-colors ${
              isActive ? 'text-[#EE8A2E] glow-orange' : 'text-[#FDF4CC]'
            }`}
          >
            {info.name}
          </h3>
          <span className="text-[12px] text-[#C1DDD0]/70 font-serif">
            ({info.greekTitle})
          </span>
        </div>
        <p className="text-[12px] text-[#DDD3C8] font-body tracking-wide uppercase font-semibold">
          {info.domain}
        </p>
      </div>

      {/* Recent Quote / Speech snippet */}
      <div className="w-full px-3 py-2 mt-2 min-h-[58px] flex items-center justify-center text-center rounded-lg bg-[#1B1B16]/90 border border-[#EE8A2E]/20 shadow-inner">
        <p className="text-[13px] text-[#FDF4CC]/90 italic font-body line-clamp-2">
          "{latestTurnText || info.quote}"
        </p>
      </div>

      {/* Challenge / Call Bluff Button */}
      {onChallenge && (
        <button
          onClick={() => onChallenge(speaker)}
          disabled={isChallenging}
          className="mt-2.5 px-3 py-1 text-[11px] font-serif font-bold tracking-wider uppercase rounded border border-[#9B3B33] bg-[#1B1B16] text-[#EE8A2E] hover:bg-[#9B3B33] hover:text-[#FDF4CC] transition-all flex items-center gap-1.5 shadow"
        >
          <Swords size={12} />
          Challenge {info.name}
        </button>
      )}

      {/* Classical Stone Pedestal Base */}
      <div className="w-48 mt-3 relative">
        {/* Capital */}
        <div className="w-full h-3 bg-[#DDD3C8] rounded-t-sm border-b border-[#9B3B33]" />
        {/* Column body */}
        <div className="w-40 mx-auto h-6 bg-[#B8AFA5] flex justify-around px-2 border-x border-[#9B3B33]">
          <div className="w-1 h-full bg-[#DDD3C8]/70" />
          <div className="w-1 h-full bg-[#DDD3C8]/70" />
          <div className="w-1 h-full bg-[#DDD3C8]/70" />
          <div className="w-1 h-full bg-[#DDD3C8]/70" />
        </div>
        {/* Base */}
        <div className="w-full h-3 bg-[#9B3B33] rounded-b-sm" />
      </div>
    </div>
  );
}

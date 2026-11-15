import React from 'react';
import GodAvatar from './GodAvatar.jsx';
import { Shield, Anchor, Feather, Swords } from 'lucide-react';

const GOD_INFO = {
  athena: {
    name: 'ATHENA',
    domain: 'Strategy & Compounding Leverage',
    quote: 'Marry technical mastery with human judgment. Build leverage.',
    color: '#94B49F',
    accent: '#D97746',
    icon: Shield,
  },
  poseidon: {
    name: 'POSEIDON',
    domain: 'Runway & Downside Risk',
    quote: 'Protect your downside first. Hope is not an operational plan.',
    color: '#2A7385',
    accent: '#B35B30',
    icon: Anchor,
  },
  hermes: {
    name: 'HERMES',
    domain: 'Optionality & Agile Pilots',
    quote: 'Never accept a false binary when an inexpensive test exists.',
    color: '#D97746',
    accent: '#E89162',
    icon: Feather,
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
    for: { label: 'Strategic Endorsement', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' },
    against: { label: 'Downside Exposure', color: 'bg-rose-950/60 text-rose-300 border-rose-500/30' },
    conditional: { label: 'Pragmatic Middle Path', color: 'bg-amber-950/60 text-amber-300 border-amber-500/30' },
  };

  const stanceInfo = currentStance ? stanceLabels[currentStance] : null;

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl p-5 transition-all duration-500 select-none ${
        isActive
          ? 'editorial-card-active scale-[1.03] -translate-y-2 z-30'
          : 'editorial-card scale-100 translate-y-0 z-10 opacity-75 hover:opacity-95'
      }`}
      style={{ width: '280px', minHeight: '340px' }}
    >
      {/* Stance Tag */}
      <div className="h-6 flex items-center justify-center mb-3">
        {stanceInfo ? (
          <span
            className={`px-3 py-0.5 rounded-full text-[11px] font-sans font-medium tracking-wide border shadow-sm ${stanceInfo.color}`}
          >
            {stanceInfo.label}
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 font-sans tracking-wide">
            Awaiting Turn
          </span>
        )}
      </div>

      {/* Insignia Medallion */}
      <div className="relative mb-4">
        <GodAvatar
          speaker={speaker}
          size={100}
          isActive={isActive}
        />

        {/* Small Domain Badge */}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center shadow">
          <IconComponent size={14} className="text-[#D97746]" />
        </div>
      </div>

      {/* Name & Domain */}
      <div className="text-center w-full mb-3">
        <h3
          className={`font-display text-lg font-bold tracking-wider transition-colors ${
            isActive ? 'text-[#D97746]' : 'text-slate-100'
          }`}
        >
          {info.name}
        </h3>
        <p className="text-[11px] text-slate-400 font-sans tracking-tight">
          {info.domain}
        </p>
      </div>

      {/* Recent Perspective snippet */}
      <div className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex-1 flex items-center justify-center text-center">
        <p className="text-[12px] text-slate-300 font-serif italic leading-relaxed line-clamp-3">
          "{latestTurnText || info.quote}"
        </p>
      </div>

      {/* Active Audio Waveform bars when speaking */}
      {isActive && (
        <div className="flex items-center gap-1 mt-3 mb-1">
          <span className="w-1 h-3 bg-[#D97746] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-5 bg-[#D97746] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-2 bg-[#D97746] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          <span className="w-1 h-4 bg-[#D97746] rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
        </div>
      )}

      {/* Challenge Button */}
      {onChallenge && (
        <button
          onClick={() => onChallenge(speaker)}
          disabled={isChallenging}
          className="mt-3 w-full py-1.5 px-3 rounded-lg border border-white/10 bg-slate-800/40 hover:bg-slate-800 hover:border-[#D97746]/50 text-slate-300 hover:text-[#D97746] text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1.5"
        >
          <Swords size={12} />
          Challenge Position
        </button>
      )}
    </div>
  );
}

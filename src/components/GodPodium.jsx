import React from 'react';
import GodAvatar from './GodAvatar.jsx';
import { Shield, Anchor, Feather, Swords } from 'lucide-react';

const GOD_INFO = {
  athena: {
    name: 'ATHENA',
    title: 'Strategy & Compounding',
    domain: 'Long-term leverage, skill moats, intellectual discipline.',
    color: '#94B49F',
    accentColor: '#e8c97a',
    icon: Shield,
  },
  poseidon: {
    name: 'POSEIDON',
    title: 'Downside & Runway',
    domain: 'Cash runway, irreversible friction, downside exposure.',
    color: '#8ca1aa',
    accentColor: '#305873',
    icon: Anchor,
  },
  hermes: {
    name: 'HERMES',
    title: 'Agility & Optionality',
    domain: 'Rapid pilots, cheap reversibility, asymmetric upside.',
    color: '#b4654d',
    accentColor: '#e8c97a',
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

  const stanceBadges = {
    for: { label: 'Strategic Endorsement', dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/60 border-emerald-500/30' },
    against: { label: 'Downside Exposure', dot: 'bg-rose-400', text: 'text-rose-300', bg: 'bg-rose-950/60 border-rose-500/30' },
    conditional: { label: 'Pragmatic Pivot', dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/60 border-amber-500/30' },
  };

  const currentStanceInfo = currentStance ? stanceBadges[currentStance] : null;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 select-none ${
        isActive
          ? 'odyssey-night-card-active -translate-y-2 z-20 scale-[1.02]'
          : 'odyssey-night-card opacity-85 hover:opacity-100 z-10'
      }`}
      style={{ width: '300px', minHeight: '380px' }}
    >
      {/* Top Status & Stance */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ded0bc]/20">
          {/* Active status indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-[#e8c97a] animate-pulse' : 'bg-[#8ca1aa]/50'
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ded0bc]/80 font-semibold">
              {isActive ? 'Floor Active' : 'Listening'}
            </span>
          </div>

          {/* Stance Capsule */}
          {currentStanceInfo ? (
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono tracking-wider uppercase font-semibold ${currentStanceInfo.bg} ${currentStanceInfo.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentStanceInfo.dot}`} />
              <span>{currentStanceInfo.label}</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-[#ded0bc]/50 uppercase">Pending</span>
          )}
        </div>

        {/* Insignia & Speaker Identity */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative shrink-0">
            <GodAvatar
              speaker={speaker}
              size={64}
              isActive={isActive}
            />
          </div>

          <div>
            <h3 className="font-display text-base font-bold tracking-wider text-[#f6eddf] uppercase">
              {info.name}
            </h3>
            <p className="text-xs font-sans text-[#e8c97a] font-semibold">
              {info.title}
            </p>
          </div>
        </div>

        {/* Strategic Focus Domain */}
        <p className="text-xs font-sans text-[#ded0bc]/90 leading-relaxed mb-4">
          {info.domain}
        </p>

        {/* Latest Argument Excerpt in Literary Serif */}
        {latestTurnText && (
          <div className="p-3.5 rounded-2xl bg-[#041321]/60 border border-[#ded0bc]/15 text-xs font-serif text-[#f6eddf] italic leading-relaxed line-clamp-3">
            "{latestTurnText}"
          </div>
        )}
      </div>

      {/* Bottom Audio VU Waveform / Challenge */}
      <div className="pt-4 border-t border-[#ded0bc]/20 mt-4 flex items-center justify-between">
        {/* Audio Visualizer Bars */}
        <div className="flex items-end gap-1 h-5">
          {isActive ? (
            <>
              <span className="w-1 bg-[#e8c97a] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-[#e8c97a] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-5" />
              <span className="w-1 bg-[#b4654d] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s] h-2.5" />
              <span className="w-1 bg-[#e8c97a] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.3s] h-4" />
            </>
          ) : (
            <>
              <span className="w-1 bg-[#ded0bc]/30 rounded-full h-1.5" />
              <span className="w-1 bg-[#ded0bc]/30 rounded-full h-1.5" />
              <span className="w-1 bg-[#ded0bc]/30 rounded-full h-1.5" />
              <span className="w-1 bg-[#ded0bc]/30 rounded-full h-1.5" />
            </>
          )}
        </div>

        {/* Interrogate / Challenge Button */}
        {onChallenge && (
          <button
            onClick={() => onChallenge(speaker)}
            disabled={isChallenging}
            className="text-[11px] font-mono tracking-wider uppercase text-[#f6eddf] hover:text-[#e8c97a] transition flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6eddf]/10 border border-[#ded0bc]/25 hover:bg-[#f6eddf]/20 disabled:opacity-40"
          >
            <Swords size={12} />
            <span>Challenge</span>
          </button>
        )}
      </div>
    </div>
  );
}

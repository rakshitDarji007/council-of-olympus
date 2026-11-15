import React from 'react';
import GodAvatar from './GodAvatar.jsx';
import { Shield, Anchor, Feather, Swords } from 'lucide-react';

const GOD_INFO = {
  athena: {
    name: 'ATHENA',
    title: 'Strategy & Compounding',
    domain: 'Long-term leverage, skill moats, intellectual discipline.',
    color: '#94B49F',
    icon: Shield,
  },
  poseidon: {
    name: 'POSEIDON',
    title: 'Downside & Runway',
    domain: 'Cash runway, irreversible friction, downside exposure.',
    color: '#2A7385',
    icon: Anchor,
  },
  hermes: {
    name: 'HERMES',
    title: 'Agility & Optionality',
    domain: 'Rapid pilots, cheap reversibility, asymmetric upside.',
    color: '#E8A28E',
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

  const stanceBadges = {
    for: { label: 'Strategic Endorsement', dot: 'bg-emerald-400', text: 'text-emerald-300' },
    against: { label: 'Downside Exposure', dot: 'bg-rose-400', text: 'text-rose-300' },
    conditional: { label: 'Pragmatic Pivot', dot: 'bg-amber-400', text: 'text-amber-300' },
  };

  const currentStanceInfo = currentStance ? stanceBadges[currentStance] : null;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-500 select-none ${
        isActive
          ? 'editorial-card-active -translate-y-2 z-20 scale-[1.02]'
          : 'editorial-card opacity-80 hover:opacity-100 z-10'
      }`}
      style={{ width: '295px', minHeight: '380px' }}
    >
      {/* Top Status & Stance */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
          {/* Active status indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-[#E8A28E] animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
              {isActive ? 'Floor Active' : 'Listening'}
            </span>
          </div>

          {/* Stance Capsule */}
          {currentStanceInfo ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full frosted-capsule">
              <span className={`w-1.5 h-1.5 rounded-full ${currentStanceInfo.dot}`} />
              <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${currentStanceInfo.text}`}>
                {currentStanceInfo.label}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-zinc-600 uppercase">Pending</span>
          )}
        </div>

        {/* Insignia & Speaker Identity */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative shrink-0">
            <GodAvatar
              speaker={speaker}
              size={68}
              isActive={isActive}
            />
          </div>

          <div>
            <h3 className="font-display text-base font-bold tracking-wider text-white uppercase">
              {info.name}
            </h3>
            <p className="text-xs font-sans text-[#E8A28E] font-medium">
              {info.title}
            </p>
          </div>
        </div>

        {/* Strategic Focus Domain */}
        <p className="text-xs font-sans text-zinc-300 leading-relaxed mb-4">
          {info.domain}
        </p>

        {/* Latest Argument Excerpt in Literary Serif */}
        {latestTurnText && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs font-serif text-zinc-200 italic leading-relaxed line-clamp-3">
            "{latestTurnText}"
          </div>
        )}
      </div>

      {/* Bottom Audio VU Waveform / Challenge */}
      <div className="pt-4 border-t border-white/[0.08] mt-4 flex items-center justify-between">
        {/* Hardware-style Audio Visualizer Bars */}
        <div className="flex items-end gap-1 h-5">
          {isActive ? (
            <>
              <span className="w-1 bg-[#E8A28E] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-[#E8A28E] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-5" />
              <span className="w-1 bg-[#E8A28E] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s] h-2.5" />
              <span className="w-1 bg-[#E8A28E] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.3s] h-4" />
            </>
          ) : (
            <>
              <span className="w-1 bg-zinc-700/60 rounded-full h-1.5" />
              <span className="w-1 bg-zinc-700/60 rounded-full h-1.5" />
              <span className="w-1 bg-zinc-700/60 rounded-full h-1.5" />
              <span className="w-1 bg-zinc-700/60 rounded-full h-1.5" />
            </>
          )}
        </div>

        {/* Interrogate / Challenge Button */}
        {onChallenge && (
          <button
            onClick={() => onChallenge(speaker)}
            disabled={isChallenging}
            className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 hover:text-[#E8A28E] transition flex items-center gap-1.5 px-3 py-1 rounded-full frosted-capsule disabled:opacity-50"
          >
            <Swords size={12} />
            <span>Challenge</span>
          </button>
        )}
      </div>
    </div>
  );
}

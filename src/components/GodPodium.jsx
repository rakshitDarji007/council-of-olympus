import React from 'react';
import GodAvatar from './GodAvatar.jsx';
import { Shield, Anchor, Feather, Swords, Sparkles } from 'lucide-react';

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
    domain: 'Cash reserves, debt exposure, irreversible friction.',
    color: '#2A7385',
    icon: Anchor,
  },
  hermes: {
    name: 'HERMES',
    title: 'Agility & Optionality',
    domain: 'Rapid pilots, cheap reversibility, asymmetric upside.',
    color: '#D4A373',
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
      className={`relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-300 select-none ${
        isActive
          ? 'editorial-card-active -translate-y-1.5 z-20'
          : 'editorial-card opacity-80 hover:opacity-100 z-10'
      }`}
      style={{ width: '290px', minHeight: '360px' }}
    >
      {/* Top Status & Stance */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          {/* Active status indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-[#D4A373] animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
              {isActive ? 'Floor Active' : 'Listening'}
            </span>
          </div>

          {/* Stance Pip */}
          {currentStanceInfo ? (
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${currentStanceInfo.dot}`} />
              <span className={`text-[11px] font-sans font-medium ${currentStanceInfo.text}`}>
                {currentStanceInfo.label}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-zinc-600">Pending</span>
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
            <h3 className="font-heading text-lg font-bold tracking-wide text-zinc-100">
              {info.name}
            </h3>
            <p className="text-xs font-sans text-[#D4A373] font-medium">
              {info.title}
            </p>
          </div>
        </div>

        {/* Strategic Focus Domain */}
        <p className="text-xs font-sans text-zinc-400 leading-relaxed mb-4">
          {info.domain}
        </p>

        {/* Latest Argument Excerpt */}
        {latestTurnText && (
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] text-xs font-serif text-zinc-300 italic leading-snug line-clamp-3">
            "{latestTurnText}"
          </div>
        )}
      </div>

      {/* Bottom Audio VU Waveform / Challenge */}
      <div className="pt-4 border-t border-white/[0.05] mt-4 flex items-center justify-between">
        {/* Hardware-style Audio Visualizer Bars */}
        <div className="flex items-end gap-1 h-4">
          {isActive ? (
            <>
              <span className="w-1 bg-[#D4A373] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-[#D4A373] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.1s] h-4" />
              <span className="w-1 bg-[#D4A373] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s] h-2" />
              <span className="w-1 bg-[#D4A373] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.3s] h-3.5" />
            </>
          ) : (
            <>
              <span className="w-1 bg-zinc-700/50 rounded-full h-1.5" />
              <span className="w-1 bg-zinc-700/50 rounded-full h-1.5" />
              <span className="w-1 bg-zinc-700/50 rounded-full h-1.5" />
              <span className="w-1 bg-zinc-700/50 rounded-full h-1.5" />
            </>
          )}
        </div>

        {/* Interrogate / Challenge Button */}
        {onChallenge && (
          <button
            onClick={() => onChallenge(speaker)}
            disabled={isChallenging}
            className="text-[11px] font-sans font-medium text-zinc-400 hover:text-[#D4A373] transition flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-white/[0.04] disabled:opacity-50"
          >
            <Swords size={12} />
            <span>Challenge</span>
          </button>
        )}
      </div>
    </div>
  );
}

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
  isInterruption = false,
  orbitSlot = 'TOP',
  animClass = '',
  currentStance = null,
  latestTurnText = null,
  onChallenge = null,
  onInterrupt = null,
  isChallenging = false,
}) {
  const normalized = speaker.toLowerCase();
  const info = GOD_INFO[normalized] || GOD_INFO.athena;

  const stanceBadges = {
    for: { label: 'Strategic Endorsement', dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/70 border-emerald-500/40' },
    against: { label: 'Downside Exposure', dot: 'bg-rose-400', text: 'text-rose-300', bg: 'bg-rose-950/70 border-rose-500/40' },
    conditional: { label: 'Pragmatic Pivot', dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/70 border-amber-500/40' },
  };

  const currentStanceInfo = currentStance ? stanceBadges[currentStance] : null;

  // Static slot classes when not actively animating
  const slotClass = animClass || (
    orbitSlot === 'TOP'
      ? 'orbit-slot-top'
      : orbitSlot === 'BOTTOM_RIGHT'
      ? 'orbit-slot-bottom-right'
      : 'orbit-slot-bottom-left'
  );

  return (
    <div
      className={`absolute top-4 left-1/2 flex flex-col justify-between rounded-3xl p-5 sm:p-6 select-none transition-[opacity,box-shadow,border-color] duration-500 will-change-transform ${slotClass} ${
        isActive
          ? 'odyssey-night-card-active shadow-[0_16px_40px_rgba(4,19,33,0.55)]'
          : 'odyssey-night-card hover:opacity-95 hover:border-[#ded0bc]/40'
      }`}
      style={{
        width: 'clamp(265px, 28vw, 305px)',
        minHeight: '375px',
      }}
    >
      {/* ====================================================================
          SUBTLE AESTHETIC BACKLIGHT AURA (Warm, atmospheric diffusion)
          ==================================================================== */}
      {isActive && (
        <div
          className={`absolute -inset-3 sm:-inset-4 rounded-[32px] -z-10 pointer-events-none transition-all duration-700 animate-[backlightSignPulse_3s_ease-in-out_infinite] ${
            normalized === 'athena'
              ? 'backlight-aura-athena'
              : normalized === 'poseidon'
              ? 'backlight-aura-poseidon'
              : 'backlight-aura-hermes'
          }`}
        />
      )}

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
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ded0bc]/90 font-semibold">
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
            <span className="text-[10px] font-mono text-[#ded0bc]/50 uppercase">Deliberating</span>
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
          <div className="p-3.5 rounded-2xl bg-[#041321]/70 border border-[#ded0bc]/20 text-xs font-serif text-[#f6eddf] italic leading-relaxed line-clamp-3">
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
              <span className="w-1 bg-[#e8c97a] rounded-full animate-[pulse_0.45s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-[#e8c97a] rounded-full animate-[pulse_0.65s_ease-in-out_infinite_0.1s] h-5" />
              <span className="w-1 bg-[#b4654d] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s] h-2.5" />
              <span className="w-1 bg-[#e8c97a] rounded-full animate-[pulse_0.75s_ease-in-out_infinite_0.3s] h-4" />
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

        {/* Clean Challenge Button */}
        {onChallenge && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChallenge(speaker);
            }}
            disabled={isChallenging}
            className="text-[10px] font-mono tracking-wider uppercase text-[#f6eddf] hover:text-[#e8c97a] transition flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6eddf]/10 border border-[#ded0bc]/25 hover:bg-[#f6eddf]/20 disabled:opacity-40"
          >
            <Swords size={11} />
            <span>Challenge</span>
          </button>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import GodAvatar from './GodAvatar.jsx';
import { Shield, Anchor, Feather, Swords, Zap } from 'lucide-react';

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
      className={`absolute top-4 left-1/2 flex flex-col justify-between rounded-3xl p-5 sm:p-6 select-none transition-shadow duration-500 ${slotClass} ${
        isActive
          ? 'odyssey-night-card-active shadow-[0_20px_50px_rgba(4,19,33,0.7)]'
          : 'odyssey-night-card hover:opacity-100 hover:border-[#ded0bc]/50 cursor-pointer'
      }`}
      style={{
        width: 'clamp(270px, 80vw, 310px)',
        minHeight: '380px',
      }}
      onClick={() => {
        if (!isActive && onInterrupt) {
          onInterrupt(speaker);
        }
      }}
    >
      {/* ====================================================================
          LUMINOUS BACKLIGHT SIGN AURA (Radiating outward behind the card)
          ==================================================================== */}
      {isActive && (
        <div
          className={`absolute -inset-4 sm:-inset-6 rounded-[36px] -z-10 pointer-events-none transition-all duration-700 animate-[backlightSignPulse_3s_ease-in-out_infinite] ${
            normalized === 'athena'
              ? 'backlight-aura-athena'
              : normalized === 'poseidon'
              ? 'backlight-aura-poseidon'
              : 'backlight-aura-hermes'
          } ${isInterruption ? 'animate-[interruptionShockwave_0.75s_ease-out_forwards]' : ''}`}
        />
      )}

      {/* ====================================================================
          BACKLIT NEON SIGN PLAQUE (Perched on top rim)
          ==================================================================== */}
      {isActive ? (
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase font-bold flex items-center gap-2 shadow-2xl whitespace-nowrap z-40 transition-all duration-300 ${
            isInterruption
              ? 'bg-gradient-to-r from-[#b4654d] via-[#e8c97a] to-[#b4654d] text-[#041321] border border-[#f6eddf] shadow-[0_0_24px_rgba(232,201,122,0.85)] animate-pulse'
              : normalized === 'athena'
              ? 'bg-[#041321]/95 text-[#e8c97a] border border-[#e8c97a] shadow-[0_0_20px_rgba(232,201,122,0.6)]'
              : normalized === 'poseidon'
              ? 'bg-[#041321]/95 text-[#8ca1aa] border border-[#4a90bc] shadow-[0_0_20px_rgba(74,144,188,0.7)]'
              : 'bg-[#041321]/95 text-[#f6eddf] border border-[#b4654d] shadow-[0_0_20px_rgba(212,114,87,0.7)]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isInterruption ? 'bg-[#041321] animate-ping' : 'bg-[#e8c97a] animate-pulse'
            }`}
          />
          <span>
            {isInterruption
              ? '⚡ INTERRUPTION • THE FLOOR SEIZED'
              : `ORATOR AT APEX • ${info.name}`}
          </span>
        </div>
      ) : (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase text-[#ded0bc]/70 bg-[#041321]/90 border border-[#ded0bc]/25 shadow-md whitespace-nowrap">
          {orbitSlot === 'BOTTOM_RIGHT' ? 'On Deck in Orbit' : 'Listening in Orbit'}
        </div>
      )}

      {/* Top Status & Stance */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ded0bc]/20">
          {/* Active status indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-[#e8c97a] animate-pulse shadow-[0_0_8px_#e8c97a]' : 'bg-[#8ca1aa]/50'
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ded0bc]/90 font-bold">
              {isActive ? 'Council Floor Active' : 'Stationed in Ring'}
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
            {isActive && (
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c97a] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e8c97a]" />
              </span>
            )}
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
          <div className="p-3.5 rounded-2xl bg-[#041321]/70 border border-[#ded0bc]/20 text-xs font-serif text-[#f6eddf] italic leading-relaxed line-clamp-3 shadow-inner">
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

        {/* Actions: Interrupt or Challenge Button */}
        <div className="flex items-center gap-1.5">
          {!isActive && onInterrupt && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInterrupt(speaker);
              }}
              title={`Trigger ${info.name} to interrupt immediately straight up`}
              className="text-[10px] font-mono tracking-wider uppercase text-[#e8c97a] hover:text-[#f6eddf] transition flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e8c97a]/15 border border-[#e8c97a]/40 hover:bg-[#e8c97a]/30"
            >
              <Zap size={11} className="text-[#e8c97a]" />
              <span>Interrupt</span>
            </button>
          )}

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
    </div>
  );
}

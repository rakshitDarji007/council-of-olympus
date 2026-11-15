import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, FastForward, MessageSquare, Pause, Play } from 'lucide-react';

export default function SubtitleBar({
  currentTurn,
  turnIndex = 0,
  totalTurns = 6,
  isPlaying = false,
  isMuted = false,
  onToggleMute,
  onNextTurn,
  onSkipToVerdict,
  onOpenInterject,
  onTogglePlayPause,
  isGenerating = false,
}) {
  const [displayedText, setDisplayedText] = useState('');

  const speakerMeta = {
    athena: { name: 'ATHENA', color: '#94B49F', title: 'Strategic Counsel' },
    poseidon: { name: 'POSEIDON', color: '#2A7385', title: 'Risk & Runway' },
    hermes: { name: 'HERMES', color: '#D97746', title: 'Agile Optionality' },
    oracle: { name: 'THE FACILITATOR', color: '#D97746', title: 'Context Discovery' },
    odysseus: { name: 'ODYSSEUS', color: '#F8F6F0', title: 'The Ruling' },
  };

  const currentSpeaker = currentTurn?.speaker?.toLowerCase() || 'athena';
  const meta = speakerMeta[currentSpeaker] || speakerMeta.athena;
  const fullText = currentTurn?.text || 'The council gathers in silence...';

  // Smooth typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const totalDurationMs = 2400; // Snappy typing
    const stepInterval = Math.max(12, Math.floor(totalDurationMs / (fullText.length || 1)));

    const timer = setInterval(() => {
      idx++;
      setDisplayedText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        clearInterval(timer);
      }
    }, stepInterval);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 select-none">
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-2xl relative">
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="font-display text-base sm:text-lg font-bold tracking-wider"
              style={{ color: meta.color }}
            >
              {meta.name}
            </span>
            <span className="text-xs text-slate-400 font-sans">
              • {meta.title}
            </span>
            {currentTurn?.addressed_to && (
              <span className="text-[11px] text-[#D97746] bg-[#D97746]/10 px-2 py-0.5 rounded border border-[#D97746]/20 font-sans">
                Addressing: {currentTurn.addressed_to.toUpperCase()}
              </span>
            )}
          </div>

          {/* Turn Progress Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="hidden sm:inline">Turn {turnIndex + 1} of {totalTurns}</span>
            <div className="flex gap-1.5 ml-1">
              {Array.from({ length: totalTurns }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === turnIndex
                      ? 'bg-[#D97746] scale-125'
                      : i < turnIndex
                      ? 'bg-slate-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Typewriter Text in Literary Serif */}
        <div className="min-h-[60px] sm:min-h-[70px] flex items-center mb-4">
          <p className="text-base sm:text-xl text-slate-100 font-serif leading-relaxed tracking-wide font-normal">
            "{displayedText}"
            {displayedText.length < fullText.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#D97746] animate-pulse" />
            )}
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-2">
          {/* Interject Button */}
          <button
            onClick={onOpenInterject}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-[#D97746] hover:bg-[#E89162] text-[#0A0F1D] font-sans text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2 shadow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <MessageSquare size={14} />
            Interject with New Context
          </button>

          {/* Controls Group */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={onTogglePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            {/* Mute */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className={`p-2 rounded-xl border transition ${
                isMuted
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Next Turn */}
            <button
              onClick={onNextTurn}
              disabled={turnIndex >= totalTurns - 1}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-[#D97746] border border-white/10 text-xs font-sans font-medium flex items-center gap-1.5 transition disabled:opacity-40"
            >
              <SkipForward size={14} />
              <span className="hidden sm:inline">Next Turn</span>
            </button>

            {/* Skip to Verdict */}
            <button
              onClick={onSkipToVerdict}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-sans text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
            >
              <FastForward size={14} />
              <span>Verdict</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

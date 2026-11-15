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
    athena: { name: 'ATHENA', color: '#94B49F', title: 'Strategic Mastery' },
    poseidon: { name: 'POSEIDON', color: '#2A7385', title: 'Downside Exposure' },
    hermes: { name: 'HERMES', color: '#D4A373', title: 'Agile Optionality' },
    oracle: { name: 'FACILITATOR', color: '#D4A373', title: 'Context Discovery' },
    odysseus: { name: 'ODYSSEUS', color: '#F4F4F6', title: 'The Ruling' },
  };

  const currentSpeaker = currentTurn?.speaker?.toLowerCase() || 'athena';
  const meta = speakerMeta[currentSpeaker] || speakerMeta.athena;
  const fullText = currentTurn?.text || 'The council deliberates in quiet consideration...';

  // Crisp, readable typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const totalDurationMs = 2000;
    const stepInterval = Math.max(10, Math.floor(totalDurationMs / (fullText.length || 1)));

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
      <div className="editorial-card rounded-2xl p-6 relative">
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="font-mono text-xs font-bold tracking-widest uppercase"
              style={{ color: meta.color }}
            >
              {meta.name}
            </span>
            <span className="text-zinc-500 text-xs font-sans">
              • {meta.title}
            </span>
            {currentTurn?.addressed_to && (
              <span className="text-[10px] font-mono text-[#D4A373] bg-[#D4A373]/10 px-2 py-0.5 rounded border border-[#D4A373]/20">
                To: {currentTurn.addressed_to.toUpperCase()}
              </span>
            )}
          </div>

          {/* Turn Progress Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Turn {turnIndex + 1} of {totalTurns}</span>
            <div className="flex gap-1 ml-1.5">
              {Array.from({ length: totalTurns }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === turnIndex
                      ? 'bg-[#D4A373] scale-125'
                      : i < turnIndex
                      ? 'bg-zinc-400'
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Spoken Dialogue */}
        <div className="min-h-[64px] flex items-center mb-5">
          <p className="text-lg sm:text-xl text-zinc-100 font-serif leading-relaxed font-normal">
            "{displayedText}"
            {displayedText.length < fullText.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#D4A373] animate-pulse" />
            )}
          </p>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05] flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={onTogglePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] transition"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            {/* Next Turn */}
            <button
              onClick={onNextTurn}
              title="Next Council Argument"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] transition"
            >
              <SkipForward size={15} />
            </button>

            {/* Audio Mute */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className={`p-2 rounded-lg border transition ${
                isMuted
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-white/[0.06]'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Interject */}
            <button
              onClick={onOpenInterject}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-sans font-medium border border-white/[0.08] hover:border-white/20 transition flex items-center gap-1.5"
            >
              <MessageSquare size={13} className="text-[#D4A373]" />
              <span>Interject Objection</span>
            </button>

            {/* Skip to Verdict */}
            <button
              onClick={onSkipToVerdict}
              className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-sans font-semibold tracking-wider uppercase transition shadow flex items-center gap-1.5"
            >
              <FastForward size={13} />
              <span>Proceed to Ruling</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

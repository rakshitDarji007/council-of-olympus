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
    hermes: { name: 'HERMES', color: '#E8A28E', title: 'Agile Optionality' },
    oracle: { name: 'FACILITATOR', color: '#E8A28E', title: 'Context Discovery' },
    odysseus: { name: 'ODYSSEUS', color: '#F8F6F0', title: 'The Ruling' },
  };

  const currentSpeaker = currentTurn?.speaker?.toLowerCase() || 'athena';
  const meta = speakerMeta[currentSpeaker] || speakerMeta.athena;
  const fullText = currentTurn?.text || 'The council deliberates in quiet consideration...';

  // Crisp, readable typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const totalDurationMs = 1800;
    const stepInterval = Math.max(8, Math.floor(totalDurationMs / (fullText.length || 1)));

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
      <div className="editorial-card rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="font-mono text-xs font-bold tracking-widest uppercase"
              style={{ color: meta.color }}
            >
              {meta.name}
            </span>
            <span className="text-zinc-400 text-xs font-sans">
              • {meta.title}
            </span>
            {currentTurn?.addressed_to && (
              <span className="text-[10px] font-mono text-[#E8A28E] bg-[#E8A28E]/10 px-2 py-0.5 rounded-full border border-[#E8A28E]/25">
                To: {currentTurn.addressed_to.toUpperCase()}
              </span>
            )}
          </div>

          {/* Turn Progress Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Turn {turnIndex + 1} of {totalTurns}</span>
            <div className="flex gap-1.5 ml-1.5">
              {Array.from({ length: totalTurns }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === turnIndex
                      ? 'bg-[#E8A28E] scale-125'
                      : i < turnIndex
                      ? 'bg-zinc-400'
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Spoken Dialogue in Literary Serif */}
        <div className="min-h-[70px] flex items-center mb-5">
          <p className="text-lg sm:text-2xl text-white font-serif leading-relaxed font-normal">
            "{displayedText}"
            {displayedText.length < fullText.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#E8A28E] animate-pulse" />
            )}
          </p>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={onTogglePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-2.5 rounded-full frosted-capsule text-zinc-300 hover:text-white transition"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            {/* Next Turn */}
            <button
              onClick={onNextTurn}
              title="Next Turn"
              className="p-2.5 rounded-full frosted-capsule text-zinc-300 hover:text-white transition"
            >
              <SkipForward size={15} />
            </button>

            {/* Audio Mute */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className={`p-2.5 rounded-full border transition ${
                isMuted
                  ? 'bg-rose-950/50 text-rose-300 border-rose-500/40'
                  : 'frosted-capsule text-zinc-400 hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Interject */}
            <button
              onClick={onOpenInterject}
              className="px-4 py-2 rounded-full frosted-capsule text-zinc-200 hover:text-white text-xs font-sans font-medium transition flex items-center gap-1.5"
            >
              <MessageSquare size={13} className="text-[#E8A28E]" />
              <span>Interject Objection</span>
            </button>

            {/* Skip to Verdict Pill */}
            <button
              onClick={onSkipToVerdict}
              className="px-5 py-2 rounded-full bg-[#F8F6F0] hover:bg-white text-[#0A0C16] text-xs font-sans font-bold tracking-wider uppercase transition-all shadow hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
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

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, FastForward, MessageSquare, Pause, Play } from 'lucide-react';
import GreekMeander from './GreekMeander.jsx';

/**
 * Subtitle Bar with synchronized typewriter effect and playback controls.
 */
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

  // Speaker display names and theme colors
  const speakerMeta = {
    athena: { name: 'ATHENA', color: '#C1DDD0', title: 'Goddess of Wisdom' },
    poseidon: { name: 'POSEIDON', color: '#1F5C66', title: 'Lord of the Deeps' },
    hermes: { name: 'HERMES', color: '#EE8A2E', title: 'The Wayfinder' },
    oracle: { name: 'THE ORACLE', color: '#E4EC6A', title: 'Delphic Seer' },
    odysseus: { name: 'ODYSSEUS', color: '#DDD3C8', title: 'King of Ithaca' },
  };

  const currentSpeaker = currentTurn?.speaker?.toLowerCase() || 'athena';
  const meta = speakerMeta[currentSpeaker] || speakerMeta.athena;
  const fullText = currentTurn?.text || 'The council gathers in silence...';

  // Smooth typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    // Calculate typing speed based on sentence length
    const totalDurationMs = 2800; // Snappy ~2.8s typing
    const stepInterval = Math.max(15, Math.floor(totalDurationMs / (fullText.length || 1)));

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
      <div className="torn-panel rounded-xl overflow-hidden shadow-2xl relative border-2 border-[#EE8A2E]">
        {/* Top Greek Meander border */}
        <GreekMeander height={12} color="#EE8A2E" opacity={0.7} />

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Header Row: Speaker Name & Addressed To + Turn Counter */}
          <div className="flex items-center justify-between border-b border-[#EE8A2E]/20 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-heading text-lg sm:text-xl font-bold tracking-wider"
                style={{ color: meta.color }}
              >
                {meta.name}
              </span>
              <span className="text-xs text-[#DDD3C8]/70 font-serif uppercase tracking-widest">
                • {meta.title}
              </span>
              {currentTurn?.addressed_to && (
                <span className="text-xs text-[#EE8A2E] bg-[#EE8A2E]/10 px-2 py-0.5 rounded border border-[#EE8A2E]/30 font-serif">
                  Addressing: {currentTurn.addressed_to.toUpperCase()}
                </span>
              )}
            </div>

            {/* Turn Counter Dots */}
            <div className="flex items-center gap-1.5 text-xs text-[#DDD3C8] font-serif">
              <span className="hidden sm:inline">Turn {turnIndex + 1} of {totalTurns}</span>
              <div className="flex gap-1 ml-2">
                {Array.from({ length: totalTurns }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === turnIndex
                        ? 'bg-[#EE8A2E] scale-125 shadow-glow-orange'
                        : i < turnIndex
                        ? 'bg-[#C1DDD0]'
                        : 'bg-[#DDD3C8]/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Typewriter Subtitle Text */}
          <div className="min-h-[64px] sm:min-h-[72px] flex items-center">
            <p className="text-base sm:text-lg text-[#FDF4CC] font-body leading-relaxed tracking-wide font-normal">
              "{displayedText}"
              {displayedText.length < fullText.length && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#EE8A2E] animate-pulse" />
              )}
            </p>
          </div>

          {/* Action & Playback Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EE8A2E]/15 flex-wrap gap-2">
            {/* Left: Interject Button ("Speak, mortal") */}
            <button
              onClick={onOpenInterject}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-lg bg-[#9B3B33] hover:bg-[#752B24] text-[#FDF4CC] font-serif text-xs font-bold tracking-wider uppercase border border-[#EE8A2E] transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <MessageSquare size={14} className="text-[#EE8A2E]" />
              Speak, mortal
            </button>

            {/* Right: Playback Controls */}
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={onTogglePlayPause}
                title={isPlaying ? 'Pause debate' : 'Play debate'}
                className="p-1.5 rounded bg-[#1B1B16] hover:bg-[#12233F] text-[#DDD3C8] hover:text-[#FDF4CC] border border-[#EE8A2E]/30 transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={onToggleMute}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className={`p-1.5 rounded border transition ${
                  isMuted
                    ? 'bg-[#9B3B33]/50 text-[#EE8A2E] border-[#9B3B33]'
                    : 'bg-[#1B1B16] text-[#DDD3C8] hover:text-[#FDF4CC] border-[#EE8A2E]/30'
                }`}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              {/* Next Turn */}
              <button
                onClick={onNextTurn}
                disabled={turnIndex >= totalTurns - 1}
                title="Advance to Next Turn"
                className="px-2.5 py-1.5 rounded bg-[#1B1B16] hover:bg-[#12233F] text-[#DDD3C8] hover:text-[#EE8A2E] border border-[#EE8A2E]/30 text-xs font-serif flex items-center gap-1 transition disabled:opacity-40"
              >
                <SkipForward size={14} />
                <span className="hidden sm:inline">Next Turn</span>
              </button>

              {/* Skip to Verdict */}
              <button
                onClick={onSkipToVerdict}
                title="Skip directly to Odysseus' Verdict"
                className="px-3 py-1.5 rounded bg-[#1F5C66] hover:bg-[#133E46] text-[#C1DDD0] hover:text-[#FDF4CC] font-serif text-xs font-bold tracking-wider uppercase border border-[#C1DDD0]/50 transition-all flex items-center gap-1.5 shadow"
              >
                <FastForward size={14} />
                <span className="hidden sm:inline">Verdict</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Greek Meander border */}
        <GreekMeander height={10} color="#EE8A2E" opacity={0.5} />
      </div>
    </div>
  );
}

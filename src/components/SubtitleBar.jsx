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
    athena: { name: 'ATHENA', color: '#2b533e', title: 'Strategic Mastery' },
    poseidon: { name: 'POSEIDON', color: '#1a3a52', title: 'Downside Exposure' },
    hermes: { name: 'HERMES', color: '#b4654d', title: 'Agile Optionality' },
    oracle: { name: 'FACILITATOR', color: '#b4654d', title: 'Context Discovery' },
    odysseus: { name: 'ODYSSEUS', color: '#102f46', title: 'The Ruling' },
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
      <div className="odyssey-card p-6 sm:p-7 relative overflow-hidden">
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between border-b border-[#ded0bc] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="font-mono text-xs font-bold tracking-widest uppercase"
              style={{ color: meta.color }}
            >
              {meta.name}
            </span>
            <span className="text-[#506575] text-xs font-sans">
              • {meta.title}
            </span>
            {currentTurn?.addressed_to && (
              <span className="text-[10px] font-mono text-[#b4654d] bg-[#b4654d]/10 px-2.5 py-0.5 rounded-full border border-[#b4654d]/30 font-bold uppercase">
                To: {currentTurn.addressed_to}
              </span>
            )}
          </div>

          {/* Turn Progress Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#506575]">
            <span>Turn {turnIndex + 1} of {totalTurns}</span>
            <div className="flex gap-1.5 ml-1.5">
              {Array.from({ length: totalTurns }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === turnIndex
                      ? 'bg-[#b4654d] scale-125'
                      : i < turnIndex
                      ? 'bg-[#1a3a52]'
                      : 'bg-[#ded0bc]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Spoken Dialogue in Literary Serif */}
        <div className="min-h-[70px] flex items-center mb-5">
          <p className="text-xl sm:text-2xl text-[#1a3a52] font-serif leading-relaxed font-normal">
            "{displayedText}"
            {displayedText.length < fullText.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#b4654d] animate-pulse" />
            )}
          </p>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[#ded0bc] flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={onTogglePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-2.5 rounded-full header-pill-nav text-[#1a3a52] hover:bg-[#eee3d2] transition"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            {/* Next Turn */}
            <button
              onClick={onNextTurn}
              title="Next Turn"
              className="p-2.5 rounded-full header-pill-nav text-[#1a3a52] hover:bg-[#eee3d2] transition"
            >
              <SkipForward size={15} />
            </button>

            {/* Audio Mute */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className={`p-2.5 rounded-full border transition ${
                isMuted
                  ? 'bg-[#fff0ed] text-[#b4654d] border-[#b4654d]'
                  : 'header-pill-nav text-[#506575] hover:text-[#1a3a52]'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Interject */}
            <button
              onClick={onOpenInterject}
              className="header-pill-nav px-4 py-2 text-xs font-semibold text-[#1a3a52] hover:bg-[#eee3d2] transition flex items-center gap-1.5"
            >
              <MessageSquare size={13} className="text-[#b4654d]" />
              <span>Interject Objection</span>
            </button>

            {/* Skip to Verdict Pill */}
            <button
              onClick={onSkipToVerdict}
              className="odyssey-btn flex items-center gap-1.5"
            >
              <FastForward size={13} className="text-[#b4654d]" />
              <span>Proceed to Ruling</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

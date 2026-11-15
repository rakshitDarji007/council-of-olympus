import React from 'react';

/**
 * Editorial minimalist frosted footer (Inspired by Image 1 & Hermes Agent).
 */
export default function WaveFooter({ isLoading = false }) {
  return (
    <footer className="relative w-full z-20 select-none border-t border-white/[0.08] bg-black/20 backdrop-blur-xl mt-auto py-4 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-400 font-sans">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-widest text-[#E8A28E] uppercase font-bold">
            The Council of Olympus
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 hidden sm:inline text-[11px] font-serif italic">
            "When rosy-fingered Dawn appeared" — Homer's Odyssey
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-[#E8A28E] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A28E] animate-pulse" />
              <span>Deliberating opposing counsel...</span>
            </div>
          ) : (
            <span className="text-zinc-400 text-[11px] font-sans">
              For strategic reflection • Not professional advice
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

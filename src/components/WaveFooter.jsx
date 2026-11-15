import React from 'react';

/**
 * Minimalist footer matching HackUTA 2026's official design tokens.
 */
export default function WaveFooter({ isLoading = false }) {
  return (
    <footer className="relative w-full z-20 select-none border-t border-[#ded0bc] bg-transparent mt-auto py-5 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[#506575] font-sans">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-widest text-[#b4654d] uppercase font-bold">
            The Council of Olympus
          </span>
          <span className="text-[#ded0bc]">•</span>
          <span className="text-[#506575] hidden sm:inline text-[11px] font-serif italic">
            "When rosy-fingered Dawn appeared" (Homer's Odyssey)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-[#b4654d] text-[11px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b4654d] animate-pulse" />
              <span>Deliberating opposing counsel...</span>
            </div>
          ) : (
            <span className="text-[#506575] text-[11px] font-sans">
              For strategic reflection • Not professional advice
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

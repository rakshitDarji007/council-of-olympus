import React from 'react';

/**
 * Editorial minimalist status footer.
 * Clean typography, discreet activity pulse, and quiet elegance.
 */
export default function WaveFooter({ isLoading = false }) {
  return (
    <footer className="relative w-full z-20 select-none border-t border-white/[0.06] bg-[#0B0C0E]/90 backdrop-blur-md mt-auto py-3.5 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-500 font-sans">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-widest text-[#D4A373] uppercase font-semibold">
            Council of Olympus
          </span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400 hidden sm:inline text-[11px]">
            Homeric Decision Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-[#D4A373] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] animate-pulse" />
              <span>Deliberating opposing counsel...</span>
            </div>
          ) : (
            <span className="text-zinc-500 text-[11px]">
              For strategic reflection
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

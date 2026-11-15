import React from 'react';

/**
 * Minimalist, elegant status footer with refined typography and subtle loading activity indicator.
 */
export default function WaveFooter({ isLoading = false }) {
  return (
    <footer className="relative w-full z-20 select-none border-t border-white/5 bg-[#0A0F1D]/80 backdrop-blur-md mt-auto py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-[#94A3B8] font-sans">
        <div className="flex items-center gap-2">
          <span className="text-[#D97746] font-semibold">THE COUNCIL OF OLYMPUS</span>
          <span className="text-white/20">•</span>
          <span className="hidden sm:inline">Homeric Decision Architecture</span>
        </div>

        {/* Live deliberation indicator */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-[#D97746] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97746]" />
              <span>Deliberating opposing counsel...</span>
            </div>
          ) : (
            <span className="text-slate-500 font-sans">
              For strategic reflection • Not professional advice
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

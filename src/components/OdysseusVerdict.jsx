import React, { useState } from 'react';
import GreekMeander from './GreekMeander.jsx';
import {
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Shield,
  Anchor,
  Feather,
} from 'lucide-react';

export default function OdysseusVerdict({
  verdict,
  dilemma,
  onReset,
  onReplayDebate,
}) {
  const [copied, setCopied] = useState(false);

  if (!verdict) return null;

  const confidenceStyles = {
    high: {
      label: 'High Conviction',
      badge: 'text-emerald-800 border-emerald-300 bg-emerald-50',
      dot: 'bg-emerald-600',
    },
    medium: {
      label: 'Measured Conviction',
      badge: 'text-amber-800 border-amber-300 bg-amber-50',
      dot: 'bg-amber-600',
    },
    low: {
      label: 'Significant Uncertainty',
      badge: 'text-rose-800 border-rose-300 bg-rose-50',
      dot: 'bg-rose-600',
    },
  };

  const confInfo =
    confidenceStyles[verdict.confidence?.toLowerCase()] ||
    confidenceStyles.medium;

  const handleCopySummary = () => {
    const textToCopy = `THE COUNCIL OF OLYMPUS: ODYSSEUS' RULING\n\n` +
      `DILEMMA: "${dilemma}"\n\n` +
      `RECOMMENDATION:\n"${verdict.recommendation}"\n\n` +
      `CONVICTION: ${verdict.confidence?.toUpperCase()} (${verdict.confidence_reason})\n\n` +
      `COUNCIL PERSPECTIVES:\n` +
      `* Athena (Strategy): ${verdict.summary_by_god?.athena}\n` +
      `* Poseidon (Downside): ${verdict.summary_by_god?.poseidon}\n` +
      `* Hermes (Agility): ${verdict.summary_by_god?.hermes}\n\n` +
      `CRITICAL BLINDSPOT:\n${verdict.biggest_risk}\n\n` +
      `ACTION SEQUENCE:\n${(verdict.next_steps || []).map((s, i) => `[0${i + 1}] ${s}`).join('\n')}\n\n` +
      `PRINCIPLE:\n"${verdict.closing_word}"\n` +
      `Council of Olympus`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fade-in">
      <div className="odyssey-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <GreekMeander opacity={0.5} className="mb-6" />

        {/* Executive Memo Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 header-pill-nav text-[11px] font-mono tracking-[0.2em] text-[#b4654d] uppercase font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b4654d]" />
            <span>Executive Ruling • Decision Memorandum</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-[#1a3a52] font-bold tracking-[0.08em] uppercase mb-3">
            Odysseus' Strategic Ruling
          </h2>

          <p className="text-sm sm:text-base font-serif italic text-[#305873] leading-relaxed">
            Synthesized from long-term compounding, downside friction, and agile optionality.
          </p>
        </div>

        {/* The Decision Under Review */}
        <div className="p-5 rounded-2xl bg-[#eee3d2]/60 border border-[#ded0bc] mb-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#b4654d] uppercase font-bold block mb-1">
            Mortal Dilemma
          </span>
          <p className="text-sm sm:text-base font-sans text-[#1a3a52] leading-relaxed italic">
            "{dilemma}"
          </p>
        </div>

        {/* Primary Ruling Hero Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#fffcf7] border-2 border-[#ded0bc] shadow-sm mb-8 relative z-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#b4654d] uppercase font-bold">
              Formal Recommendation
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-sans font-semibold border flex items-center gap-1.5 ${confInfo.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${confInfo.dot}`} />
              <span>{confInfo.label}</span>
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-[#1a3a52] font-serif leading-relaxed font-normal mb-5">
            "{verdict.recommendation}"
          </p>

          <p className="text-xs font-sans text-[#506575] border-t border-[#ded0bc] pt-3">
            <span className="text-[#b4654d] font-bold font-mono uppercase tracking-wider mr-1">Strategic Rationale:</span> {verdict.confidence_reason}
          </p>
        </div>

        {/* Tripartite Counsel Synthesis */}
        <div className="mb-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#506575] uppercase font-bold block mb-3 px-1">
            Synthesis of Opposing Worldviews
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Athena */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fffcf7] border border-[#ded0bc]">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-[#2b533e]" />
                <span className="text-xs font-mono font-bold text-[#2b533e] uppercase tracking-wider">
                  Athena
                </span>
              </div>
              <p className="text-xs font-sans text-[#1a3a52] leading-relaxed">
                {verdict.summary_by_god?.athena}
              </p>
            </div>

            {/* Poseidon */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fffcf7] border border-[#ded0bc]">
              <div className="flex items-center gap-2 mb-2">
                <Anchor size={14} className="text-[#1a3a52]" />
                <span className="text-xs font-mono font-bold text-[#1a3a52] uppercase tracking-wider">
                  Poseidon
                </span>
              </div>
              <p className="text-xs font-sans text-[#1a3a52] leading-relaxed">
                {verdict.summary_by_god?.poseidon}
              </p>
            </div>

            {/* Hermes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fffcf7] border border-[#ded0bc]">
              <div className="flex items-center gap-2 mb-2">
                <Feather size={14} className="text-[#b4654d]" />
                <span className="text-xs font-mono font-bold text-[#b4654d] uppercase tracking-wider">
                  Hermes
                </span>
              </div>
              <p className="text-xs font-sans text-[#1a3a52] leading-relaxed">
                {verdict.summary_by_god?.hermes}
              </p>
            </div>
          </div>
        </div>

        {/* Downside Risk Callout */}
        <div className="p-5 rounded-2xl bg-[#fff0ed] border border-[#b4654d]/30 mb-8 flex items-start gap-4 relative z-10">
          <AlertTriangle size={18} className="text-[#b4654d] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono tracking-wider uppercase text-[#b4654d] font-bold mb-1">
              Critical Downside & Blindspot Exposure
            </h4>
            <p className="text-xs sm:text-sm font-sans text-[#1a3a52] leading-relaxed">
              {verdict.biggest_risk}
            </p>
          </div>
        </div>

        {/* Action Sequence */}
        <div className="mb-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#506575] uppercase font-bold block mb-3 px-1">
            Concrete Execution Protocol
          </span>

          <div className="flex flex-col gap-2.5">
            {(verdict.next_steps || []).map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#fffcf7] border border-[#ded0bc] flex items-start gap-3.5"
              >
                <span className="font-mono text-xs font-bold text-[#b4654d] shrink-0 mt-0.5">
                  [0{idx + 1}]
                </span>
                <p className="text-xs sm:text-sm font-sans text-[#1a3a52] leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guiding Principle */}
        {verdict.closing_word && (
          <div className="text-center py-5 border-y border-[#ded0bc] mb-8 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#b4654d] uppercase font-bold block mb-1">
              Guiding Principle
            </span>
            <p className="text-lg sm:text-xl font-serif italic text-[#1a3a52]">
              "{verdict.closing_word}"
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-full header-pill-nav text-[#1a3a52] text-xs font-sans font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>New Deliberation</span>
            </button>

            <button
              onClick={onReplayDebate}
              className="px-4 py-2 rounded-full header-pill-nav text-[#1a3a52] text-xs font-sans font-semibold transition"
            >
              <span>Replay Council</span>
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="odyssey-btn flex items-center gap-2"
          >
            {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Brief' : 'Export Ruling Memo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import GreekMeander from './GreekMeander.jsx';
import GodAvatar from './GodAvatar.jsx';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
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
      badge: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/40',
      dot: 'bg-emerald-400',
    },
    medium: {
      label: 'Measured Conviction',
      badge: 'text-amber-300 border-amber-500/30 bg-amber-950/40',
      dot: 'bg-amber-400',
    },
    low: {
      label: 'Significant Uncertainty',
      badge: 'text-rose-300 border-rose-500/30 bg-rose-950/40',
      dot: 'bg-rose-400',
    },
  };

  const confInfo =
    confidenceStyles[verdict.confidence?.toLowerCase()] ||
    confidenceStyles.medium;

  const handleCopySummary = () => {
    const textToCopy = `THE COUNCIL OF OLYMPUS — ODYSSEUS' RULING\n\n` +
      `DILEMMA: "${dilemma}"\n\n` +
      `RECOMMENDATION:\n"${verdict.recommendation}"\n\n` +
      `CONVICTION: ${verdict.confidence?.toUpperCase()} — ${verdict.confidence_reason}\n\n` +
      `COUNCIL PERSPECTIVES:\n` +
      `• Athena (Strategy): ${verdict.summary_by_god?.athena}\n` +
      `• Poseidon (Downside): ${verdict.summary_by_god?.poseidon}\n` +
      `• Hermes (Agility): ${verdict.summary_by_god?.hermes}\n\n` +
      `CRITICAL BLINDSPOT:\n${verdict.biggest_risk}\n\n` +
      `ACTION SEQUENCE:\n${(verdict.next_steps || []).map((s, i) => `[0${i + 1}] ${s}`).join('\n')}\n\n` +
      `PRINCIPLE:\n"${verdict.closing_word}"\n` +
      `— Council of Olympus`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none animate-fade-in">
      <div className="editorial-card rounded-2xl p-6 sm:p-10 relative">
        <GreekMeander opacity={0.25} className="mb-8" />

        {/* Executive Memo Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
            <span className="text-[11px] font-mono tracking-[0.2em] text-[#D4A373] uppercase font-semibold">
              Executive Ruling • Decision Memorandum
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl text-zinc-100 font-normal tracking-tight mb-3">
            Odysseus' Strategic Verdict
          </h2>

          <p className="text-sm font-sans text-zinc-400 leading-relaxed italic">
            Synthesized from long-term compounding, downside friction, and agile optionality.
          </p>
        </div>

        {/* The Decision Under Review */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] mb-8">
          <span className="text-[10px] font-mono tracking-widest text-[#D4A373] uppercase block mb-1">
            Mortal Dilemma
          </span>
          <p className="text-sm font-sans text-zinc-300 leading-relaxed italic">
            "{dilemma}"
          </p>
        </div>

        {/* Primary Ruling Hero Card */}
        <div className="p-6 sm:p-8 rounded-xl bg-[#0E0F13] border border-[#D4A373]/40 shadow-xl mb-8 relative">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#D4A373] uppercase font-bold">
              Formal Recommendation
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-sans font-medium border flex items-center gap-1.5 ${confInfo.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${confInfo.dot}`} />
              <span>{confInfo.label}</span>
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-zinc-100 font-serif leading-relaxed font-normal mb-4">
            "{verdict.recommendation}"
          </p>

          <p className="text-xs font-sans text-zinc-400 border-t border-white/[0.06] pt-3">
            <span className="text-zinc-300 font-medium">Strategic Rationale:</span> {verdict.confidence_reason}
          </p>
        </div>

        {/* Tripartite Counsel Synthesis */}
        <div className="mb-8">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-3 px-1">
            Synthesis of Opposing Worldviews
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Athena */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-[#94B49F]" />
                <span className="text-xs font-mono font-bold text-[#94B49F] uppercase tracking-wider">
                  Athena
                </span>
              </div>
              <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                {verdict.summary_by_god?.athena}
              </p>
            </div>

            {/* Poseidon */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <Anchor size={14} className="text-[#2A7385]" />
                <span className="text-xs font-mono font-bold text-[#2A7385] uppercase tracking-wider">
                  Poseidon
                </span>
              </div>
              <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                {verdict.summary_by_god?.poseidon}
              </p>
            </div>

            {/* Hermes */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <Feather size={14} className="text-[#D4A373]" />
                <span className="text-xs font-mono font-bold text-[#D4A373] uppercase tracking-wider">
                  Hermes
                </span>
              </div>
              <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                {verdict.summary_by_god?.hermes}
              </p>
            </div>
          </div>
        </div>

        {/* Downside Risk Callout */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 mb-8 flex items-start gap-3.5">
          <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono tracking-wider uppercase text-rose-300 font-semibold mb-1">
              Critical Downside & Blindspot Exposure
            </h4>
            <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">
              {verdict.biggest_risk}
            </p>
          </div>
        </div>

        {/* Action Sequence */}
        <div className="mb-8">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-3 px-1">
            Concrete Execution Protocol
          </span>

          <div className="flex flex-col gap-2.5">
            {(verdict.next_steps || []).map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3"
              >
                <span className="font-mono text-xs font-bold text-[#D4A373] shrink-0 mt-0.5">
                  [0{idx + 1}]
                </span>
                <p className="text-xs sm:text-sm font-sans text-zinc-200 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guiding Principle Card */}
        {verdict.closing_word && (
          <div className="text-center py-4 border-y border-white/[0.06] mb-8">
            <span className="text-[10px] font-mono tracking-widest text-[#D4A373] uppercase block mb-1">
              Guiding Principle
            </span>
            <p className="text-base sm:text-lg font-serif italic text-zinc-200">
              "{verdict.closing_word}"
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-sans font-medium border border-white/[0.08] transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>New Deliberation</span>
            </button>

            <button
              onClick={onReplayDebate}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-sans font-medium border border-white/[0.08] transition"
            >
              <span>Replay Council</span>
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-sans font-semibold text-xs tracking-wider uppercase transition shadow flex items-center gap-2"
          >
            {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Brief' : 'Export Ruling Memo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

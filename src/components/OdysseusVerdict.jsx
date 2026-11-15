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
      badge: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/50',
      dot: 'bg-emerald-400',
    },
    medium: {
      label: 'Measured Conviction',
      badge: 'text-amber-300 border-amber-500/30 bg-amber-950/50',
      dot: 'bg-amber-400',
    },
    low: {
      label: 'Significant Uncertainty',
      badge: 'text-rose-300 border-rose-500/30 bg-rose-950/50',
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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none animate-fade-in">
      <div className="editorial-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 relative overflow-hidden">
        {/* Ambient Dawn Glow */}
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(228, 164, 149, 0.4) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <GreekMeander opacity={0.25} className="mb-8" />

        {/* Executive Memo Header (Inspired by Image 2 Editorial Layout) */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-capsule text-[11px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A28E]" />
            <span>Executive Ruling • Decision Memorandum</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-white font-bold tracking-[0.06em] uppercase mb-3">
            Odysseus' Strategic Ruling
          </h2>

          <p className="text-sm font-serif italic text-zinc-300 leading-relaxed">
            Synthesized from long-term compounding, downside friction, and agile optionality.
          </p>
        </div>

        {/* The Decision Under Review */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] mb-8 backdrop-blur-md relative z-10">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-bold block mb-1">
            Mortal Dilemma
          </span>
          <p className="text-sm font-sans text-zinc-200 leading-relaxed italic">
            "{dilemma}"
          </p>
        </div>

        {/* Primary Ruling Hero Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-[#E8A28E]/40 shadow-2xl mb-8 relative z-10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#E8A28E] uppercase font-bold">
              Formal Recommendation
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-sans font-semibold border flex items-center gap-1.5 ${confInfo.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${confInfo.dot}`} />
              <span>{confInfo.label}</span>
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-white font-serif leading-relaxed font-normal mb-5">
            "{verdict.recommendation}"
          </p>

          <p className="text-xs font-sans text-zinc-300 border-t border-white/[0.08] pt-3">
            <span className="text-[#E8A28E] font-medium font-mono uppercase tracking-wider mr-1">Strategic Rationale:</span> {verdict.confidence_reason}
          </p>
        </div>

        {/* Tripartite Counsel Synthesis */}
        <div className="mb-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold block mb-3 px-1">
            Synthesis of Opposing Worldviews
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Athena */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2">
                <Feather size={14} className="text-[#E8A28E]" />
                <span className="text-xs font-mono font-bold text-[#E8A28E] uppercase tracking-wider">
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
        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/25 mb-8 flex items-start gap-4 relative z-10 backdrop-blur-md">
          <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono tracking-wider uppercase text-rose-300 font-bold mb-1">
              Critical Downside & Blindspot Exposure
            </h4>
            <p className="text-xs sm:text-sm font-sans text-zinc-200 leading-relaxed">
              {verdict.biggest_risk}
            </p>
          </div>
        </div>

        {/* Action Sequence */}
        <div className="mb-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold block mb-3 px-1">
            Concrete Execution Protocol
          </span>

          <div className="flex flex-col gap-2.5">
            {(verdict.next_steps || []).map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5"
              >
                <span className="font-mono text-xs font-bold text-[#E8A28E] shrink-0 mt-0.5">
                  [0{idx + 1}]
                </span>
                <p className="text-xs sm:text-sm font-sans text-zinc-200 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guiding Principle */}
        {verdict.closing_word && (
          <div className="text-center py-5 border-y border-white/[0.08] mb-8 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#E8A28E] uppercase font-bold block mb-1">
              Guiding Principle
            </span>
            <p className="text-lg sm:text-xl font-serif italic text-white">
              "{verdict.closing_word}"
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-full frosted-capsule text-zinc-200 hover:text-white text-xs font-sans font-medium transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>New Deliberation</span>
            </button>

            <button
              onClick={onReplayDebate}
              className="px-4 py-2.5 rounded-full frosted-capsule text-zinc-200 hover:text-white text-xs font-sans font-medium transition"
            >
              <span>Replay Council</span>
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-6 py-2.5 rounded-full bg-[#F8F6F0] hover:bg-white text-[#0A0C16] font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Brief' : 'Export Ruling Memo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

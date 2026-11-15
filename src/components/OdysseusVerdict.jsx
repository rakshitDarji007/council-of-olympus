import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import GodAvatar from './GodAvatar.jsx';
import GreekMeander from './GreekMeander.jsx';
import {
  Compass,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function OdysseusVerdict({
  verdict,
  dilemma,
  onReset,
  onReplayDebate,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D97746', '#F8F6F0', '#1E5B6A', '#94B49F'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  if (!verdict) return null;

  const confidenceBadges = {
    high: {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      label: 'High Conviction',
    },
    medium: {
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      label: 'Measured Conviction',
    },
    low: {
      bg: 'bg-rose-950/60',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      label: 'Significant Uncertainty',
    },
  };

  const confInfo =
    confidenceBadges[verdict.confidence?.toLowerCase()] ||
    confidenceBadges.medium;

  const handleCopySummary = () => {
    const textToCopy = `🏛️ THE COUNCIL OF OLYMPUS — ODYSSEUS' RULING\n\n` +
      `Decision: ${dilemma}\n\n` +
      `Recommendation:\n"${verdict.recommendation}"\n\n` +
      `Conviction: ${verdict.confidence?.toUpperCase()} (${verdict.confidence_reason})\n\n` +
      `Counsel Synthesis:\n` +
      `• Athena (Strategy): ${verdict.summary_by_god?.athena}\n` +
      `• Poseidon (Risk): ${verdict.summary_by_god?.poseidon}\n` +
      `• Hermes (Optionality): ${verdict.summary_by_god?.hermes}\n\n` +
      `Critical Blindspot: ${verdict.biggest_risk}\n\n` +
      `Action Sequence:\n${(verdict.next_steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n` +
      `Guiding Principle: "${verdict.closing_word}"\n` +
      `— Council of Olympus`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fade-in">
      <div className="editorial-card rounded-2xl p-6 sm:p-10 shadow-2xl relative">
        <GreekMeander opacity={0.3} className="mb-6" />

        <div className="flex flex-col items-center">
          {/* Odysseus Avatar */}
          <div className="mb-4">
            <GodAvatar speaker="odysseus" size={88} isActive={true} />
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl text-center text-slate-100 tracking-tight mb-1">
            Odysseus' Ruling
          </h2>
          <p className="text-xs sm:text-sm font-sans text-slate-400 text-center max-w-md mb-8">
            Synthesizing long-term leverage, downside risk, and pragmatic optionality.
          </p>

          {/* Original Decision Banner */}
          <div className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-slate-300 mb-6">
            <span className="font-semibold text-[#D97746] uppercase mr-2 tracking-wide">
              The Decision:
            </span>
            "{dilemma}"
          </div>

          {/* CORE RECOMMENDATION MEMO */}
          <div className="w-full p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-[#D97746]/40 shadow-xl mb-6 relative">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="text-xs font-sans font-semibold text-[#D97746] uppercase tracking-wider flex items-center gap-2">
                <Compass size={16} /> Final Recommendation
              </span>

              {/* Confidence Badge */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-sans font-medium tracking-wide border ${confInfo.bg} ${confInfo.text} ${confInfo.border}`}
              >
                {confInfo.label}
              </div>
            </div>

            <p className="text-lg sm:text-2xl text-slate-100 font-serif leading-relaxed mb-4">
              "{verdict.recommendation}"
            </p>

            <p className="text-xs sm:text-sm font-sans text-slate-400 border-t border-white/10 pt-3">
              <span className="text-slate-200 font-medium">Why this conviction: </span>
              {verdict.confidence_reason}
            </p>
          </div>

          {/* THREE-PERSPECTIVE SYNTHESIS GRID */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {/* Athena */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold text-[#94B49F] uppercase tracking-wider block mb-1">
                  Athena's Strategic View
                </span>
                <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                  {verdict.summary_by_god?.athena}
                </p>
              </div>
            </div>

            {/* Poseidon */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold text-[#2A7385] uppercase tracking-wider block mb-1">
                  Poseidon's Risk Warning
                </span>
                <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                  {verdict.summary_by_god?.poseidon}
                </p>
              </div>
            </div>

            {/* Hermes */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold text-[#D97746] uppercase tracking-wider block mb-1">
                  Hermes' Middle Path
                </span>
                <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                  {verdict.summary_by_god?.hermes}
                </p>
              </div>
            </div>
          </div>

          {/* CRITICAL BLINDSPOT / RISK */}
          <div className="w-full p-4 sm:p-5 rounded-xl bg-rose-950/30 border border-rose-500/20 mb-6">
            <div className="flex items-center gap-2 text-rose-300 mb-1.5">
              <AlertOctagon size={16} />
              <h4 className="font-sans text-xs font-bold tracking-wider uppercase">
                Critical Blindspot to Guard Against
              </h4>
            </div>
            <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
              {verdict.biggest_risk}
            </p>
          </div>

          {/* ACTION SEQUENCE */}
          <div className="w-full p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/5 mb-6">
            <h4 className="font-sans text-xs font-bold text-slate-200 tracking-wider uppercase mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#D97746]" /> Recommended Action Sequence
            </h4>
            <div className="flex flex-col gap-2.5">
              {(verdict.next_steps || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/40 border border-white/5 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed flex items-start gap-3"
                >
                  <span className="font-mono text-[#D97746] font-bold text-xs shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UNRESOLVED QUESTION */}
          {verdict.unresolved_questions && verdict.unresolved_questions.length > 0 && (
            <div className="w-full p-4 rounded-xl bg-slate-900/60 border border-white/5 mb-6 flex items-start gap-3">
              <HelpCircle size={18} className="text-[#94B49F] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Question for Honest Reflection
                </span>
                <p className="text-sm font-serif text-slate-200 italic">
                  "{verdict.unresolved_questions[0]}"
                </p>
              </div>
            </div>
          )}

          {/* GUIDING PRINCIPLE */}
          <div className="w-full text-center py-3.5 px-6 rounded-xl bg-[#D97746]/10 border border-[#D97746]/20 mb-8">
            <p className="text-sm sm:text-base font-serif italic text-slate-200">
              "{verdict.closing_word}"
            </p>
            <span className="text-[11px] font-sans text-slate-400 uppercase tracking-wider mt-1 block">
              — Odysseus of Ithaca
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="w-full flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium border border-white/10 transition flex items-center gap-2"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Summary Copied' : 'Copy Summary'}
            </button>

            <button
              onClick={onReplayDebate}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium border border-white/10 transition flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Replay Deliberation
            </button>

            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-[#D97746] hover:bg-[#E89162] text-[#0A0F1D] text-xs font-sans font-bold uppercase tracking-wide transition shadow flex items-center gap-2"
            >
              <Sparkles size={14} />
              New Dilemma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

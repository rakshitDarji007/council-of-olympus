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
  Share2,
} from 'lucide-react';

export default function OdysseusVerdict({
  verdict,
  dilemma,
  onReset,
  onReplayDebate,
}) {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on reveal
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EE8A2E', '#FDF4CC', '#1F5C66', '#9B3B33', '#E4EC6A'],
      });
    } catch (e) {
      // safe fallback if canvas unsupported
    }
  }, []);

  if (!verdict) return null;

  const confidenceColors = {
    high: {
      bg: 'bg-[#1F5C66]',
      text: 'text-[#C1DDD0]',
      border: 'border-[#C1DDD0]',
      label: 'HIGH CONVICTION',
    },
    medium: {
      bg: 'bg-[#2B2312]',
      text: 'text-[#EE8A2E]',
      border: 'border-[#EE8A2E]',
      label: 'MEASURED PRUDENCE',
    },
    low: {
      bg: 'bg-[#9B3B33]',
      text: 'text-[#FDF4CC]',
      border: 'border-[#EE8A2E]',
      label: 'DENSE FOG / UNCHARTED',
    },
  };

  const confInfo =
    confidenceColors[verdict.confidence?.toLowerCase()] ||
    confidenceColors.medium;

  const handleCopySummary = () => {
    const textToCopy = `🏛️ THE COUNCIL OF OLYMPUS — ODYSSEUS' VERDICT\n\n` +
      `Dilemma: ${dilemma}\n\n` +
      `Recommendation:\n"${verdict.recommendation}"\n\n` +
      `Confidence: ${verdict.confidence?.toUpperCase()} (${verdict.confidence_reason})\n\n` +
      `The Council's Council:\n` +
      `• Athena: ${verdict.summary_by_god?.athena}\n` +
      `• Poseidon: ${verdict.summary_by_god?.poseidon}\n` +
      `• Hermes: ${verdict.summary_by_god?.hermes}\n\n` +
      `Biggest Risk to Guard: ${verdict.biggest_risk}\n\n` +
      `Next Steps:\n${(verdict.next_steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n` +
      `Parting Word: "${verdict.closing_word}"\n` +
      `— Delivered by Odysseus, King of Ithaca (Council of Olympus, HackUTA 2026)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fadeIn">
      <div className="torn-panel rounded-2xl overflow-hidden shadow-2xl relative border-2 border-[#EE8A2E]">
        <GreekMeander height={16} color="#EE8A2E" opacity={0.8} />

        <div className="p-6 sm:p-10 flex flex-col items-center">
          {/* Odysseus Avatar */}
          <div className="relative mb-3">
            <GodAvatar speaker="odysseus" size={130} isActive={true} />
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#1B1B16] border border-[#DDD3C8] text-[11px] font-serif font-black text-[#FDF4CC] tracking-widest uppercase shadow-md">
              Odysseus
            </div>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl text-center text-[#EE8A2E] tracking-wider mb-1 glow-orange">
            The Verdict of Ithaca
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#DDD3C8] text-center tracking-widest uppercase mb-6">
            Survivor of Scylla and Charybdis • Bearer of Hard Choices
          </p>

          {/* Original Dilemma Reference */}
          <div className="w-full p-3 rounded-lg bg-[#12233F]/70 border border-[#EE8A2E]/25 text-xs text-[#DDD3C8] mb-6">
            <span className="font-serif font-bold text-[#EE8A2E] uppercase mr-2 tracking-wider">
              The Question Posed:
            </span>
            "{dilemma}"
          </div>

          {/* CORE RECOMMENDATION BOX */}
          <div className="w-full p-6 sm:p-7 rounded-xl bg-[#1B1B16] border-2 border-[#EE8A2E] shadow-god-glow relative mb-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="text-xs font-serif font-bold text-[#EE8A2E] tracking-widest uppercase flex items-center gap-1.5">
                <Compass size={16} /> Divine Decree & Recommendation
              </span>

              {/* Confidence Badge */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-serif font-black tracking-wider border shadow ${confInfo.bg} ${confInfo.text} ${confInfo.border}`}
              >
                {confInfo.label}
              </div>
            </div>

            <p className="text-lg sm:text-2xl text-[#FDF4CC] font-body font-semibold leading-relaxed mb-3">
              "{verdict.recommendation}"
            </p>

            <p className="text-xs sm:text-sm font-serif text-[#DDD3C8] italic border-t border-[#EE8A2E]/20 pt-2.5">
              <span className="text-[#EE8A2E] not-italic font-bold">Why this confidence: </span>
              {verdict.confidence_reason}
            </p>
          </div>

          {/* THREE-GOD SYNTHESIS GRID */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {/* Athena */}
            <div className="p-4 rounded-xl bg-[#12233F]/80 border border-[#C1DDD0]/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#C1DDD0] tracking-wider uppercase block mb-1">
                  🦉 Athena's Strategy
                </span>
                <p className="text-xs sm:text-sm font-body text-[#FDF4CC]/90 leading-normal">
                  {verdict.summary_by_god?.athena}
                </p>
              </div>
            </div>

            {/* Poseidon */}
            <div className="p-4 rounded-xl bg-[#12233F]/80 border border-[#9B3B33]/60 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#EE8A2E] tracking-wider uppercase block mb-1">
                  🌊 Poseidon's Warning
                </span>
                <p className="text-xs sm:text-sm font-body text-[#FDF4CC]/90 leading-normal">
                  {verdict.summary_by_god?.poseidon}
                </p>
              </div>
            </div>

            {/* Hermes */}
            <div className="p-4 rounded-xl bg-[#12233F]/80 border border-[#EE8A2E]/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#E4EC6A] tracking-wider uppercase block mb-1">
                  🪽 Hermes' Shortcut
                </span>
                <p className="text-xs sm:text-sm font-body text-[#FDF4CC]/90 leading-normal">
                  {verdict.summary_by_god?.hermes}
                </p>
              </div>
            </div>
          </div>

          {/* BIGGEST RISK (The Sea Monster / Reef) */}
          <div className="w-full p-4 sm:p-5 rounded-xl bg-[#752B24]/40 border-2 border-[#9B3B33] mb-6">
            <div className="flex items-center gap-2 text-[#EE8A2E] mb-1.5">
              <AlertOctagon size={18} />
              <h4 className="font-heading text-sm sm:text-base font-bold tracking-wider uppercase">
                The Greatest Reef (Biggest Risk to Guard Against)
              </h4>
            </div>
            <p className="text-sm sm:text-base font-body text-[#FDF4CC] leading-relaxed">
              {verdict.biggest_risk}
            </p>
          </div>

          {/* CONCRETE NEXT STEPS */}
          <div className="w-full p-5 sm:p-6 rounded-xl bg-[#12233F]/90 border border-[#EE8A2E]/30 mb-6">
            <h4 className="font-heading text-base sm:text-lg text-[#EE8A2E] tracking-wider uppercase mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} /> Concrete Steps for the Mortal Journey
            </h4>
            <div className="flex flex-col gap-2.5">
              {(verdict.next_steps || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#1B1B16] border-l-4 border-[#EE8A2E] text-xs sm:text-sm font-body text-[#FDF4CC] leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-serif font-bold text-[#EE8A2E] text-sm shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UNRESOLVED QUESTION */}
          {verdict.unresolved_questions && verdict.unresolved_questions.length > 0 && (
            <div className="w-full p-4 rounded-xl bg-[#1B1B16] border border-[#DDD3C8]/30 mb-6 flex items-start gap-3">
              <HelpCircle size={20} className="text-[#C1DDD0] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-serif font-bold text-[#C1DDD0] tracking-wider uppercase block mb-1">
                  The Question for the Quiet Night:
                </span>
                <p className="text-sm font-body text-[#FDF4CC] italic">
                  "{verdict.unresolved_questions[0]}"
                </p>
              </div>
            </div>
          )}

          {/* CLOSING BENEDICTION */}
          <div className="w-full text-center py-3 px-6 rounded-lg bg-[#EE8A2E]/10 border border-[#EE8A2E]/30 mb-8">
            <p className="text-sm sm:text-base font-serif italic text-[#EE8A2E] font-semibold">
              "{verdict.closing_word}"
            </p>
            <span className="text-[11px] font-serif text-[#DDD3C8]/70 uppercase tracking-widest mt-1 block">
              — Odysseus, Son of Laertes
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="w-full flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {/* Copy Verdict */}
            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-[#1B1B16] hover:bg-[#12233F] text-[#DDD3C8] hover:text-[#EE8A2E] text-xs sm:text-sm font-serif font-bold tracking-wider uppercase border border-[#EE8A2E]/40 transition flex items-center gap-2 shadow"
            >
              {copied ? <Check size={16} className="text-[#C1DDD0]" /> : <Copy size={16} />}
              {copied ? 'Decree Copied!' : 'Copy Verdict Summary'}
            </button>

            {/* Replay Debate */}
            <button
              onClick={onReplayDebate}
              className="px-4 py-2.5 rounded-xl bg-[#1F5C66] hover:bg-[#133E46] text-[#C1DDD0] text-xs sm:text-sm font-serif font-bold tracking-wider uppercase border border-[#C1DDD0]/50 transition flex items-center gap-2 shadow"
            >
              <RotateCcw size={16} />
              Replay Council Debate
            </button>

            {/* New Dilemma */}
            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-[#EE8A2E] hover:bg-[#FFA959] text-[#12233F] text-xs sm:text-sm font-heading font-black tracking-wider uppercase border border-[#EE8A2E] transition shadow-lg hover:shadow-god-glow flex items-center gap-2"
            >
              <Sparkles size={16} />
              Consult for a New Dilemma
            </button>
          </div>
        </div>

        <GreekMeander height={14} color="#EE8A2E" opacity={0.7} />
      </div>

      {/* Safety & Educational Reflection Footer */}
      <div className="mt-4 text-center">
        <p className="text-[11px] font-serif text-[#DDD3C8]/60 tracking-wider">
          ✦ For reflection, not professional advice. Crafted for HackUTA 2026. ✦
        </p>
      </div>
    </div>
  );
}

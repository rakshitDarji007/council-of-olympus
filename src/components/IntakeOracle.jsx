import React, { useState } from 'react';
import GodAvatar from './GodAvatar.jsx';
import GreekMeander from './GreekMeander.jsx';
import { Mic, MicOff, Send, Sparkles, ArrowRight, AlertTriangle, Compass } from 'lucide-react';

export default function IntakeOracle({
  dilemma = '',
  conversation = [],
  currentQuestion = null,
  isWaiting = false,
  isRecording = false,
  emergencyData = null,
  onSubmitDilemma,
  onSubmitAnswer,
  onProceedToCouncil,
  onStartVoiceInput,
  onStopVoiceInput,
  onSelectSampleDilemma,
}) {
  const [inputText, setInputText] = useState('');

  const sampleDilemmas = [
    {
      title: 'Pivot Major (CS to Philosophy/Writing)',
      text: "I'm a sophomore studying Computer Science. I feel burned out by coding assignments and drawn toward philosophy, ethics, and creative writing. But I worry about debt, job prospects, and disappointing my parents.",
    },
    {
      title: 'Startup Equity vs Big Tech Stability',
      text: 'I have an offer from a seed-stage AI startup with high equity and 60-hour weeks, versus a comfortable stable big tech corporate role with double the base salary.',
    },
    {
      title: 'Relocate for Long-Term Relationship',
      text: 'My partner got accepted to medical school in Chicago. I love my hometown and close-knit family, but our relationship is 4 years strong. Should I move?',
    },
    {
      title: 'Leaving Stable Job for Indie Venture',
      text: 'I have 6 months of savings and a working MVP app with 200 free users. My boss offered a promotion, but I desperately want to work for myself.',
    },
  ];

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmitDilemma(inputText.trim());
    setInputText('');
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmitAnswer(inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 select-none">
      {/* Emergency Crisis Message Override */}
      {emergencyData?.is_emergency && (
        <div className="mb-6 p-6 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-100 shadow-2xl">
          <div className="flex items-center gap-3 mb-2 text-rose-300">
            <AlertTriangle size={24} />
            <h3 className="font-sans text-lg font-bold">Support Notice</h3>
          </div>
          <p className="text-sm font-sans leading-relaxed mb-4 text-rose-200">
            {emergencyData.emergency_message}
          </p>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 text-xs font-sans text-slate-400">
            For reflection, not professional crisis advice. If you or someone you know is in crisis, call or text 988.
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="editorial-card rounded-2xl p-6 sm:p-10 shadow-2xl relative">
        <GreekMeander opacity={0.25} className="mb-6" />

        <div className="flex flex-col items-center">
          {/* Subtle Emblem */}
          <div className="mb-4">
            <GodAvatar speaker="oracle" size={84} isActive={true} />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl text-center text-slate-100 tracking-tight mb-2">
            The Council of Olympus
          </h2>
          <p className="text-xs sm:text-sm font-sans text-slate-400 text-center max-w-lg mb-8 leading-relaxed">
            Stress-test a pivotal life or career dilemma against three opposing strategic worldviews, followed by an actionable ruling from Odysseus.
          </p>

          {/* STAGE 1: Initial Dilemma Input */}
          {!dilemma && (
            <div className="w-full flex flex-col gap-6">
              <form onSubmit={handleInitialSubmit} className="w-full flex flex-col gap-3">
                <div className="relative w-full">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe the decision you are wrestling with... What are the competing paths and real stakes?"
                    className="w-full p-4 pr-12 rounded-xl bg-slate-900/90 border border-white/10 focus:border-[#D97746]/70 focus:outline-none focus:ring-1 focus:ring-[#D97746]/50 text-slate-100 placeholder-slate-500 text-sm sm:text-base font-sans leading-relaxed shadow-inner resize-none transition"
                  />
                  {/* Mic Button */}
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    title={isRecording ? 'Stop Recording' : 'Speak via microphone'}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-xl border transition-all ${
                      isRecording
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse'
                        : 'bg-slate-800 text-slate-400 hover:text-[#D97746] border-white/10 hover:border-[#D97746]/40'
                    }`}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isWaiting}
                  className="w-full py-3 rounded-xl bg-[#D97746] hover:bg-[#E89162] text-[#0A0F1D] font-sans font-bold text-sm tracking-wide uppercase transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Compass size={18} />
                  {isWaiting ? 'Analyzing Dilemma...' : 'Convene the Council'}
                </button>
              </form>

              {/* Sample Dilemmas */}
              <div className="w-full pt-4 border-t border-white/5">
                <p className="text-[11px] font-sans text-slate-400 uppercase tracking-wider mb-3 text-center">
                  Or explore a classic crossroads:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sampleDilemmas.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectSampleDilemma(sample.text)}
                      className="p-3 text-left rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-[#D97746]/40 text-xs font-sans text-slate-300 hover:text-[#D97746] transition-all flex items-center justify-between"
                    >
                      <span className="truncate pr-2 font-medium">{sample.title}</span>
                      <ArrowRight size={14} className="shrink-0 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Q&A Follow-ups */}
          {dilemma && (
            <div className="w-full flex flex-col gap-4">
              {/* Dilemma Summary Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 font-sans">
                <span className="font-semibold text-[#D97746] uppercase mr-2 tracking-wide">
                  The Decision:
                </span>
                "{dilemma}"
              </div>

              {/* Conversation History */}
              {conversation.length > 0 && (
                <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                  {conversation.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/50 border-l-2 border-[#D97746] text-xs font-sans"
                    >
                      <p className="text-[#D97746] font-medium">
                        Q{i + 1}: {c.question}
                      </p>
                      <p className="text-slate-200 mt-1">
                        A: {c.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Oracle's Follow-up Question Card */}
              {currentQuestion && (
                <div className="p-5 rounded-xl bg-slate-900/90 border border-[#D97746]/40 shadow-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-sans text-[#D97746] tracking-wide uppercase font-semibold flex items-center gap-1.5">
                      <Sparkles size={14} /> Clarifying Question
                    </span>
                    <span className="text-[11px] font-sans text-slate-400">
                      Step {conversation.length + 1} of 4
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-100 font-serif leading-relaxed">
                    "{currentQuestion}"
                  </p>
                </div>
              )}

              {/* Answer Input */}
              <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your response..."
                    disabled={isWaiting}
                    className="w-full p-3.5 pr-12 rounded-xl bg-slate-900/90 border border-white/10 focus:border-[#D97746]/70 focus:outline-none focus:ring-1 focus:ring-[#D97746]/50 text-slate-100 text-sm font-sans"
                  />
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg border transition ${
                      isRecording
                        ? 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse'
                        : 'bg-slate-800 text-slate-400 hover:text-[#D97746] border-white/10'
                    }`}
                  >
                    {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={onProceedToCouncil}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans font-medium border border-white/10 transition"
                  >
                    Skip to Council Debate ➔
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isWaiting}
                    className="px-5 py-2.5 rounded-xl bg-[#D97746] hover:bg-[#E89162] text-[#0A0F1D] text-xs font-sans font-bold tracking-wide uppercase transition shadow flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {isWaiting ? 'Analyzing...' : 'Submit Response'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { Mic, MicOff, ArrowRight, AlertTriangle, Compass, CornerDownLeft } from 'lucide-react';

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
      category: 'Academic & Career',
      title: 'CS Burnout vs Creative Writing',
      text: "I'm a sophomore studying Computer Science. I feel burned out by coding assignments and drawn toward philosophy, ethics, and creative writing. But I worry about debt, job prospects, and disappointing my parents.",
    },
    {
      category: 'Risk & Compensation',
      title: 'Seed AI Startup vs Big Tech',
      text: 'I have an offer from a seed-stage AI startup with high equity and 60-hour weeks, versus a comfortable stable big tech corporate role with double the base salary.',
    },
    {
      category: 'Relocation & Stakes',
      title: 'Relocate for Long-Term Relationship',
      text: 'My partner got accepted to medical school in Chicago. I love my hometown and close-knit family, but our relationship is 4 years strong. Should I move?',
    },
    {
      category: 'Entrepreneurship',
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

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (!dilemma) handleInitialSubmit(e);
      else handleAnswerSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 select-none">
      {/* Emergency Crisis Message Override */}
      {emergencyData?.is_emergency && (
        <div className="mb-6 p-6 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-100 shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-rose-300">
            <AlertTriangle size={20} />
            <h3 className="font-sans text-base font-semibold">Immediate Support Notice</h3>
          </div>
          <p className="text-sm font-sans leading-relaxed mb-4 text-rose-200">
            {emergencyData.emergency_message}
          </p>
          <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-xs font-sans text-rose-300/80">
            If you or someone you know is in crisis, call or text 988 (Lifeline) or contact local emergency services.
          </div>
        </div>
      )}

      {/* Main Deliberative Card */}
      <div className="editorial-card rounded-2xl p-6 sm:p-10 relative">
        <GreekMeander opacity={0.2} className="mb-8" />

        {/* STAGE 1: Initial Dilemma Drafting */}
        {!dilemma && (
          <div className="w-full flex flex-col items-center">
            {/* Header Typography */}
            <div className="text-center max-w-xl mb-8">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#D4A373] uppercase font-medium mb-2 block">
                Deliberative Chamber
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-zinc-100 tracking-tight font-normal mb-3">
                The Council of Olympus
              </h2>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Bring a consequential choice before three adversarial worldviews. Athena, Poseidon, and Hermes will debate your trade-offs before Odysseus renders an actionable verdict.
              </p>
            </div>

            {/* Input Canvas */}
            <form onSubmit={handleInitialSubmit} className="w-full flex flex-col gap-3">
              <div className="relative w-full rounded-xl bg-[#0E0F13] border border-white/[0.08] focus-within:border-[#D4A373]/50 transition shadow-inner">
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your dilemma, competing paths, and real constraints (e.g. runway, timeline, personal stakes)..."
                  className="w-full p-4 sm:p-5 bg-transparent border-none focus:outline-none text-zinc-100 placeholder-zinc-600 text-sm sm:text-base font-sans leading-relaxed resize-none"
                />

                {/* Bottom Action Bar inside Textarea */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05] bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                      title={isRecording ? 'Stop Recording' : 'Dictate with microphone'}
                      className={`p-2 rounded-lg border text-xs transition flex items-center gap-1.5 ${
                        isRecording
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
                      }`}
                    >
                      {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                      <span className="text-[11px] hidden sm:inline">
                        {isRecording ? 'Recording...' : 'Voice'}
                      </span>
                    </button>
                    <span className="text-[11px] text-zinc-600 hidden md:inline font-mono">
                      ⌘ + Enter to submit
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isWaiting}
                    className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-sans font-semibold text-xs tracking-wider uppercase transition shadow hover:shadow-md disabled:opacity-40 flex items-center gap-2"
                  >
                    <Compass size={14} className="text-[#D4A373]" />
                    <span>{isWaiting ? 'Consulting...' : 'Convene Council'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Classic Crossroads (Sample Dilemmas) */}
            <div className="w-full mt-10 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  Classic Crossroads
                </span>
                <span className="text-[11px] text-zinc-600">Click to explore scenario</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sampleDilemmas.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSampleDilemma(sample.text)}
                    className="p-3.5 text-left rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.12] transition group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-[#D4A373] uppercase mb-1 block">
                        {sample.category}
                      </span>
                      <h4 className="text-xs font-sans font-medium text-zinc-200 group-hover:text-white transition">
                        {sample.title}
                      </h4>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="truncate pr-2">Load deliberation</span>
                      <ArrowRight size={13} className="text-zinc-600 group-hover:text-[#D4A373] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: Targeted Inquiry (Only when needed) */}
        {dilemma && (
          <div className="w-full flex flex-col gap-6">
            {/* Dilemma Summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] font-mono tracking-widest text-[#D4A373] uppercase block mb-1">
                The Consequence Under Review
              </span>
              <p className="text-sm font-sans text-zinc-200 leading-relaxed italic">
                "{dilemma}"
              </p>
            </div>

            {/* Conversation History */}
            {conversation.length > 0 && (
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                {conversation.map((c, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-black/30 border-l-2 border-[#D4A373] text-xs font-sans"
                  >
                    <p className="text-[#D4A373] font-medium mb-1">
                      Inquiry {i + 1}: {c.question}
                    </p>
                    <p className="text-zinc-300">
                      {c.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Oracle's Targeted Inquiry Card */}
            {currentQuestion && (
              <div className="p-6 rounded-xl bg-[#0E0F13] border border-[#D4A373]/30 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4A373] uppercase font-semibold">
                    Targeted Clarification • {Math.min(conversation.length + 1, 2)} of 2
                  </span>
                  <span className="text-[11px] font-sans text-zinc-500">
                    Sufficient context required for downside modeling
                  </span>
                </div>

                <p className="text-lg sm:text-xl text-zinc-100 font-serif leading-relaxed mb-3 font-normal">
                  "{currentQuestion}"
                </p>
                <p className="text-xs font-sans text-zinc-400">
                  The Council analyzed your initial statement and flagged this missing variable before convening Athena, Poseidon, and Hermes.
                </p>
              </div>
            )}

            {/* Answer Form */}
            <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3">
              <div className="relative rounded-xl bg-[#0E0F13] border border-white/[0.08] focus-within:border-[#D4A373]/50 transition shadow-inner">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Provide missing details..."
                  disabled={isWaiting}
                  className="w-full p-4 pr-12 bg-transparent text-zinc-100 text-sm font-sans focus:outline-none placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg border transition ${
                    isRecording
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
                  }`}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={onProceedToCouncil}
                  className="text-xs text-zinc-400 hover:text-zinc-200 font-sans transition py-2"
                >
                  Skip to Council Debate →
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isWaiting}
                  className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-sans font-semibold tracking-wider uppercase transition shadow disabled:opacity-40 flex items-center gap-2"
                >
                  <CornerDownLeft size={13} />
                  <span>{isWaiting ? 'Analyzing...' : 'Submit Response'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

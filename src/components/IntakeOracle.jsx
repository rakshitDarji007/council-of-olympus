import React, { useState } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { Mic, MicOff, ArrowRight, AlertTriangle, Compass, CornerDownLeft, Sparkles } from 'lucide-react';

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
      category: 'Academic Leverage',
      title: 'CS Burnout vs Creative Writing',
      text: "I'm a sophomore studying Computer Science. I feel burned out by coding assignments and drawn toward philosophy, ethics, and creative writing. But I worry about debt, job prospects, and disappointing my parents.",
    },
    {
      category: 'Runway & Risk',
      title: 'Seed AI Startup vs Big Tech Stability',
      text: 'I have an offer from a seed-stage AI startup with high equity and 60-hour weeks, versus a comfortable stable big tech corporate role with double the base salary.',
    },
    {
      category: 'Relocation & Stakes',
      title: 'Relocating for a Long-Term Partner',
      text: 'My partner got accepted to medical school in Chicago. I love my hometown and close-knit family, but our relationship is 4 years strong. Should I move?',
    },
    {
      category: 'Independent Venture',
      title: 'Leaving Stable Job for Indie SaaS',
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
    <div className="w-full max-w-4xl mx-auto px-4 select-none">
      {/* Emergency Crisis Message Override */}
      {emergencyData?.is_emergency && (
        <div className="mb-8 p-6 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-100 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2 text-rose-300">
            <AlertTriangle size={20} />
            <h3 className="font-sans text-base font-semibold">Immediate Support Notice</h3>
          </div>
          <p className="text-sm font-sans leading-relaxed mb-4 text-rose-200">
            {emergencyData.emergency_message}
          </p>
          <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-xs font-sans text-rose-300/80">
            If you or someone you know is in crisis, call or text 988 (Lifeline) or contact local emergency services.
          </div>
        </div>
      )}

      {/* STAGE 1: Grand Editorial Hero & Open Drafting Workspace */}
      {!dilemma && (
        <div className="w-full flex flex-col items-center">
          {/* Hero Typography Section (Inspired by Victoria Spicer & Image 1) */}
          <div className="text-center max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frosted-capsule text-[11px] font-mono tracking-[0.25em] text-[#E8A28E] uppercase font-semibold mb-5">
              <span>❖</span>
              <span>Homeric Decision Engine</span>
              <span>❖</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-white tracking-[0.06em] font-bold uppercase mb-4 leading-tight">
              The Council of Olympus
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-serif italic max-w-xl mx-auto leading-relaxed">
              "When rosy-fingered Dawn appeared, the immortals convened."
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-3 max-w-lg mx-auto leading-relaxed">
              Bring a pivotal crossroads. Athena (Strategy), Poseidon (Downside Risk), and Hermes (Agile Optionality) will stress-test your trade-offs before Odysseus renders the ruling.
            </p>
          </div>

          {/* Open Drafting Workspace (No nested card-in-a-box) */}
          <form onSubmit={handleInitialSubmit} className="w-full mb-12">
            <div className="editorial-workspace rounded-3xl p-5 sm:p-7 relative transition-all">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans mb-3 px-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#E8A28E]">
                  Formulate Your Dilemma
                </span>
                <span className="hidden sm:inline text-zinc-500">
                  Include options, runway, debt, and key stakes
                </span>
              </div>

              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the decision you are wrestling with... What are the competing paths, real constraints, and what are you most worried about losing?"
                className="w-full bg-transparent border-none focus:outline-none text-white placeholder-zinc-600 text-base sm:text-lg font-sans leading-relaxed resize-none p-1"
              />

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    title={isRecording ? 'Stop Recording' : 'Dictate with microphone'}
                    className={`px-3.5 py-1.5 rounded-full border text-xs transition flex items-center gap-2 ${
                      isRecording
                        ? 'bg-rose-950/70 text-rose-300 border-rose-500/50 animate-pulse'
                        : 'frosted-capsule text-zinc-300 hover:text-white'
                    }`}
                  >
                    {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                    <span className="text-[11px] font-medium">
                      {isRecording ? 'Listening...' : 'Voice Dictation'}
                    </span>
                  </button>
                  <span className="text-[11px] text-zinc-500 hidden md:inline font-mono">
                    ⌘ + Enter
                  </span>
                </div>

                {/* Solid Alabaster Pill Button (Inspired by Image 1) */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isWaiting}
                  className="px-7 py-3 rounded-full bg-[#F8F6F0] hover:bg-white text-[#07080D] font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 flex items-center gap-2"
                >
                  <Compass size={15} className="text-[#C87A54]" />
                  <span>{isWaiting ? 'Consulting the Gods...' : 'Convene the Council'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Classic Crossroads (Curated Scenarios) */}
          <div className="w-full pt-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-bold">
                Classic Crossroads
              </span>
              <span className="text-xs text-zinc-500">Select to load an adversarial deliberation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {sampleDilemmas.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSampleDilemma(sample.text)}
                  className="p-4 sm:p-5 text-left rounded-2xl editorial-card hover:border-[#E8A28E]/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-[#E8A28E] uppercase font-semibold mb-1.5 block">
                      {sample.category}
                    </span>
                    <h4 className="text-sm font-sans font-semibold text-white group-hover:text-[#F8F6F0] transition">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans mt-2 line-clamp-2 leading-relaxed">
                      {sample.text}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-serif italic text-zinc-400">Deliberate scenario</span>
                    <ArrowRight size={13} className="text-zinc-500 group-hover:text-[#E8A28E] transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: Targeted Inquiry (When AI Needs Missing Variable) */}
      {dilemma && (
        <div className="w-full flex flex-col gap-6">
          {/* Dilemma Banner */}
          <div className="p-5 rounded-2xl editorial-workspace">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-bold block mb-1.5">
              The Dilemma Under Review
            </span>
            <p className="text-base font-sans text-zinc-200 leading-relaxed italic">
              "{dilemma}"
            </p>
          </div>

          {/* Conversation History */}
          {conversation.length > 0 && (
            <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
              {conversation.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-black/40 border-l-2 border-[#E8A28E] text-xs font-sans"
                >
                  <p className="text-[#E8A28E] font-medium mb-1">
                    Inquiry {i + 1}: {c.question}
                  </p>
                  <p className="text-zinc-200">
                    {c.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Targeted Clarification Card */}
          {currentQuestion && (
            <div className="p-7 sm:p-9 rounded-3xl editorial-card border-[#E8A28E]/40 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-widest text-[#E8A28E] uppercase font-bold">
                  Targeted Clarification • {Math.min(conversation.length + 1, 2)} of 2
                </span>
                <span className="text-xs font-sans text-zinc-400">
                  Required to weigh downside risk
                </span>
              </div>

              <p className="text-xl sm:text-2xl text-white font-serif leading-relaxed mb-4 font-normal">
                "{currentQuestion}"
              </p>
              <p className="text-xs font-sans text-zinc-400">
                The Council analyzed your initial submission and requires this variable to weigh strategic exposure accurately.
              </p>
            </div>
          )}

          {/* Answer Input */}
          <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3">
            <div className="relative rounded-2xl editorial-workspace">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your response..."
                disabled={isWaiting}
                className="w-full p-4 sm:p-5 pr-14 bg-transparent text-white text-base font-sans focus:outline-none placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full border transition ${
                  isRecording
                    ? 'bg-rose-950/70 text-rose-300 border-rose-500/50 animate-pulse'
                    : 'frosted-capsule text-zinc-400 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onProceedToCouncil}
                className="text-xs text-zinc-400 hover:text-white font-sans transition py-2"
              >
                Skip to Council Debate →
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isWaiting}
                className="px-7 py-3 rounded-full bg-[#F8F6F0] hover:bg-white text-[#07080D] text-xs font-sans font-bold tracking-wider uppercase transition-all shadow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 flex items-center gap-2"
              >
                <CornerDownLeft size={13} />
                <span>{isWaiting ? 'Analyzing...' : 'Submit Response'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

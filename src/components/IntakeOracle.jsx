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
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Emergency Crisis Message Override */}
      {emergencyData?.is_emergency && (
        <div className="mb-6 p-6 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-100 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2 text-rose-300">
            <AlertTriangle size={20} />
            <h3 className="font-sans text-base font-semibold">Immediate Support Notice</h3>
          </div>
          <p className="text-sm font-sans leading-relaxed mb-4 text-rose-200">
            {emergencyData.emergency_message}
          </p>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs font-sans text-rose-300/80">
            If you or someone you know is in crisis, call or text 988 (Lifeline) or contact local emergency services.
          </div>
        </div>
      )}

      {/* Main Deliberative Card (Inspired by Image 1 & Hermes Agent) */}
      <div className="editorial-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle Rosy Dawn Bloom inside card */}
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(228, 164, 149, 0.4) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <GreekMeander opacity={0.25} className="mb-8" />

        {/* STAGE 1: Initial Dilemma Drafting */}
        {!dilemma && (
          <div className="w-full flex flex-col items-center relative z-10">
            {/* Hero Typography (Inspired by Image 1 "WELCOME" & Image 2 "VICTORIA") */}
            <div className="text-center max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-capsule text-[11px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-medium mb-4">
                <span>❖</span>
                <span>Homeric Deliberative Crucible</span>
                <span>❖</span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl text-white tracking-[0.08em] font-bold uppercase mb-4 leading-tight">
                The Council of Olympus
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-serif italic max-w-lg mx-auto leading-relaxed">
                "When rosy-fingered Dawn appeared, the immortals convened."
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-2 max-w-lg mx-auto leading-relaxed">
                Bring your mortal dilemma. Athena (Strategy), Poseidon (Downside Risk), and Hermes (Agile Optionality) will cross-examine your trade-offs before Odysseus renders the verdict.
              </p>
            </div>

            {/* Input Canvas (Inspired by Image 1 Center Console) */}
            <form onSubmit={handleInitialSubmit} className="w-full flex flex-col gap-4">
              <div className="relative w-full rounded-2xl bg-black/30 border border-white/[0.12] focus-within:border-[#E8A28E]/60 transition shadow-inner backdrop-blur-xl">
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your dilemma... What are the competing paths, financial constraints, and what are you most afraid of giving up?"
                  className="w-full p-5 sm:p-6 bg-transparent border-none focus:outline-none text-white placeholder-zinc-500 text-sm sm:text-base font-sans leading-relaxed resize-none"
                />

                {/* Bottom Action Bar inside Textarea */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.08] bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                      title={isRecording ? 'Stop Recording' : 'Dictate with microphone'}
                      className={`px-3 py-1.5 rounded-full border text-xs transition flex items-center gap-1.5 ${
                        isRecording
                          ? 'bg-rose-950/70 text-rose-300 border-rose-500/50 animate-pulse'
                          : 'frosted-capsule text-zinc-300 hover:text-white'
                      }`}
                    >
                      {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                      <span className="text-[11px] font-medium hidden sm:inline">
                        {isRecording ? 'Listening...' : 'Voice Dictation'}
                      </span>
                    </button>
                    <span className="text-[11px] text-zinc-500 hidden md:inline font-mono">
                      ⌘ + Enter
                    </span>
                  </div>

                  {/* Primary Solid Alabaster Pill Button (Inspired by Image 1 "LEARN MORE" button) */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isWaiting}
                    className="px-6 py-2.5 rounded-full bg-[#F8F6F0] hover:bg-white text-[#0A0C16] font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 flex items-center gap-2"
                  >
                    <Compass size={14} className="text-[#C87A54]" />
                    <span>{isWaiting ? 'Analyzing...' : 'Convene the Council'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Classic Crossroads (Inspired by Hermes Agent Feature Cards) */}
            <div className="w-full mt-10 pt-8 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-bold">
                  Classic Crossroads
                </span>
                <span className="text-[11px] text-zinc-500">Tap to load curated scenario</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleDilemmas.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSampleDilemma(sample.text)}
                    className="p-4 text-left rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.16] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-[#E8A28E] uppercase font-medium mb-1 block">
                        {sample.category}
                      </span>
                      <h4 className="text-xs font-sans font-semibold text-zinc-200 group-hover:text-white transition">
                        {sample.title}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="truncate pr-2 font-serif italic text-zinc-400">Load counsel</span>
                      <ArrowRight size={13} className="text-zinc-500 group-hover:text-[#E8A28E] transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: Targeted Inquiry (Only when needed) */}
        {dilemma && (
          <div className="w-full flex flex-col gap-6 relative z-10">
            {/* Dilemma Summary */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#E8A28E] uppercase font-bold block mb-1">
                The Consequence Under Review
              </span>
              <p className="text-sm font-sans text-zinc-200 leading-relaxed italic">
                "{dilemma}"
              </p>
            </div>

            {/* Conversation History */}
            {conversation.length > 0 && (
              <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
                {conversation.map((c, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-black/30 border-l-2 border-[#E8A28E] text-xs font-sans"
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

            {/* Oracle's Targeted Inquiry Card */}
            {currentQuestion && (
              <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-[#E8A28E]/40 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#E8A28E] uppercase font-bold">
                    Targeted Clarification • {Math.min(conversation.length + 1, 2)} of 2
                  </span>
                  <span className="text-[11px] font-sans text-zinc-400">
                    Sufficient context required for downside modeling
                  </span>
                </div>

                <p className="text-lg sm:text-2xl text-white font-serif leading-relaxed mb-3 font-normal">
                  "{currentQuestion}"
                </p>
                <p className="text-xs font-sans text-zinc-400">
                  The Council analyzed your initial statement and flagged this missing trade-off before convening Athena, Poseidon, and Hermes.
                </p>
              </div>
            )}

            {/* Answer Form */}
            <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3">
              <div className="relative rounded-2xl bg-black/30 border border-white/[0.12] focus-within:border-[#E8A28E]/60 transition shadow-inner backdrop-blur-xl">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Provide clarification..."
                  disabled={isWaiting}
                  className="w-full p-4 sm:p-5 pr-14 bg-transparent text-white text-sm font-sans focus:outline-none placeholder-zinc-500"
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

              <div className="flex items-center justify-between gap-3 pt-1">
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
                  className="px-6 py-2.5 rounded-full bg-[#F8F6F0] hover:bg-white text-[#0A0C16] text-xs font-sans font-bold tracking-wider uppercase transition-all shadow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 flex items-center gap-2"
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

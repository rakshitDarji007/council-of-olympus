import React, { useState } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { Mic, MicOff, ArrowRight, AlertTriangle, Compass, Send, Sparkles } from 'lucide-react';

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
        <div className="mb-8 p-6 rounded-2xl bg-[#fff0ed] border border-[#b4654d]/40 text-[#1a3a52] shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-[#b4654d]">
            <AlertTriangle size={20} />
            <h3 className="font-sans text-base font-bold">Immediate Support Notice</h3>
          </div>
          <p className="text-sm font-sans leading-relaxed mb-4 text-[#506575]">
            {emergencyData.emergency_message}
          </p>
          <div className="p-3 bg-[#f6eddf] rounded-xl border border-[#ded0bc] text-xs font-sans text-[#1a3a52]">
            If you or someone you know is in crisis, call or text 988 (Lifeline) or contact local emergency services.
          </div>
        </div>
      )}

      {/* STAGE 1: Grand Minimalist Editorial Hero & Open Drafting Desk */}
      {!dilemma && (
        <div className="w-full flex flex-col items-center">
          {/* Hero Typography Section */}
          <div className="text-center max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 header-pill-nav text-[11px] font-mono tracking-[0.2em] text-[#b4654d] uppercase font-bold mb-5">
              <span>❖</span>
              <span>Homeric Decision Engine</span>
              <span>❖</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-[#1a3a52] tracking-[0.08em] font-bold uppercase mb-4 leading-tight">
              The Council of Olympus
            </h1>

            <p className="text-lg sm:text-xl text-[#305873] font-serif italic max-w-xl mx-auto leading-relaxed">
              "When rosy-fingered Dawn appeared, the immortals convened."
            </p>

            <p className="text-xs sm:text-sm text-[#506575] font-sans mt-3 max-w-lg mx-auto leading-relaxed">
              Stress-test a pivotal life or career dilemma against three opposing strategic worldviews, followed by an actionable ruling from Odysseus.
            </p>
          </div>

          {/* Open Drafting Workspace (Light Parchment Desk) */}
          <form onSubmit={handleInitialSubmit} className="w-full mb-12">
            <div className="odyssey-card p-6 sm:p-8 relative">
              <div className="flex items-center justify-between text-xs font-sans mb-3 px-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#b4654d] font-bold">
                  Formulate Your Dilemma
                </span>
                <span className="hidden sm:inline text-[#8ca1aa] font-medium">
                  Include options, runway, debt, and key stakes
                </span>
              </div>

              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the decision you are wrestling with... What are the competing paths, real constraints, and what are you most worried about losing?"
                className="w-full bg-transparent border-none focus:outline-none text-[#1a3a52] placeholder-[#8ca1aa] text-base sm:text-lg font-sans leading-relaxed resize-none p-1"
              />

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#ded0bc]">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    title={isRecording ? 'Stop Recording' : 'Dictate with microphone'}
                    className={`px-3.5 py-1.5 rounded-full border text-xs transition flex items-center gap-2 ${
                      isRecording
                        ? 'bg-[#b4654d] text-[#f6eddf] border-[#b4654d] animate-pulse'
                        : 'header-pill-nav text-[#1a3a52] hover:bg-[#fffbf5]'
                    }`}
                  >
                    {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                    <span className="text-[11px] font-semibold">
                      {isRecording ? 'Listening...' : 'Voice Dictation'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const randomSample = sampleDilemmas[Math.floor(Math.random() * sampleDilemmas.length)];
                      setInputText(randomSample.text);
                    }}
                    title="Insert a sample dilemma into the drafting box"
                    className="px-3 py-1.5 rounded-full header-pill-nav text-[#506575] hover:text-[#b4654d] hover:bg-[#fffbf5] text-xs transition flex items-center gap-1.5"
                  >
                    <Sparkles size={12} className="text-[#b4654d]" />
                    <span className="text-[11px] font-semibold">Try Example</span>
                  </button>

                  <span className="text-[11px] text-[#8ca1aa] hidden md:inline font-mono">
                    ⌘ + Enter
                  </span>
                </div>

                {/* HackUTA Signature Odyssey Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isWaiting}
                  className="odyssey-btn flex items-center gap-2"
                >
                  <Compass size={14} className="text-[#b4654d]" />
                  <span>{isWaiting ? 'Consulting the Gods...' : 'Convene the Council'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Classic Crossroads (Curated Scenarios) */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#b4654d] uppercase font-bold">
                Classic Crossroads
              </span>
              <span className="text-xs text-[#506575]">Select to load an adversarial deliberation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleDilemmas.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSampleDilemma(sample.text)}
                  className="p-5 text-left rounded-2xl odyssey-card hover:bg-[#fffcf7] transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-[#b4654d] uppercase font-bold mb-1.5 block">
                      {sample.category}
                    </span>
                    <h4 className="text-sm font-sans font-bold text-[#1a3a52] group-hover:text-[#305873] transition">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-[#506575] font-sans mt-2 line-clamp-2 leading-relaxed">
                      {sample.text}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#ded0bc]/60 flex items-center justify-between text-[11px]">
                    <span className="font-serif italic text-[#305873]">Deliberate scenario</span>
                    <ArrowRight size={13} className="text-[#b4654d] group-hover:translate-x-1 transition-transform" />
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
          <div className="p-5 rounded-2xl odyssey-card">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#b4654d] uppercase font-bold block mb-1.5">
              The Dilemma Under Review
            </span>
            <p className="text-base font-sans text-[#1a3a52] leading-relaxed italic">
              "{dilemma}"
            </p>
          </div>

          {/* Conversation History */}
          {conversation.length > 0 && (
            <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
              {conversation.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#f6eddf] border-l-4 border-[#b4654d] text-xs font-sans shadow-sm"
                >
                  <p className="text-[#b4654d] font-bold mb-1">
                    Inquiry {i + 1}: {c.question}
                  </p>
                  <p className="text-[#1a3a52]">
                    {c.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Targeted Clarification Card */}
          {currentQuestion && (
            <div className="p-7 sm:p-9 rounded-3xl odyssey-card border-[#ded0bc] shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-widest text-[#b4654d] uppercase font-bold">
                  Targeted Clarification • {Math.min(conversation.length + 1, 2)} of 2
                </span>
                <span className="text-xs font-sans text-[#506575]">
                  Required to weigh downside risk
                </span>
              </div>

              <p className="text-xl sm:text-2xl text-[#1a3a52] font-serif leading-relaxed mb-4 font-normal">
                "{currentQuestion}"
              </p>
              <p className="text-xs font-sans text-[#506575] mb-6">
                The Council analyzed your initial submission and requires this variable to weigh strategic exposure accurately.
              </p>

              <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Provide specific numbers, timeline, or non-negotiables..."
                    className="w-full bg-[#eee3d2]/60 border border-[#ded0bc] rounded-full px-5 py-3.5 text-[#1a3a52] placeholder-[#8ca1aa] text-sm font-sans focus:outline-none focus:border-[#305873]"
                  />
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    title={isRecording ? 'Stop Recording' : 'Voice Dictate'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#506575] hover:text-[#1a3a52]"
                  >
                    {isRecording ? (
                      <MicOff size={16} className="text-[#b4654d] animate-pulse" />
                    ) : (
                      <Mic size={16} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={onProceedToCouncil}
                    className="header-pill-nav px-5 py-2 text-xs text-[#506575] hover:text-[#1a3a52]"
                  >
                    Skip to Council Debate →
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isWaiting}
                    className="odyssey-btn flex items-center gap-2"
                  >
                    <Send size={13} />
                    <span>{isWaiting ? 'Analyzing...' : 'Submit Response'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

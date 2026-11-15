import React, { useState } from 'react';
import GodAvatar from './GodAvatar.jsx';
import GreekMeander from './GreekMeander.jsx';
import { Mic, MicOff, Send, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';

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
      title: 'Change Major (CS to Philosophy)',
      text: 'I am a sophomore studying Computer Science. I feel drained by coding assignments and drawn toward philosophy, ethics, and creative writing. But I worry about debt, job prospects, and disappointing my parents.',
    },
    {
      title: 'Startup vs Big Tech Offer',
      text: 'I have an offer from a seed-stage AI startup with high equity and 60-hour weeks, versus a comfortable stable big tech corporate role with double the base salary.',
    },
    {
      title: 'Relocate for Love',
      text: 'My partner got accepted to medical school in Chicago. I love my hometown and close-knit family, but our relationship is 4 years strong. Should I move?',
    },
    {
      title: 'Quitting Job to Build App',
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
    <div className="w-full max-w-3xl mx-auto px-4 py-4 select-none">
      {/* Emergency Crisis Message Override */}
      {emergencyData?.is_emergency && (
        <div className="mb-6 p-6 rounded-xl bg-[#9B3B33]/90 border-2 border-[#E4EC6A] text-[#FDF4CC] shadow-2xl">
          <div className="flex items-center gap-3 mb-3 text-[#E4EC6A]">
            <AlertTriangle size={28} />
            <h3 className="font-heading text-xl font-bold tracking-wider">
              Sacred Sanctuary Notice
            </h3>
          </div>
          <p className="text-base sm:text-lg font-body leading-relaxed mb-4">
            {emergencyData.emergency_message}
          </p>
          <div className="p-3 bg-[#1B1B16] rounded border border-[#EE8A2E] text-xs font-serif text-[#DDD3C8]">
            For reflection, not professional advice. If you or someone you know is struggling or in crisis, help is available. Call or text 988 in the US & Canada.
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="torn-panel rounded-2xl overflow-hidden shadow-2xl relative">
        <GreekMeander height={14} color="#EE8A2E" opacity={0.7} />

        <div className="p-6 sm:p-8 flex flex-col items-center">
          {/* Oracle Icon / Avatar */}
          <div className="relative mb-3">
            <GodAvatar speaker="oracle" size={110} isActive={true} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1B1B16] border border-[#E4EC6A] text-[10px] font-serif font-bold text-[#E4EC6A] tracking-widest uppercase">
              The Oracle
            </div>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl text-center text-[#FDF4CC] tracking-wider mb-1">
            The Delphic Threshold
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#DDD3C8] text-center tracking-widest uppercase mb-6">
            Bring your mortal dilemma before the council of Olympus
          </p>

          {/* MODE 1: Initial Dilemma Input */}
          {!dilemma && (
            <div className="w-full flex flex-col items-center gap-4">
              <form onSubmit={handleInitialSubmit} className="w-full flex flex-col gap-3">
                <div className="relative w-full">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Speak, mortal... What crossroads do you stand before? (e.g. Should I change my major? Should I take the startup offer?)"
                    className="w-full p-4 rounded-xl bg-[#12233F]/80 border-2 border-[#EE8A2E]/50 focus:border-[#EE8A2E] focus:outline-none text-[#FDF4CC] placeholder-[#DDD3C8]/40 text-base font-body leading-relaxed shadow-inner resize-none transition"
                  />
                  {/* Voice Input Mic Button */}
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    title={isRecording ? 'Stop Recording' : 'Speak dilemma via mic'}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-full border transition-all ${
                      isRecording
                        ? 'bg-[#9B3B33] text-[#E4EC6A] border-[#E4EC6A] animate-pulse scale-110'
                        : 'bg-[#1B1B16] text-[#DDD3C8] hover:text-[#EE8A2E] border-[#EE8A2E]/40 hover:border-[#EE8A2E]'
                    }`}
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isWaiting}
                  className="w-full py-3.5 rounded-xl bg-[#EE8A2E] hover:bg-[#FFA959] text-[#12233F] font-heading font-black text-base sm:text-lg tracking-wider uppercase transition-all shadow-lg hover:shadow-god-glow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                >
                  <Sparkles size={20} />
                  {isWaiting ? 'Consulting the Gods...' : 'Enter the Chamber of Olympus'}
                </button>
              </form>

              {/* Sample Dilemmas for Fast Testing */}
              <div className="w-full mt-4 pt-4 border-t border-[#EE8A2E]/20">
                <p className="text-xs font-serif text-[#DDD3C8]/70 uppercase tracking-widest mb-2 text-center">
                  ✦ Or explore a sample crossroads:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleDilemmas.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectSampleDilemma(sample.text)}
                      className="p-2.5 text-left rounded-lg bg-[#12233F]/60 hover:bg-[#12233F] border border-[#EE8A2E]/30 hover:border-[#EE8A2E] text-xs font-serif text-[#DDD3C8] hover:text-[#EE8A2E] transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{sample.title}</span>
                      <ArrowRight size={12} className="shrink-0 ml-1 text-[#EE8A2E]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Oracle Q&A Follow-ups */}
          {dilemma && (
            <div className="w-full flex flex-col gap-4">
              {/* Original Dilemma Banner */}
              <div className="p-3.5 rounded-lg bg-[#12233F]/70 border border-[#EE8A2E]/30 text-xs font-body text-[#DDD3C8]">
                <span className="font-serif font-bold text-[#EE8A2E] uppercase mr-2 tracking-wider">
                  The Mortal Dilemma:
                </span>
                "{dilemma}"
              </div>

              {/* Previous Q&A context pills */}
              {conversation.length > 0 && (
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                  {conversation.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#1B1B16]/80 border-l-2 border-[#C1DDD0] text-xs"
                    >
                      <p className="text-[#C1DDD0] font-serif font-semibold">
                        Q{i + 1}: {c.question}
                      </p>
                      <p className="text-[#FDF4CC]/90 font-body mt-0.5">
                        A: {c.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Oracle's Current Question Card */}
              {currentQuestion && (
                <div className="p-5 rounded-xl bg-[#12233F] border-2 border-[#E4EC6A]/70 shadow-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif text-[#E4EC6A] tracking-wider uppercase font-bold flex items-center gap-1.5">
                      <Sparkles size={14} /> The Oracle Inquires:
                    </span>
                    <span className="text-xs font-serif text-[#DDD3C8]">
                      Question {conversation.length + 1} of 4
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-[#FDF4CC] font-body font-medium italic">
                    "{currentQuestion}"
                  </p>
                </div>
              )}

              {/* Answer Input Form */}
              <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Speak your answer, mortal..."
                    disabled={isWaiting}
                    className="w-full p-3.5 pr-12 rounded-xl bg-[#12233F]/90 border border-[#EE8A2E]/60 focus:border-[#EE8A2E] focus:outline-none text-[#FDF4CC] text-sm font-body shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full border transition ${
                      isRecording
                        ? 'bg-[#9B3B33] text-[#E4EC6A] border-[#E4EC6A] animate-pulse'
                        : 'bg-[#1B1B16] text-[#DDD3C8] hover:text-[#EE8A2E] border-[#EE8A2E]/30'
                    }`}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Skip to council directly */}
                  <button
                    type="button"
                    onClick={onProceedToCouncil}
                    className="px-4 py-2 rounded-lg bg-[#1F5C66] hover:bg-[#133E46] text-[#C1DDD0] text-xs font-serif font-bold tracking-wider uppercase border border-[#C1DDD0]/40 transition"
                  >
                    Proceed to Council Now ➔
                  </button>

                  {/* Submit answer */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isWaiting}
                    className="px-5 py-2.5 rounded-lg bg-[#EE8A2E] hover:bg-[#FFA959] text-[#12233F] text-xs font-heading font-black tracking-wider uppercase border border-[#EE8A2E] transition shadow hover:shadow-god-glow flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {isWaiting ? 'Deliberating...' : 'Submit Answer'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <GreekMeander height={12} color="#EE8A2E" opacity={0.5} />
      </div>

      {/* Safety & Educational Reflection Footer */}
      <div className="mt-4 text-center">
        <p className="text-[11px] font-serif text-[#DDD3C8]/60 tracking-wider">
          ✦ For reflection, not professional advice. Inspired by Homer's Odyssey. ✦
        </p>
      </div>
    </div>
  );
}

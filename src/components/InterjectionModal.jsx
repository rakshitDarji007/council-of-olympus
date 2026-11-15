import React, { useState } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { MessageSquare, Mic, MicOff, X, Send } from 'lucide-react';

export default function InterjectionModal({
  isOpen = false,
  onClose,
  onSubmitInterjection,
  isRecording = false,
  onStartVoiceInput,
  onStopVoiceInput,
  isSubmitting = false,
}) {
  const [interjectionText, setInterjectionText] = useState('');
  const [targetGod, setTargetGod] = useState('all');

  if (!isOpen) return null;

  const quickInterjections = [
    'What if I take a leave of absence for one semester first?',
    'My student debt is actually much smaller than you assume.',
    'I talked to an industry mentor who suggested keeping the double major.',
    'I care more about meaning and craft than high corporate salary.',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!interjectionText.trim()) return;
    const prefix = targetGod !== 'all' ? `[To ${targetGod.toUpperCase()}]: ` : '';
    onSubmitInterjection(`${prefix}${interjectionText.trim()}`);
    setInterjectionText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fadeIn">
      <div className="torn-panel rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative border-2 border-[#EE8A2E]">
        <GreekMeander height={14} color="#EE8A2E" opacity={0.7} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EE8A2E]/20 pb-3 mb-4">
            <div className="flex items-center gap-2 text-[#EE8A2E]">
              <MessageSquare size={20} />
              <h3 className="font-heading text-xl font-bold tracking-wider">
                Speak, Mortal
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 rounded-full text-[#DDD3C8] hover:text-[#EE8A2E] hover:bg-[#12233F] transition"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-serif text-[#DDD3C8] mb-4">
            Interrupt the divine deliberation. Address a specific god, introduce new constraints, or steer the debate.
          </p>

          {/* Target God Selector */}
          <div className="mb-4">
            <span className="text-[11px] font-serif text-[#EE8A2E] tracking-widest uppercase block mb-1.5 font-bold">
              Address To:
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs font-serif font-bold">
              {[
                { id: 'all', label: 'All Gods' },
                { id: 'athena', label: 'Athena' },
                { id: 'poseidon', label: 'Poseidon' },
                { id: 'hermes', label: 'Hermes' },
              ].map((god) => (
                <button
                  key={god.id}
                  type="button"
                  onClick={() => setTargetGod(god.id)}
                  className={`py-1.5 px-2 rounded border uppercase transition-all ${
                    targetGod === god.id
                      ? 'bg-[#EE8A2E] text-[#12233F] border-[#EE8A2E] shadow-sm'
                      : 'bg-[#12233F] text-[#DDD3C8] border-[#EE8A2E]/30 hover:border-[#EE8A2E]'
                  }`}
                >
                  {god.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <textarea
                rows={3}
                value={interjectionText}
                onChange={(e) => setInterjectionText(e.target.value)}
                placeholder="What must the gods know before they decree?"
                className="w-full p-3.5 pr-12 rounded-xl bg-[#12233F] border border-[#EE8A2E]/50 focus:border-[#EE8A2E] focus:outline-none text-[#FDF4CC] placeholder-[#DDD3C8]/40 text-sm font-body resize-none"
              />
              <button
                type="button"
                onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
                className={`absolute right-3 bottom-3 p-2 rounded-full border transition ${
                  isRecording
                    ? 'bg-[#9B3B33] text-[#E4EC6A] border-[#E4EC6A] animate-pulse'
                    : 'bg-[#1B1B16] text-[#DDD3C8] hover:text-[#EE8A2E] border-[#EE8A2E]/30'
                }`}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-1">
              {quickInterjections.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInterjectionText(suggestion)}
                  className="text-[11px] font-body text-[#C1DDD0] hover:text-[#FDF4CC] bg-[#1F5C66]/40 hover:bg-[#1F5C66]/80 px-2.5 py-1 rounded-full border border-[#C1DDD0]/20 transition"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#1B1B16] text-[#DDD3C8] hover:text-[#FDF4CC] text-xs font-serif uppercase tracking-wider border border-[#EE8A2E]/30 transition"
              >
                Remain Silent
              </button>
              <button
                type="submit"
                disabled={!interjectionText.trim() || isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#9B3B33] hover:bg-[#752B24] text-[#FDF4CC] text-xs font-heading font-black tracking-wider uppercase border border-[#EE8A2E] transition flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Send size={14} className="text-[#EE8A2E]" />
                {isSubmitting ? 'Summoning Echoes...' : 'Speak into Council'}
              </button>
            </div>
          </form>
        </div>

        <GreekMeander height={10} color="#EE8A2E" opacity={0.5} />
      </div>
    </div>
  );
}

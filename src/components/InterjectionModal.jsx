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
    'What if I take a one-semester leave of absence first?',
    'My actual financial debt is lower than you assume.',
    'I spoke with an industry mentor who advised keeping the technical base.',
    'I care much more about intellectual craft than maximizing starting salary.',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none animate-fade-in">
      <div className="editorial-card rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-7">
        <GreekMeander opacity={0.25} className="mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2.5 text-slate-100">
            <MessageSquare size={18} className="text-[#D97746]" />
            <h3 className="font-heading text-lg font-bold">
              Interject with New Context
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
          Introduce an overlooked constraint, clarify numbers, or address a specific council voice to reshape the remaining deliberation.
        </p>

        {/* Target Selector */}
        <div className="mb-4">
          <span className="text-[11px] font-sans text-slate-400 uppercase tracking-wider block mb-2 font-medium">
            Address Voice:
          </span>
          <div className="grid grid-cols-4 gap-2 text-xs font-sans font-medium">
            {[
              { id: 'all', label: 'All Voices' },
              { id: 'athena', label: 'Athena' },
              { id: 'poseidon', label: 'Poseidon' },
              { id: 'hermes', label: 'Hermes' },
            ].map((god) => (
              <button
                key={god.id}
                type="button"
                onClick={() => setTargetGod(god.id)}
                className={`py-1.5 px-2 rounded-xl border transition-all ${
                  targetGod === god.id
                    ? 'bg-[#D97746] text-[#0A0F1D] border-[#D97746] font-bold shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 border-white/5 hover:border-white/20'
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
              placeholder="What new facts or constraints should the council account for?"
              className="w-full p-3.5 pr-12 rounded-xl bg-slate-900 border border-white/10 focus:border-[#D97746]/70 focus:outline-none focus:ring-1 focus:ring-[#D97746]/50 text-slate-100 text-sm font-sans resize-none"
            />
            <button
              type="button"
              onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
              className={`absolute right-3 bottom-3 p-2 rounded-lg border transition ${
                isRecording
                  ? 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-[#D97746] border-white/10'
              }`}
            >
              {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {quickInterjections.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInterjectionText(suggestion)}
                className="text-[11px] font-sans text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-white/5 transition"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-sans font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!interjectionText.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#D97746] hover:bg-[#E89162] text-[#0A0F1D] text-xs font-sans font-bold uppercase tracking-wide transition flex items-center gap-1.5 shadow disabled:opacity-50"
            >
              <Send size={13} />
              {isSubmitting ? 'Integrating...' : 'Submit to Council'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

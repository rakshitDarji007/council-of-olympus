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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fade-in">
      <div className="editorial-card rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-7">
        <GreekMeander opacity={0.2} className="mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
          <div className="flex items-center gap-2.5 text-zinc-100">
            <MessageSquare size={16} className="text-[#D4A373]" />
            <h3 className="font-heading text-lg font-normal">
              Interject New Variable
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4 font-sans leading-relaxed">
          Introduce an overlooked constraint or challenge a specific council perspective to reshape the ongoing debate.
        </p>

        {/* Direct Address Selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Direct To:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Full Council' },
              { id: 'athena', label: 'Athena' },
              { id: 'poseidon', label: 'Poseidon' },
              { id: 'hermes', label: 'Hermes' },
            ].map((god) => (
              <button
                key={god.id}
                type="button"
                onClick={() => setTargetGod(god.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider transition ${
                  targetGod === god.id
                    ? 'bg-[#D4A373] text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {god.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative rounded-xl bg-[#0E0F13] border border-white/[0.08] focus-within:border-[#D4A373]/50 transition shadow-inner">
            <textarea
              rows={3}
              value={interjectionText}
              onChange={(e) => setInterjectionText(e.target.value)}
              placeholder="State your new constraint or counter-argument..."
              className="w-full p-3.5 pr-12 bg-transparent text-sm font-sans text-zinc-100 focus:outline-none placeholder-zinc-600 resize-none"
            />
            <button
              type="button"
              onClick={isRecording ? onStopVoiceInput : onStartVoiceInput}
              className={`absolute right-2.5 bottom-2.5 p-2 rounded-lg border transition ${
                isRecording
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-white/[0.06]'
              }`}
            >
              {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>

          {/* Quick Interjections */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              Quick Objections
            </span>
            <div className="flex flex-col gap-1">
              {quickInterjections.slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInterjectionText(item)}
                  className="text-left text-[11px] font-sans text-zinc-400 hover:text-[#D4A373] transition truncate py-1 px-2 rounded hover:bg-white/[0.02]"
                >
                  "{item}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06] mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-sans text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!interjectionText.trim() || isSubmitting}
              className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-sans font-semibold tracking-wider uppercase transition shadow flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Summoning...' : 'Submit Objection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

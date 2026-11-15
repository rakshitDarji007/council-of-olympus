import React, { useState, useRef, useEffect } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { MessageSquare, Mic, MicOff, X, Send } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';

export default function InterjectionModal({
  isOpen = false,
  onClose,
  onSubmitInterjection,
  isSubmitting = false,
}) {
  const [interjectionText, setInterjectionText] = useState('');
  const [targetGod, setTargetGod] = useState('all');
  const [silencePending, setSilencePending] = useState(false);
  const baseTextRef = useRef('');
  const autoSubmitTimerRef = useRef(null);
  const latestTextRef = useRef('');

  latestTextRef.current = interjectionText;

  const clearAutoSubmitTimer = () => {
    if (autoSubmitTimerRef.current) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
    setSilencePending(false);
  };

  const handleDirectSubmit = (rawText) => {
    const textToSubmit = (rawText !== undefined ? rawText : latestTextRef.current || interjectionText || '').trim();
    if (!textToSubmit || isSubmitting) return;
    clearAutoSubmitTimer();
    if (isRecording) stopRecording();
    const prefix = targetGod !== 'all' ? `[To ${targetGod.toUpperCase()}]: ` : '';
    onSubmitInterjection(`${prefix}${textToSubmit}`);
    setInterjectionText('');
    latestTextRef.current = '';
    onClose();
  };

  const scheduleAutoSubmit = (text) => {
    clearAutoSubmitTimer();
    const clean = (text || '').trim();
    if (clean.length < 5 || isSubmitting) return;

    setSilencePending(true);
    autoSubmitTimerRef.current = setTimeout(() => {
      const current = (latestTextRef.current || '').trim();
      if (current.length >= 5 && !isSubmitting) {
        handleDirectSubmit(current);
      } else {
        setSilencePending(false);
      }
    }, 2200);
  };

  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useSpeechRecognition({
    onTranscript: (transcript) => {
      const fullText = baseTextRef.current ? `${baseTextRef.current} ${transcript}` : transcript;
      setInterjectionText(fullText);
      latestTextRef.current = fullText;
      scheduleAutoSubmit(fullText);
    },
    onSpeechEnd: () => {
      const current = (latestTextRef.current || '').trim();
      if (current.length >= 5 && !isSubmitting) {
        handleDirectSubmit(current);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (autoSubmitTimerRef.current) {
        clearTimeout(autoSubmitTimerRef.current);
      }
    };
  }, []);

  const handleToggleVoice = () => {
    if (isRecording) {
      stopRecording();
      clearAutoSubmitTimer();
      const current = (latestTextRef.current || interjectionText || '').trim();
      if (current.length >= 5 && !isSubmitting) {
        handleDirectSubmit(current);
      }
    } else {
      baseTextRef.current = interjectionText ? interjectionText.trim() : '';
      startRecording();
    }
  };

  const handleModalClose = () => {
    clearAutoSubmitTimer();
    if (isRecording) stopRecording();
    onClose();
  };

  if (!isOpen) return null;

  const quickInterjections = [
    'What if I take a one-semester leave of absence first?',
    'My actual financial debt is lower than you assume.',
    'I spoke with an industry mentor who advised keeping the technical base.',
    'I care much more about intellectual craft than maximizing starting salary.',
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    handleDirectSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDirectSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3a52]/40 backdrop-blur-md select-none animate-fade-in">
      <div className="odyssey-card rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-8">
        <GreekMeander opacity={0.5} className="mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ded0bc] pb-3 mb-4">
          <div className="flex items-center gap-2.5 text-[#1a3a52]">
            <MessageSquare size={16} className="text-[#b4654d]" />
            <h3 className="font-heading text-lg font-bold">
              Interject New Variable
            </h3>
          </div>
          <button
            onClick={handleModalClose}
            disabled={isSubmitting}
            className="p-1 rounded-full text-[#506575] hover:text-[#1a3a52] hover:bg-[#eee3d2] transition"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-[#506575] mb-4 font-sans leading-relaxed">
          Introduce an overlooked constraint or challenge a specific council perspective to reshape the ongoing debate.
        </p>

        {/* Direct Address Selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono tracking-wider text-[#506575] uppercase font-bold">
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
                className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition font-semibold ${
                  targetGod === god.id
                    ? 'bg-[#b4654d] text-[#f6eddf]'
                    : 'header-pill-nav text-[#506575] hover:text-[#1a3a52]'
                }`}
              >
                {god.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-4">
          <span className="text-[10px] font-mono tracking-wider text-[#8ca1aa] uppercase block mb-1.5 font-bold">
            Quick Injections:
          </span>
          <div className="flex flex-col gap-1.5">
            {quickInterjections.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInterjectionText(q)}
                className="text-left text-xs font-sans text-[#506575] hover:text-[#1a3a52] hover:bg-[#eee3d2]/60 p-2 rounded-xl transition border border-transparent hover:border-[#ded0bc]"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              rows={3}
              value={interjectionText}
              onChange={(e) => {
                setInterjectionText(e.target.value);
                latestTextRef.current = e.target.value;
                if (autoSubmitTimerRef.current) clearAutoSubmitTimer();
              }}
              onKeyDown={handleKeyDown}
              placeholder="State your clarification or challenge directly... (Press Enter to send)"
              className="w-full bg-[#eee3d2]/50 border border-[#ded0bc] rounded-2xl p-3.5 pr-12 text-xs font-sans text-[#1a3a52] placeholder-[#8ca1aa] focus:outline-none focus:border-[#305873] resize-none"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
              {isRecording && (
                <span className="text-[10px] font-mono text-[#b4654d] bg-[#f6eddf] px-1.5 py-0.5 rounded-md border border-[#ded0bc] animate-pulse">
                  {silencePending ? 'Sending...' : 'Listening'}
                </span>
              )}
              <button
                type="button"
                onClick={handleToggleVoice}
                title={isRecording ? 'Stop and Submit' : 'Voice Dictate'}
                className="text-[#506575] hover:text-[#1a3a52] p-1"
              >
                {isRecording ? (
                  <MicOff size={15} className="text-[#b4654d] animate-pulse" />
                ) : (
                  <Mic size={15} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-[#8ca1aa] font-mono">
              ↵ Enter to send • Shift+Enter for new line
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleModalClose}
                disabled={isSubmitting}
                className="header-pill-nav px-4 py-2 text-xs font-semibold text-[#506575]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!interjectionText.trim() || isSubmitting}
                className="odyssey-btn flex items-center gap-1.5"
              >
                <Send size={13} className="text-[#b4654d]" />
                <span>{isSubmitting ? 'Submitting...' : 'Interject'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

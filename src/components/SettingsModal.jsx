import React, { useState, useEffect } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { Settings, Key, Volume2, ShieldCheck, Cpu, X, Check, Server } from 'lucide-react';
import { getHealthStatus, updateSettings } from '../services/api.js';

export default function SettingsModal({ isOpen = false, onClose }) {
  const [geminiKey, setGeminiKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [health, setHealth] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  const loadHealth = async () => {
    try {
      const data = await getHealthStatus();
      setHealth(data);
    } catch (err) {
      console.error('Failed to load health status', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSettings({
        geminiApiKey: geminiKey || undefined,
        elevenLabsApiKey: elevenLabsKey || undefined,
      });
      setSaveStatus('Divine keys updated successfully!');
      await loadHealth();
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (err) {
      setSaveStatus(`Failed to update keys: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fadeIn">
      <div className="torn-panel rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative border-2 border-[#EE8A2E]">
        <GreekMeander height={14} color="#EE8A2E" opacity={0.7} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EE8A2E]/20 pb-3 mb-4">
            <div className="flex items-center gap-2 text-[#EE8A2E]">
              <Settings size={20} />
              <h3 className="font-heading text-xl font-bold tracking-wider">
                Sanctum Configuration
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#DDD3C8] hover:text-[#EE8A2E] hover:bg-[#12233F] transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* System Health Overview */}
          <div className="mb-5 p-3.5 rounded-xl bg-[#12233F]/80 border border-[#EE8A2E]/30 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-[#EE8A2E] tracking-wider uppercase flex items-center gap-1.5">
                <Server size={14} /> Council Engine Status
              </span>
              <span className="flex items-center gap-1.5 text-[#C1DDD0]">
                <span className="w-2 h-2 rounded-full bg-[#C1DDD0] animate-pulse" />
                Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#DDD3C8] font-serif">
              <div>
                <span>Gemini API: </span>
                <span className={health?.gemini?.configured ? 'text-[#C1DDD0] font-bold' : 'text-[#FFA959]'}>
                  {health?.gemini?.configured ? 'Configured' : 'Fallback / Heuristic'}
                </span>
              </div>
              <div>
                <span>Model: </span>
                <span className="text-[#FDF4CC] font-mono">{health?.gemini?.model || 'gemini-2.5-flash'}</span>
              </div>
              <div>
                <span>ElevenLabs TTS: </span>
                <span className={health?.elevenlabs?.configured ? 'text-[#C1DDD0] font-bold' : 'text-[#FFA959]'}>
                  {health?.elevenlabs?.configured ? 'Configured' : 'Web Speech API'}
                </span>
              </div>
              <div>
                <span>Audio Cache: </span>
                <span className="text-[#FDF4CC]">{health?.cache?.cachedAudioFiles || 0} files</span>
              </div>
            </div>
          </div>

          {/* Key Input Form */}
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            {/* Gemini API Key */}
            <div>
              <label className="text-xs font-serif font-bold text-[#FDF4CC] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Key size={14} className="text-[#EE8A2E]" />
                Gemini API Key (Optional Override)
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder={health?.gemini?.configured ? '•••••••••••••••• (configured on server)' : 'AIzaSy...'}
                className="w-full p-2.5 rounded-lg bg-[#12233F] border border-[#EE8A2E]/40 focus:border-[#EE8A2E] focus:outline-none text-xs text-[#FDF4CC] font-mono"
              />
              <p className="text-[11px] font-body text-[#DDD3C8]/60 mt-1">
                Used for Flash structured debate schema. If empty, the server's .env key or fail-proof demo model is used.
              </p>
            </div>

            {/* ElevenLabs API Key */}
            <div>
              <label className="text-xs font-serif font-bold text-[#FDF4CC] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Volume2 size={14} className="text-[#EE8A2E]" />
                ElevenLabs API Key (Optional Override)
              </label>
              <input
                type="password"
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder={health?.elevenlabs?.configured ? '•••••••••••••••• (configured on server)' : 'xi-api-key...'}
                className="w-full p-2.5 rounded-lg bg-[#12233F] border border-[#EE8A2E]/40 focus:border-[#EE8A2E] focus:outline-none text-xs text-[#FDF4CC] font-mono"
              />
              <p className="text-[11px] font-body text-[#DDD3C8]/60 mt-1">
                Low-latency character voices for Athena, Poseidon, Hermes, Odysseus, Oracle.
              </p>
            </div>

            {saveStatus && (
              <div className="p-2 rounded bg-[#1F5C66]/50 border border-[#C1DDD0] text-xs font-serif text-[#C1DDD0] text-center">
                {saveStatus}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#1B1B16] text-[#DDD3C8] hover:text-[#FDF4CC] text-xs font-serif uppercase tracking-wider border border-[#EE8A2E]/30 transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-[#EE8A2E] hover:bg-[#FFA959] text-[#12233F] text-xs font-heading font-black tracking-wider uppercase border border-[#EE8A2E] transition shadow-md flex items-center gap-2"
              >
                <Check size={14} />
                {isLoading ? 'Saving...' : 'Apply Keys'}
              </button>
            </div>
          </form>
        </div>

        <GreekMeander height={10} color="#EE8A2E" opacity={0.5} />
      </div>
    </div>
  );
}

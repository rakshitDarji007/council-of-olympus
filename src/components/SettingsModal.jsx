import React, { useState, useEffect } from 'react';
import GreekMeander from './GreekMeander.jsx';
import { Settings, Key, Volume2, X, Check, Server } from 'lucide-react';
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
      setSaveStatus('Engine configuration updated.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fade-in">
      <div className="editorial-card rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-7">
        <GreekMeander opacity={0.2} className="mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
          <div className="flex items-center gap-2 text-zinc-100">
            <Settings size={16} className="text-[#D4A373]" />
            <h3 className="font-heading text-lg font-normal">
              Engine Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* System Diagnostics */}
        {health && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#0E0F13] border border-white/[0.06] flex flex-col gap-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Google Gemini API:</span>
              <span className={health.gemini?.configured ? 'text-emerald-400' : 'text-amber-400'}>
                {health.gemini?.configured ? `Connected (${health.gemini?.model})` : 'Offline / Fallback'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">ElevenLabs TTS:</span>
              <span className={health.elevenlabs?.configured ? 'text-emerald-400' : 'text-zinc-500'}>
                {health.elevenlabs?.configured ? 'Configured' : 'Client Speech Synthesis'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Disk Cache Audio:</span>
              <span className="text-zinc-300">{health.cache?.cachedAudioFiles || 0} clips</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Gemini Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <Key size={12} className="text-[#D4A373]" />
              <span>Google Gemini API Key</span>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Paste new GEMINI_API_KEY to override..."
              className="w-full p-3 rounded-lg bg-[#0E0F13] border border-white/[0.08] focus:border-[#D4A373]/50 text-zinc-100 text-xs font-mono focus:outline-none placeholder-zinc-600"
            />
          </div>

          {/* ElevenLabs Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <Volume2 size={12} className="text-[#D4A373]" />
              <span>ElevenLabs API Key (Optional)</span>
            </label>
            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="Paste ELEVENLABS_API_KEY..."
              className="w-full p-3 rounded-lg bg-[#0E0F13] border border-white/[0.08] focus:border-[#D4A373]/50 text-zinc-100 text-xs font-mono focus:outline-none placeholder-zinc-600"
            />
          </div>

          {saveStatus && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check size={14} />
              <span>{saveStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-sans text-zinc-400 hover:text-white transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-sans font-semibold tracking-wider uppercase transition shadow disabled:opacity-40"
            >
              {isLoading ? 'Saving...' : 'Apply Keys'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

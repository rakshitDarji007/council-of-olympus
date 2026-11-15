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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none animate-fade-in">
      <div className="editorial-card rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-7">
        <GreekMeander opacity={0.25} className="mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2 text-slate-100">
            <Settings size={18} className="text-[#D97746]" />
            <h3 className="font-heading text-lg font-bold">
              Engine Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Telemetry Status */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-900/90 border border-white/5 text-xs font-sans">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Server size={14} className="text-[#D97746]" /> Council Backend Status
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-400">
            <div>
              <span>Gemini: </span>
              <span className={health?.gemini?.configured ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                {health?.gemini?.configured ? 'Active' : 'Fallback / Heuristic'}
              </span>
            </div>
            <div>
              <span>Model: </span>
              <span className="text-slate-200 font-mono">{health?.gemini?.model || 'gemini-2.5-flash'}</span>
            </div>
            <div>
              <span>ElevenLabs: </span>
              <span className={health?.elevenlabs?.configured ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                {health?.elevenlabs?.configured ? 'Active' : 'Web Speech API'}
              </span>
            </div>
            <div>
              <span>Cache: </span>
              <span className="text-slate-200">{health?.cache?.cachedAudioFiles || 0} audio files</span>
            </div>
          </div>
        </div>

        {/* Key Input Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4 font-sans">
          <div>
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Key size={13} className="text-[#D97746]" />
              Gemini API Key (Optional Override)
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder={health?.gemini?.configured ? '•••••••••••••••• (configured on server)' : 'AIzaSy...'}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-[#D97746]/70 focus:outline-none text-xs text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Volume2 size={13} className="text-[#D97746]" />
              ElevenLabs API Key (Optional Override)
            </label>
            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder={health?.elevenlabs?.configured ? '•••••••••••••••• (configured on server)' : 'xi-api-key...'}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-[#D97746]/70 focus:outline-none text-xs text-slate-100 font-mono"
            />
          </div>

          {saveStatus && (
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 text-center font-sans">
              {saveStatus}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-sans transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-[#D97746] hover:bg-[#E89162] text-[#0A0F1D] text-xs font-sans font-bold uppercase tracking-wide transition shadow flex items-center gap-1.5"
            >
              <Check size={14} />
              {isLoading ? 'Saving...' : 'Apply Keys'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

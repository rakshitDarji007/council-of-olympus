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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3a52]/40 backdrop-blur-md select-none animate-fade-in">
      <div className="odyssey-card rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-8">
        <GreekMeander opacity={0.5} className="mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ded0bc] pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#1a3a52]">
            <Settings size={16} className="text-[#b4654d]" />
            <h3 className="font-heading text-lg font-bold">
              Engine Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#506575] hover:text-[#1a3a52] hover:bg-[#eee3d2] transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Server & API Status */}
        <div className="mb-6 p-4 rounded-2xl bg-[#eee3d2]/60 border border-[#ded0bc]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#b4654d] mb-2 uppercase">
            <Server size={14} />
            <span>Active Diagnostics</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div>
              <span className="text-[#8ca1aa] block">Council Core:</span>
              <span className="text-[#1a3a52] font-semibold">
                {health?.geminiConfigured ? 'Live (Gemini 2.5 Flash)' : 'Mock Fallback Mode'}
              </span>
            </div>
            <div>
              <span className="text-[#8ca1aa] block">Voice Synthesizer:</span>
              <span className="text-[#1a3a52] font-semibold">
                {health?.elevenLabsConfigured ? 'ElevenLabs Active' : 'Web Speech API'}
              </span>
            </div>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#506575] uppercase block mb-1.5 flex items-center gap-1.5 font-bold">
              <Key size={13} className="text-[#b4654d]" />
              <span>Gemini API Key</span>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Paste AI Studio Key..."
              className="w-full bg-[#eee3d2]/50 border border-[#ded0bc] rounded-xl px-3.5 py-2.5 text-xs text-[#1a3a52] placeholder-[#8ca1aa] focus:outline-none focus:border-[#305873]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#506575] uppercase block mb-1.5 flex items-center gap-1.5 font-bold">
              <Volume2 size={13} className="text-[#b4654d]" />
              <span>ElevenLabs API Key</span>
            </label>
            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="Paste ElevenLabs Key..."
              className="w-full bg-[#eee3d2]/50 border border-[#ded0bc] rounded-xl px-3.5 py-2.5 text-xs text-[#1a3a52] placeholder-[#8ca1aa] focus:outline-none focus:border-[#305873]"
            />
          </div>

          {saveStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-sans text-emerald-800 flex items-center gap-2">
              <Check size={14} className="text-emerald-700" />
              <span>{saveStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ded0bc]">
            <button
              type="button"
              onClick={onClose}
              className="header-pill-nav px-4 py-2 text-xs font-semibold text-[#506575]"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="odyssey-btn flex items-center gap-1.5"
            >
              <span>{isLoading ? 'Updating...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Terminal, X, RefreshCw, ChevronDown, ChevronRight, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { getLogs } from '../services/api.js';

export default function DebugConsole({ isOpen = false, onClose }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [expandedIdx, setExpandedIdx] = useState(null);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data.logs || []);
    } catch (e) {
      console.error('Failed to fetch logs', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.level === filter;
  });

  const levelBadges = {
    SUCCESS: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', icon: CheckCircle },
    INFO: { bg: 'bg-slate-850', text: 'text-slate-300', icon: Info },
    WARN: { bg: 'bg-amber-950/60', text: 'text-amber-300', icon: AlertTriangle },
    ERROR: { bg: 'bg-rose-950/60', text: 'text-rose-300', icon: AlertCircle },
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0A0F1D]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col select-none animate-slide-up">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-100">
          <Terminal size={17} className="text-[#D97746]" />
          <h3 className="font-heading text-base font-bold">
            Telemetry & Server Stream
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchLogs}
            title="Refresh logs"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2.5 bg-slate-900/40 border-b border-white/5 text-[11px] font-sans">
        {['ALL', 'SUCCESS', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              filter === lvl
                ? 'bg-[#D97746] text-[#0A0F1D] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {lvl}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-slate-500 font-mono">
          {filteredLogs.length} events
        </span>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic font-sans">
            No telemetry recorded yet...
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const badge = levelBadges[log.level] || levelBadges.INFO;
            const Icon = badge.icon;
            const isExpanded = expandedIdx === idx;

            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition"
              >
                <div
                  className="flex items-start justify-between gap-2 cursor-pointer"
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${badge.bg} ${badge.text}`}
                    >
                      <Icon size={10} />
                      {log.level}
                    </span>
                    <span className="text-[#D97746] font-semibold">
                      [{log.category}]
                    </span>
                    <span className="text-slate-200 break-all font-sans">
                      {log.message}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center text-slate-500 text-[10px]">
                    <span className="mr-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.details && (
                      isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />
                    )}
                  </div>
                </div>

                {/* Details */}
                {isExpanded && log.details && (
                  <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {log.details}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-2.5 bg-slate-900 border-t border-white/10 text-[10px] text-slate-400 text-center font-sans">
        Real-time server & model event telemetry.
      </div>
    </div>
  );
}

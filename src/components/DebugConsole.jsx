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
    SUCCESS: { text: 'text-emerald-400', icon: CheckCircle },
    INFO: { text: 'text-zinc-400', icon: Info },
    WARN: { text: 'text-amber-400', icon: AlertTriangle },
    ERROR: { text: 'text-rose-400', icon: AlertCircle },
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0B0C0E]/95 backdrop-blur-xl border-l border-white/[0.08] shadow-2xl flex flex-col select-none animate-slide-up">
      {/* Header */}
      <div className="p-4 bg-zinc-950/80 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-100">
          <Terminal size={15} className="text-[#D4A373]" />
          <h3 className="font-mono text-xs font-semibold tracking-wider uppercase">
            Telemetry & Event Stream
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchLogs}
            title="Refresh logs"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-[#0E0F13] border-b border-white/[0.05] overflow-x-auto text-[11px] font-mono">
        {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-2.5 py-1 rounded-md transition ${
              filter === lvl
                ? 'bg-[#D4A373] text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-zinc-600">
            No telemetry events recorded yet.
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const badge = levelBadges[log.level] || levelBadges.INFO;
            const Icon = badge.icon;
            const isExpanded = expandedIdx === idx;

            return (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.04] hover:border-white/[0.1] transition flex flex-col gap-1 cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className={badge.text} />
                    <span className="font-bold text-zinc-300">
                      [{log.category}]
                    </span>
                    <span className={badge.text}>{log.level}</span>
                  </div>
                  <span className="text-zinc-600">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-zinc-200 text-xs break-words">
                  {log.message}
                </p>

                {log.details && (
                  <div className="mt-1 pt-1 border-t border-white/[0.04] text-[11px] text-zinc-400">
                    {isExpanded ? (
                      <pre className="whitespace-pre-wrap overflow-x-auto bg-black/40 p-2 rounded">
                        {log.details}
                      </pre>
                    ) : (
                      <span className="text-zinc-600 truncate block">
                        Details: {log.details.slice(0, 70)}...
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Terminal, X, RefreshCw, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
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
    INFO: { text: 'text-[#ded0bc]', icon: Info },
    WARN: { text: 'text-amber-400', icon: AlertTriangle },
    ERROR: { text: 'text-rose-400', icon: AlertCircle },
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#102f46]/95 backdrop-blur-xl border-l border-[#ded0bc]/20 shadow-2xl flex flex-col select-none animate-slide-up text-[#f6eddf]">
      {/* Header */}
      <div className="p-4 bg-[#041321]/60 border-b border-[#ded0bc]/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#f6eddf]">
          <Terminal size={15} className="text-[#e8c97a]" />
          <h3 className="font-mono text-xs font-bold tracking-wider uppercase">
            Telemetry & Event Stream
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchLogs}
            title="Refresh logs"
            className="p-1.5 rounded-full text-[#ded0bc] hover:text-[#f6eddf] hover:bg-[#ded0bc]/15 transition"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#ded0bc] hover:text-[#f6eddf] hover:bg-[#ded0bc]/15 transition"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-[#0d283e] border-b border-[#ded0bc]/15 overflow-x-auto text-[11px] font-mono">
        {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-3 py-1 rounded-full transition font-semibold ${
              filter === lvl
                ? 'bg-[#b4654d] text-[#f6eddf]'
                : 'text-[#ded0bc]/70 hover:text-[#f6eddf] hover:bg-[#ded0bc]/10'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-[#ded0bc]/60">
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
                className="p-3 rounded-xl bg-[#041321]/50 border border-[#ded0bc]/15 hover:border-[#ded0bc]/35 transition flex flex-col gap-1 cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className={badge.text} />
                    <span className="font-bold text-[#e8c97a]">
                      [{log.category}]
                    </span>
                    <span className={badge.text}>{log.level}</span>
                  </div>
                  <span className="text-[#ded0bc]/50 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-[#f6eddf] text-xs break-words">
                  {log.message}
                </p>

                {log.details && (
                  <div className="mt-1 pt-1 border-t border-[#ded0bc]/15 text-[11px] text-[#ded0bc]/70">
                    {isExpanded ? (
                      <pre className="whitespace-pre-wrap overflow-x-auto bg-[#041321] p-2 rounded text-[#ded0bc]">
                        {log.details}
                      </pre>
                    ) : (
                      <span className="text-[#ded0bc]/60 truncate block">
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

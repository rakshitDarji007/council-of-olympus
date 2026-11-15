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
    SUCCESS: { bg: 'bg-[#1F5C66]', text: 'text-[#C1DDD0]', icon: CheckCircle },
    INFO: { bg: 'bg-[#12233F]', text: 'text-[#DDD3C8]', icon: Info },
    WARN: { bg: 'bg-[#C86B18]/40', text: 'text-[#FFA959]', icon: AlertTriangle },
    ERROR: { bg: 'bg-[#9B3B33]', text: 'text-[#FDF4CC]', icon: AlertCircle },
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#1B1B16] border-l-2 border-[#EE8A2E] shadow-2xl flex flex-col select-none animate-slideLeft">
      {/* Header */}
      <div className="p-4 bg-[#12233F] border-b border-[#EE8A2E]/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#EE8A2E]">
          <Terminal size={18} />
          <h3 className="font-heading text-lg font-bold tracking-wider">
            Olympian Telemetry & Logs
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            title="Refresh logs"
            className="p-1 rounded text-[#DDD3C8] hover:text-[#EE8A2E] transition"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#DDD3C8] hover:text-[#EE8A2E] transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-[#1B1B16] border-b border-[#EE8A2E]/20 text-[11px] font-serif uppercase">
        {['ALL', 'SUCCESS', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-2.5 py-1 rounded transition-all font-bold ${
              filter === lvl
                ? 'bg-[#EE8A2E] text-[#12233F]'
                : 'bg-[#12233F]/70 text-[#DDD3C8] hover:text-[#EE8A2E]'
            }`}
          >
            {lvl}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-[#DDD3C8]/60 font-mono">
          {filteredLogs.length} events
        </span>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-[#DDD3C8]/50 italic">
            No divine events recorded yet...
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const badge = levelBadges[log.level] || levelBadges.INFO;
            const Icon = badge.icon;
            const isExpanded = expandedIdx === idx;

            return (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#12233F]/60 border border-[#EE8A2E]/15 hover:border-[#EE8A2E]/40 transition"
              >
                <div
                  className="flex items-start justify-between gap-2 cursor-pointer"
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${badge.bg} ${badge.text}`}
                    >
                      <Icon size={10} />
                      {log.level}
                    </span>
                    <span className="text-[#EE8A2E] font-semibold">
                      [{log.category}]
                    </span>
                    <span className="text-[#FDF4CC] break-all">
                      {log.message}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center text-[#DDD3C8]/50">
                    <span className="text-[10px] mr-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.details && (
                      isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                  </div>
                </div>

                {/* Expandable Details */}
                {isExpanded && log.details && (
                  <div className="mt-2 pt-2 border-t border-[#EE8A2E]/20 text-[11px] text-[#C1DDD0] bg-[#1B1B16] p-2 rounded overflow-x-auto whitespace-pre-wrap">
                    {log.details}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-[#12233F] border-t border-[#EE8A2E]/30 text-[10px] text-[#DDD3C8]/70 text-center font-serif">
        Live telemetry stream for HackUTA 2026 judges & developers.
      </div>
    </div>
  );
}

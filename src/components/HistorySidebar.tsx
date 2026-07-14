import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Copy, Check, Download, History, List } from 'lucide-react';
import { GeneratedRecord } from '../types';

interface HistorySidebarProps {
  history: GeneratedRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export default function HistorySidebar({
  history,
  onDeleteRecord,
  onClearAll,
}: HistorySidebarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, values: number[]) => {
    navigator.clipboard.writeText(values.join(', '));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCSV = () => {
    if (history.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Mode', 'Values', 'Context'];
    const rows = history.map((record) => [
      record.id,
      record.timestamp,
      record.mode,
      `"${record.values.join(', ')}"`,
      record.label || (record.min !== undefined ? `${record.min}-${record.max}` : ''),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `random_numbers_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 h-full" id="history-sidebar-container">
      {/* Header and Quick action */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-800" />
          <h3 className="font-semibold text-slate-900 tracking-tight">Recent Runs</h3>
          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full font-mono">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
              title="Download CSV"
              id="download-csv-btn"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClearAll}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Clear all history"
              id="clear-all-history-btn"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* History Ledger List */}
      <div className="flex-1 overflow-y-auto max-h-[420px] pr-1.5 scrollbar-thin">
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center text-slate-400"
              id="empty-history-placeholder"
            >
              <List className="h-8 w-8 stroke-[1.5] text-slate-300 mb-2" />
              <p className="text-sm font-medium">No numbers generated yet</p>
              <p className="text-xs text-slate-500 mt-0.5">Your session logs will appear here</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="bg-white border border-slate-100 hover:border-slate-200 p-3.5 rounded-xl transition-all shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      {/* Meta information */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          {record.timestamp}
                        </span>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                          {record.mode}
                        </span>
                      </div>

                      {/* Values list */}
                      <div className="font-mono font-bold text-slate-900 text-base break-words mt-1">
                        {record.values.join(', ')}
                      </div>

                      {/* Additional description */}
                      {record.label ? (
                        <span className="text-xs text-slate-500 mt-1 font-medium italic">
                          {record.label}
                        </span>
                      ) : (
                        record.min !== undefined && (
                          <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            Range: {record.min} - {record.max}
                          </span>
                        )
                      )}
                    </div>

                    {/* Quick controls on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      <button
                        onClick={() => handleCopy(record.id, record.values)}
                        className="p-1.5 hover:bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-all shadow-2xs"
                        title="Copy values"
                      >
                        {copiedId === record.id ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-1.5 hover:bg-red-50 border border-slate-100 text-slate-500 hover:text-red-600 rounded-lg transition-all shadow-2xs"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

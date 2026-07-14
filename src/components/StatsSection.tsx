import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Hash, ArrowDown, ArrowUp } from 'lucide-react';
import { GeneratedRecord } from '../types';

interface StatsSectionProps {
  history: GeneratedRecord[];
}

export default function StatsSection({ history }: StatsSectionProps) {
  // Extract all numbers generated in the session
  const allNumbers: number[] = history.reduce((acc, curr) => {
    // Only count standard numbers (ignore coins if we don't want heads/tails to affect statistics,
    // actually let's calculate for all numeric values but maybe exclude non-standard label values,
    // let's just calculate stats for all generated records to keep it general).
    return [...acc, ...curr.values];
  }, [] as number[]);

  const totalCount = allNumbers.length;
  const minVal = totalCount > 0 ? Math.min(...allNumbers) : null;
  const maxVal = totalCount > 0 ? Math.max(...allNumbers) : null;
  const average =
    totalCount > 0
      ? (allNumbers.reduce((a, b) => a + b, 0) / totalCount).toFixed(2)
      : null;

  return (
    <div className="flex flex-col gap-4 bg-white border border-slate-100 p-5 rounded-2xl" id="stats-section">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <BarChart3 className="h-5 w-5 text-slate-800" />
        <h3 className="font-semibold text-slate-900 tracking-tight">Session Stats</h3>
      </div>

      {totalCount === 0 ? (
        <p className="text-xs font-medium text-slate-400 text-center py-4">
          Stat calculations will populate once you generate values.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid">
          {/* Card: Total */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Generated</span>
              <Hash className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
              {totalCount}
            </div>
          </motion.div>

          {/* Card: Lowest */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Min Number</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
              {minVal !== null ? minVal : '—'}
            </div>
          </motion.div>

          {/* Card: Highest */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Max Number</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
              {maxVal !== null ? maxVal : '—'}
            </div>
          </motion.div>

          {/* Card: Average */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mean/Average</span>
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
              {average !== null ? average : '—'}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { generateRandomInt, playTickSound, playSuccessSound } from '../utils';
import { GeneratedRecord } from '../types';

interface SingleGeneratorProps {
  onGenerate: (record: GeneratedRecord) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export default function SingleGenerator({
  onGenerate,
  soundEnabled,
  setSoundEnabled,
}: SingleGeneratorProps) {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (min > max) {
      setError('Minimum value cannot be greater than maximum value.');
      return;
    }
    setError(null);
    setIsGenerating(true);

    let duration = 800; // milliseconds
    let intervalTime = 40; // initial interval
    let elapsed = 0;

    const tick = () => {
      const tempVal = generateRandomInt(min, max);
      setCurrentValue(tempVal);
      if (soundEnabled) {
        playTickSound(600 + (tempVal % 400), 0.05);
      }

      elapsed += intervalTime;
      // Exponentially slow down the ticks as we approach the end
      intervalTime = 40 + Math.pow(elapsed / duration, 3) * 150;

      if (elapsed < duration) {
        setTimeout(tick, intervalTime);
      } else {
        const finalVal = generateRandomInt(min, max);
        setCurrentValue(finalVal);
        setIsGenerating(false);
        if (soundEnabled) {
          playSuccessSound();
        }

        const newRecord: GeneratedRecord = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          mode: 'single',
          values: [finalVal],
          min,
          max,
        };
        onGenerate(newRecord);
      }
    };

    setTimeout(tick, intervalTime);
  };

  return (
    <div className="flex flex-col gap-6" id="single-generator-container">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Single Number</h2>
          <p className="text-sm text-slate-500 mt-1">Generate a single random integer within your defined bounds.</p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled
              ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              : 'bg-transparent text-slate-400 border-slate-200 hover:bg-slate-50'
          }`}
          title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          id="sound-toggle-btn"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {/* Generator Display */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[220px]">
        <AnimatePresence mode="wait">
          {currentValue === null ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center text-slate-400"
            >
              <Shuffle className="h-12 w-12 mx-auto mb-3 stroke-[1.5] text-slate-300" />
              <p className="text-sm font-medium">Ready to roll</p>
            </motion.div>
          ) : (
            <motion.div
              key={currentValue}
              initial={{ opacity: 0, scale: 0.8, y: isGenerating ? 10 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: isGenerating ? -10 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <div className="text-7xl font-bold tracking-tighter text-slate-900 font-mono">
                {currentValue}
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2 tracking-wide uppercase font-mono">
                Range: {min} - {max}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Range inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="min-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
            Min Value
          </label>
          <input
            id="min-input"
            type="number"
            value={min}
            onChange={(e) => {
              setMin(Number(e.target.value));
              setError(null);
            }}
            disabled={isGenerating}
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all disabled:opacity-50 text-sm font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="max-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
            Max Value
          </label>
          <input
            id="max-input"
            type="number"
            value={max}
            onChange={(e) => {
              setMax(Number(e.target.value));
              setError(null);
            }}
            disabled={isGenerating}
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all disabled:opacity-50 text-sm font-mono"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5" id="range-error">
          {error}
        </p>
      )}

      {/* Roll trigger */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        id="single-generate-btn"
      >
        <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Generating...' : 'Generate Number'}</span>
      </button>
    </div>
  );
}

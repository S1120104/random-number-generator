import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, SortAsc, SortDesc, Info, Volume2, VolumeX } from 'lucide-react';
import { generateRandomSequence, generateRandomFloats, playTickSound, playSuccessSound } from '../utils';
import { GeneratedRecord } from '../types';

interface MultipleGeneratorProps {
  onGenerate: (record: GeneratedRecord) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

type SortType = 'none' | 'asc' | 'desc';
type NumberType = 'int' | 'float';

export default function MultipleGenerator({
  onGenerate,
  soundEnabled,
  setSoundEnabled,
}: MultipleGeneratorProps) {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(5);
  const [numberType, setNumberType] = useState<NumberType>('int');
  const [decimals, setDecimals] = useState<number>(2);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortType, setSortType] = useState<SortType>('none');
  const [separator, setSeparator] = useState<string>(', ');
  
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (min > max) {
      setError('Minimum value cannot be greater than maximum value.');
      return;
    }
    if (count <= 0) {
      setError('Count must be at least 1.');
      return;
    }
    if (count > 500) {
      setError('Maximum count is limited to 500 to maintain optimal performance.');
      return;
    }

    if (numberType === 'int' && !allowDuplicates) {
      const rangeSize = max - min + 1;
      if (count > rangeSize) {
        setError(`Cannot generate ${count} unique numbers in a range of size ${rangeSize}. Either enable duplicates or increase the range/decrease the count.`);
        return;
      }
    }

    setError(null);
    setIsGenerating(true);

    if (soundEnabled) {
      playTickSound(500, 0.1);
    }

    // Small delay to simulate computation/generation feeling
    setTimeout(() => {
      let finalValues: number[] = [];

      if (numberType === 'int') {
        finalValues = generateRandomSequence(min, max, count, allowDuplicates);
      } else {
        // floats are always unique-ish, but duplicates check isn't standard since floats are continuous
        finalValues = generateRandomFloats(min, max, count, decimals);
      }

      // Handle sorting
      if (sortType === 'asc') {
        finalValues.sort((a, b) => a - b);
      } else if (sortType === 'desc') {
        finalValues.sort((a, b) => b - a);
      }

      setResults(finalValues);
      setIsGenerating(false);
      setCopied(false);

      if (soundEnabled) {
        playSuccessSound();
      }

      const newRecord: GeneratedRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        mode: 'multiple',
        values: finalValues,
        min,
        max,
        allowDuplicates: numberType === 'int' ? allowDuplicates : undefined,
        sorted: sortType !== 'none',
      };
      onGenerate(newRecord);
    }, 400);
  };

  const getSeparatedText = () => {
    if (separator === 'newline') {
      return results.join('\n');
    }
    return results.join(separator);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSeparatedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6" id="multiple-generator-container">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Multiple Numbers</h2>
          <p className="text-sm text-slate-500 mt-1">Generate a set, sequence, or array of random values.</p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled
              ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              : 'bg-transparent text-slate-400 border-slate-200 hover:bg-slate-50'
          }`}
          title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          id="sound-toggle-multi-btn"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {/* Inputs block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="multi-min" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
            Min Value
          </label>
          <input
            id="multi-min"
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
          <label htmlFor="multi-max" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
            Max Value
          </label>
          <input
            id="multi-max"
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="multi-count" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
            Count (Quantity)
          </label>
          <input
            id="multi-count"
            type="number"
            min="1"
            value={count}
            onChange={(e) => {
              setCount(Number(e.target.value));
              setError(null);
            }}
            disabled={isGenerating}
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all disabled:opacity-50 text-sm font-mono"
          />
        </div>
      </div>

      {/* Advanced Settings Row */}
      <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-4.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number Type Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">Number Format</span>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setNumberType('int');
                  setError(null);
                }}
                disabled={isGenerating}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  numberType === 'int'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Integers
              </button>
              <button
                type="button"
                onClick={() => {
                  setNumberType('float');
                  setError(null);
                }}
                disabled={isGenerating}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  numberType === 'float'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Decimals
              </button>
            </div>
          </div>

          {/* Precision or Unique Toggles */}
          {numberType === 'float' ? (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <label htmlFor="float-decimals" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">Decimal Places</label>
              <select
                id="float-decimals"
                value={decimals}
                onChange={(e) => setDecimals(Number(e.target.value))}
                disabled={isGenerating}
                className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all text-sm font-mono"
              >
                <option value="1">1 (.0)</option>
                <option value="2">2 (.00)</option>
                <option value="3">3 (.000)</option>
                <option value="4">4 (.0000)</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-between h-full pt-4 md:pt-6">
              <span className="text-sm font-medium text-slate-700">Prevent Duplicates</span>
              <button
                type="button"
                onClick={() => {
                  setAllowDuplicates(!allowDuplicates);
                  setError(null);
                }}
                disabled={isGenerating}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${
                  !allowDuplicates ? 'bg-slate-900' : 'bg-slate-200'
                }`}
                id="prevent-duplicates-toggle"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !allowDuplicates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sorting Option */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">Sort Order</span>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSortType('none')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  sortType === 'none'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                None
              </button>
              <button
                type="button"
                onClick={() => setSortType('asc')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sortType === 'asc'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <SortAsc className="h-3.5 w-3.5" /> Asc
              </button>
              <button
                type="button"
                onClick={() => setSortType('desc')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sortType === 'desc'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <SortDesc className="h-3.5 w-3.5" /> Desc
              </button>
            </div>
          </div>

          {/* Separator settings */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="delimiter-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">Separated By</label>
            <select
              id="delimiter-select"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              disabled={isGenerating}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all text-sm"
            >
              <option value=", ">Comma ( , )</option>
              <option value=" ">Space (   )</option>
              <option value=" - ">Dash ( - )</option>
              <option value="newline">New Line (⏎)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5" id="multi-error">
          {error}
        </p>
      )}

      {/* Generate trigger */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        id="multi-generate-btn"
      >
        <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Generating Set...' : 'Generate Set'}</span>
      </button>

      {/* Results block */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100"
          id="multi-results-box"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Generated Output</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 py-1.5 px-2.5 rounded-lg transition-all shadow-sm"
              id="multi-copy-btn"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="max-h-[180px] overflow-y-auto bg-white p-4 rounded-xl border border-slate-100 flex flex-wrap gap-2 text-sm font-mono scrollbar-thin">
            {results.map((val, index) => (
              <motion.span
                key={`${val}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.02, 0.4) }}
                className="inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg px-3 py-1.5 font-semibold text-slate-800 transition-colors"
              >
                {val}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

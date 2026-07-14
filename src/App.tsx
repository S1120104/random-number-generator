import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, List, Coins, Shuffle } from 'lucide-react';
import SingleGenerator from './components/SingleGenerator';
import MultipleGenerator from './components/MultipleGenerator';
import DiceCoinGenerator from './components/DiceCoinGenerator';
import HistorySidebar from './components/HistorySidebar';
import StatsSection from './components/StatsSection';
import { GeneratedRecord, GeneratorMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<GeneratorMode>('single');
  const [history, setHistory] = useState<GeneratedRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rng_history_logs');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Could not load history from localStorage', e);
    }
  }, []);

  // Save to localStorage when history changes
  const updateHistory = (newHistory: GeneratedRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('rng_history_logs', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Could not save history to localStorage', e);
    }
  };

  const handleAddRecord = (record: GeneratedRecord) => {
    const updated = [record, ...history].slice(0, 100); // Limit to last 100 entries
    updateHistory(updated);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    updateHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire history?')) {
      updateHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Visual background accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-slate-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Upper Brand / Header section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6" id="app-header">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md">
              <Shuffle className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Random Number Generator
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Generate values, flips, or rolls using customizable ranges and distributions.
              </p>
            </div>
          </div>
          
          {/* Quick Info Badge */}
          <div className="self-start md:self-auto bg-white border border-slate-200/80 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-600">
              Offline-Ready Engine
            </span>
          </div>
        </header>

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Generator & Settings controls) - 8 span */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Elegant Mode/Tab Switcher */}
            <nav className="flex border-b border-slate-200/80 bg-white/65 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-xs" id="mode-navigation">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'single'
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id="tab-single"
              >
                <Hash className="h-4 w-4" />
                <span>Single Number</span>
              </button>

              <button
                onClick={() => setActiveTab('multiple')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'multiple'
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id="tab-multiple"
              >
                <List className="h-4 w-4" />
                <span>Multiple Numbers</span>
              </button>

              <button
                onClick={() => setActiveTab('dice-coin')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'dice-coin'
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id="tab-dice-coin"
              >
                <Coins className="h-4 w-4" />
                <span>Dice & Coin</span>
              </button>
            </nav>

            {/* Live Component Render Area */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === 'single' && (
                    <SingleGenerator
                      onGenerate={handleAddRecord}
                      soundEnabled={soundEnabled}
                      setSoundEnabled={setSoundEnabled}
                    />
                  )}
                  {activeTab === 'multiple' && (
                    <MultipleGenerator
                      onGenerate={handleAddRecord}
                      soundEnabled={soundEnabled}
                      setSoundEnabled={setSoundEnabled}
                    />
                  )}
                  {activeTab === 'dice-coin' && (
                    <DiceCoinGenerator
                      onGenerate={handleAddRecord}
                      soundEnabled={soundEnabled}
                      setSoundEnabled={setSoundEnabled}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Session Statistics section */}
            <StatsSection history={history} />
          </div>

          {/* Right Column (History sidebar Ledger) - 4 span */}
          <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm lg:sticky lg:top-6">
            <HistorySidebar
              history={history}
              onDeleteRecord={handleDeleteRecord}
              onClearAll={handleClearAll}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 py-6 bg-slate-50 text-center text-xs font-medium text-slate-400">
        <p>Random Number Generator • Crafted with minimalist precision</p>
      </footer>
    </div>
  );
}

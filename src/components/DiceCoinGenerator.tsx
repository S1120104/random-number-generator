import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { generateRandomInt, playTickSound, playSuccessSound } from '../utils';
import { GeneratedRecord } from '../types';

interface DiceCoinGeneratorProps {
  onGenerate: (record: GeneratedRecord) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

type ToyMode = 'coin' | 'dice';
type CoinFace = 'heads' | 'tails' | null;

export default function DiceCoinGenerator({
  onGenerate,
  soundEnabled,
  setSoundEnabled,
}: DiceCoinGeneratorProps) {
  const [toyMode, setToyMode] = useState<ToyMode>('coin');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  
  // Coin states
  const [numCoins, setNumCoins] = useState<number>(1);
  const [coinResults, setCoinResults] = useState<('heads' | 'tails')[]>([]);
  const [headsCount, setHeadsCount] = useState<number>(0);
  const [tailsCount, setTailsCount] = useState<number>(0);

  // Dice states
  const [diceSides, setDiceSides] = useState<number>(6); // 6, 8, 10, 12, 20
  const [numDice, setNumDice] = useState<number>(1);
  const [diceResults, setDiceResults] = useState<number[]>([]);

  const handleFlipCoin = () => {
    setIsRolling(true);
    setCoinResults([]);

    const ticks = 12;
    let currentTick = 0;

    const interval = setInterval(() => {
      // Simulate flipping sounds and visuals
      if (soundEnabled) {
        playTickSound(800 + currentTick * 40, 0.04);
      }
      currentTick++;

      if (currentTick >= ticks) {
        clearInterval(interval);
        
        const resultsList: ('heads' | 'tails')[] = Array.from({ length: numCoins }, () =>
          Math.random() < 0.5 ? 'heads' : 'tails'
        );

        let heads = 0;
        let tails = 0;
        const numericValues: number[] = resultsList.map((r) => {
          if (r === 'heads') {
            heads++;
            return 1; // 1 represents Heads
          } else {
            tails++;
            return 0; // 0 represents Tails
          }
        });

        setCoinResults(resultsList);
        setHeadsCount((prev) => prev + heads);
        setTailsCount((prev) => prev + tails);
        setIsRolling(false);

        if (soundEnabled) {
          playSuccessSound();
        }

        const newRecord: GeneratedRecord = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          mode: 'coin',
          values: numericValues,
          label: `Coin Flip (${resultsList.join(', ')})`,
        };
        onGenerate(newRecord);
      }
    }, 80);
  };

  const handleRollDice = () => {
    setIsRolling(true);
    setDiceResults([]);

    const ticks = 15;
    let currentTick = 0;

    const interval = setInterval(() => {
      // Fast fake ticks with visual randomized faces
      const tempDice = Array.from({ length: numDice }, () => generateRandomInt(1, diceSides));
      setDiceResults(tempDice);
      
      if (soundEnabled) {
        playTickSound(300 + (Math.random() * 200), 0.05);
      }
      currentTick++;

      if (currentTick >= ticks) {
        clearInterval(interval);

        const finalDice = Array.from({ length: numDice }, () => generateRandomInt(1, diceSides));
        setDiceResults(finalDice);
        setIsRolling(false);

        if (soundEnabled) {
          playSuccessSound();
        }

        const totalSum = finalDice.reduce((acc, curr) => acc + curr, 0);

        const newRecord: GeneratedRecord = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          mode: 'dice',
          values: finalDice,
          min: 1,
          max: diceSides,
          label: `Dice Roll (${numDice}d${diceSides}): Sum ${totalSum}`,
        };
        onGenerate(newRecord);
      }
    }, 60);
  };

  const renderDiceFace = (val: number) => {
    // Elegant dot layout for D6
    if (diceSides === 6) {
      const dotPositions: Record<number, number[]> = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8],
      };
      
      const dots = dotPositions[val] || [];
      return (
        <div className="grid grid-cols-3 gap-2 p-3 bg-white border-2 border-slate-900 rounded-xl w-16 h-16 shadow-md relative shrink-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {dots.includes(i) && (
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
              )}
            </div>
          ))}
        </div>
      );
    }

    // Hexagonal / Polyhedral display for non-D6 dice
    return (
      <div className="flex items-center justify-center bg-slate-900 text-white font-mono font-bold text-xl rounded-xl w-16 h-16 shadow-md border-2 border-slate-700 shrink-0 relative">
        <span className="z-10">{val}</span>
        <div className="absolute inset-2 border border-slate-600/50 rounded-lg pointer-events-none" />
        <span className="absolute bottom-1 right-1.5 text-[8px] font-semibold text-slate-500 uppercase">
          D{diceSides}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6" id="dice-coin-container">
      {/* Header with Selector and Sound */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setToyMode('coin')}
            className={`py-1.5 px-3.5 text-xs font-semibold rounded-lg transition-all ${
              toyMode === 'coin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            id="mode-coin-tab"
          >
            Coin Flip
          </button>
          <button
            type="button"
            onClick={() => setToyMode('dice')}
            className={`py-1.5 px-3.5 text-xs font-semibold rounded-lg transition-all ${
              toyMode === 'dice'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            id="mode-dice-tab"
          >
            Roll Dice
          </button>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled
              ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              : 'bg-transparent text-slate-400 border-slate-200 hover:bg-slate-50'
          }`}
          title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          id="sound-toggle-toy-btn"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {toyMode === 'coin' ? (
        <div className="flex flex-col gap-6" id="coin-flipper-section">
          {/* Flipper Visualizer */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[220px]">
            <AnimatePresence mode="wait">
              {coinResults.length === 0 ? (
                <motion.div
                  key="no-flips"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-400"
                >
                  <HelpCircle className="h-12 w-12 mx-auto mb-3 stroke-[1.5] text-slate-300 animate-pulse" />
                  <p className="text-sm font-medium">Flip the coins to see results</p>
                </motion.div>
              ) : (
                <div className="flex flex-wrap justify-center gap-6">
                  {coinResults.map((coin, index) => (
                    <motion.div
                      key={`${coin}-${index}`}
                      initial={{ rotateY: 0, scale: 0.5, opacity: 0 }}
                      animate={{
                        rotateY: isRolling ? 1440 : 0,
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 90 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-18 h-18 rounded-full border-4 flex items-center justify-center font-bold text-sm tracking-wide uppercase shadow-md select-none ${
                          coin === 'heads'
                            ? 'bg-amber-100 border-amber-400 text-amber-800'
                            : 'bg-slate-200 border-slate-400 text-slate-800'
                        }`}
                      >
                        {coin}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Run tally stats */}
            {(headsCount > 0 || tailsCount > 0) && (
              <div className="mt-6 flex gap-4 text-xs font-mono font-bold text-slate-500 border-t border-slate-200/50 pt-4 w-full justify-center">
                <span>Heads: {headsCount}</span>
                <span>•</span>
                <span>Tails: {tailsCount}</span>
                <span>•</span>
                <button
                  onClick={() => {
                    setHeadsCount(0);
                    setTailsCount(0);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Reset Tally
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
              Number of Coins
            </span>
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-xl">
              {[1, 2, 3, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumCoins(num)}
                  disabled={isRolling}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    numCoins === num
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {num} {num === 1 ? 'Coin' : 'Coins'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFlipCoin}
            disabled={isRolling}
            className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            id="flip-coin-btn"
          >
            <Sparkles className={`h-4 w-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Flipping...' : 'Flip Coins'}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6" id="dice-roller-section">
          {/* Roller Visualizer */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[220px]">
            <AnimatePresence mode="wait">
              {diceResults.length === 0 ? (
                <motion.div
                  key="no-rolls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-400"
                >
                  <HelpCircle className="h-12 w-12 mx-auto mb-3 stroke-[1.5] text-slate-300" />
                  <p className="text-sm font-medium">Roll the dice to see results</p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <div className="flex flex-wrap justify-center gap-4">
                    {diceResults.map((die, index) => (
                      <motion.div
                        key={index}
                        initial={{ rotate: 0, scale: 0.6 }}
                        animate={{
                          rotate: isRolling ? [0, 90, 180, 270, 360] : 0,
                          scale: 1,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {renderDiceFace(die)}
                      </motion.div>
                    ))}
                  </div>

                  {!isRolling && diceResults.length > 1 && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-slate-800 font-semibold text-sm font-mono bg-slate-100/80 px-4 py-1.5 rounded-full border border-slate-200"
                    >
                      Total Sum: {diceResults.reduce((acc, c) => acc + c, 0)}
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Dice Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dice-sides-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
                Dice Type
              </label>
              <select
                id="dice-sides-select"
                value={diceSides}
                onChange={(e) => setDiceSides(Number(e.target.value))}
                disabled={isRolling}
                className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all text-sm font-mono"
              >
                <option value="6">D6 (6-sided)</option>
                <option value="8">D8 (8-sided)</option>
                <option value="10">D10 (10-sided)</option>
                <option value="12">D12 (12-sided)</option>
                <option value="20">D20 (20-sided)</option>
                <option value="100">D100 (100-sided)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dice-qty-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
                Quantity
              </label>
              <select
                id="dice-qty-select"
                value={numDice}
                onChange={(e) => setNumDice(Number(e.target.value))}
                disabled={isRolling}
                className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all text-sm font-mono"
              >
                <option value="1">1 Die</option>
                <option value="2">2 Dice</option>
                <option value="3">3 Dice</option>
                <option value="4">4 Dice</option>
                <option value="5">5 Dice</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRollDice}
            disabled={isRolling}
            className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            id="roll-dice-btn"
          >
            <Sparkles className={`h-4 w-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

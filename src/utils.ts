export function playTickSound(frequency: number = 600, duration: number = 0.08) {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors (e.g. user hasn't interacted yet)
  }
}

export function playSuccessSound() {
  playTickSound(523.25, 0.12); // C5
  setTimeout(() => {
    playTickSound(659.25, 0.15); // E5
  }, 80);
}

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomFloats(min: number, max: number, count: number, decimals: number = 2): number[] {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    const val = Math.random() * (max - min) + min;
    result.push(parseFloat(val.toFixed(decimals)));
  }
  return result;
}

export function generateRandomSequence(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean
): number[] {
  if (!allowDuplicates) {
    const rangeSize = max - min + 1;
    const size = Math.min(count, rangeSize);
    
    // Fisher-Yates shuffle or pool selection
    const pool = Array.from({ length: rangeSize }, (_, i) => min + i);
    const result: number[] = [];
    
    for (let i = 0; i < size; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return result;
  } else {
    return Array.from({ length: count }, () => generateRandomInt(min, max));
  }
}

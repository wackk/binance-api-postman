let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext
      audioCtx = new Ctor()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {})
    return audioCtx
  } catch {
    return null
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  peakGain = 0.18,
  type: OscillatorType = 'sine',
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

/**
 * Evokes the Super Mario Bros. "power-up" jingle (the rapid rising sparkle
 * that plays when Mario grabs a mushroom and grows) — two quick ascending
 * square-wave runs, the second pitched a third above the first.
 */
export function playCelebrationSound(_kind: 'pr' | 'achievement') {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  const step = 0.05
  const run = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]
  run.forEach((freq, i) => playTone(ctx, freq, now + i * step, step * 2.4, 0.14, 'square'))
  const run2 = run.map((f) => f * 1.2599)
  run2.forEach((freq, i) => playTone(ctx, freq, now + run.length * step + i * step, step * 2.6, 0.14, 'square'))
}

export function playTimerAlarm() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  for (let i = 0; i < 3; i++) {
    playTone(ctx, 880, now + i * 0.3, 0.18, 0.16, 'square')
  }
}

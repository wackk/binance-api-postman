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

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, peakGain = 0.18) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

export function playCelebrationSound(kind: 'pr' | 'achievement') {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  if (kind === 'pr') {
    playTone(ctx, 1046.5, now, 0.18, 0.15)
    playTone(ctx, 1318.5, now + 0.08, 0.22, 0.15)
  } else {
    playTone(ctx, 523.25, now, 0.16, 0.16)
    playTone(ctx, 659.25, now + 0.1, 0.16, 0.16)
    playTone(ctx, 783.99, now + 0.2, 0.16, 0.16)
    playTone(ctx, 1046.5, now + 0.3, 0.3, 0.18)
  }
}

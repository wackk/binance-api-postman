import { MARIO_MUSHROOM_SOUND, BOXING_BELL_SOUND } from '../assets/soundData'

function playClip(dataUri: string, volume = 0.7) {
  try {
    const audio = new Audio(dataUri)
    audio.volume = volume
    audio.play().catch(() => {})
  } catch {
    // ignore — sound is non-essential
  }
}

/** Plays on a PR medal or achievement unlock. */
export function playCelebrationSound(_kind: 'pr' | 'achievement') {
  playClip(MARIO_MUSHROOM_SOUND)
}

/** Plays when a standalone countdown timer reaches zero. */
export function playTimerAlarm() {
  playClip(BOXING_BELL_SOUND)
}

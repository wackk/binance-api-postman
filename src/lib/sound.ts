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

/** Speaks a short phrase (e.g. "30 seconds") during a mobility stretch countdown. */
export function speakAnnouncement(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.volume = 1
    window.speechSynthesis.speak(utterance)
  } catch {
    // ignore — voice announcements are non-essential
  }
}

import type { Equipment, MuscleGroup } from '../types'

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Chest: '#FF6B6B',
  Back: '#4D96FF',
  Shoulders: '#FFB300',
  Biceps: '#9B5DE5',
  Triceps: '#F15BB5',
  Forearms: '#00BBF9',
  Abs: '#00F5D4',
  Quadriceps: '#FB5607',
  Hamstrings: '#FF9F1C',
  Glutes: '#EF476F',
  Calves: '#118AB2',
  Cardio: '#EF233C',
  'Full Body': '#8338EC',
  Traps: '#3A86FF',
  Lats: '#2EC4B6',
  Neck: '#B5838D',
  Adductors: '#06D6A0',
  Abductors: '#FFD166',
}

export function muscleColor(m: MuscleGroup): string {
  return MUSCLE_COLORS[m] ?? '#0C7CFF'
}

const EQUIPMENT_ICONS: Record<Equipment, string> = {
  Barbell: '🏋️',
  Dumbbell: '🏋️‍♀️',
  Machine: '⚙️',
  Cable: '🔗',
  Bodyweight: '🤸',
  Kettlebell: '🔔',
  'Resistance Band': '➰',
  'Smith Machine': '🗜️',
  'EZ Bar': '➿',
  Plate: '⭕',
  Other: '🧩',
  None: '⭐',
}

export function equipmentIcon(e: Equipment): string {
  return EQUIPMENT_ICONS[e] ?? '🏋️'
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatWeight(weight: number | null): string {
  if (weight === null || Number.isNaN(weight)) return '-'
  return weight % 1 === 0 ? String(weight) : weight.toFixed(1)
}

export function formatVolume(volume: number): string {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`
  return String(Math.round(volume))
}

export function relativeDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function estOneRepMax(weight: number, reps: number): number {
  if (reps <= 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

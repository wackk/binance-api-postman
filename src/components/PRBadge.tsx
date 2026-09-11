import { Trophy, Flame, Timer, Zap } from 'lucide-react'
import type { PRType } from '../types'

const PR_META: Record<PRType, { label: string; icon: typeof Trophy; color: string }> = {
  weight: { label: 'Weight PR', icon: Trophy, color: '#FBBF24' },
  reps: { label: 'Reps PR', icon: Flame, color: '#FB923C' },
  duration: { label: 'Duration PR', icon: Timer, color: '#0C7CFF' },
  est1rm: { label: 'Est. 1RM PR', icon: Zap, color: '#A78BFA' },
}

export default function PRBadge({ type, compact }: { type: PRType; compact?: boolean }) {
  const { label, icon: Icon, color } = PR_META[type]
  return (
    <span
      className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
      style={{ backgroundColor: color + '26', color }}
    >
      <Icon size={10} strokeWidth={2.5} />
      {!compact && label}
    </span>
  )
}

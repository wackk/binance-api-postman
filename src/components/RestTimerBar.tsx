import { useEffect, useState } from 'react'
import { X, Plus, Minus, Timer } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'

export default function RestTimerBar() {
  const restTimer = useWorkoutStore((s) => s.restTimer)
  const stopRestTimer = useWorkoutStore((s) => s.stopRestTimer)
  const adjustRestTimer = useWorkoutStore((s) => s.adjustRestTimer)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!restTimer.running) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [restTimer.running])

  useEffect(() => {
    if (restTimer.running && restTimer.endsAt && restTimer.endsAt <= now) {
      stopRestTimer()
    }
  }, [now, restTimer, stopRestTimer])

  if (!restTimer.running || !restTimer.endsAt) return null

  const remainingMs = Math.max(0, restTimer.endsAt - now)
  const remaining = Math.ceil(remainingMs / 1000)
  const mm = Math.floor(remaining / 60)
  const ss = (remaining % 60).toString().padStart(2, '0')
  const progress = Math.min(1, remaining / restTimer.totalSeconds)

  return (
    <div className="absolute inset-x-2 bottom-2 z-30 animate-slide-up overflow-hidden rounded-xl bg-surface-higher shadow-lg ring-1 ring-white/10">
      <div className="h-1 w-full bg-surface-border">
        <div
          className="h-full bg-accent transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Timer size={16} className="text-accent" />
          Rest: {mm}:{ss}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => adjustRestTimer(-15)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-border text-white/80"
            aria-label="Subtract 15 seconds"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => adjustRestTimer(15)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-border text-white/80"
            aria-label="Add 15 seconds"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={stopRestTimer}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-border text-white/80"
            aria-label="Skip rest"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

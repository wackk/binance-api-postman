import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatClockTime } from '../lib/format'

export default function TimerHeaderButton({ onOpen }: { onOpen: () => void }) {
  const utilityTimer = useWorkoutStore((s) => s.utilityTimer)
  const [now, setNow] = useState(Date.now())
  const running = utilityTimer.timerRunning || utilityTimer.stopwatchRunning

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [running])

  let display: string | null = null
  if (utilityTimer.timerRunning && utilityTimer.timerEndsAt) {
    display = formatClockTime(Math.max(0, (utilityTimer.timerEndsAt - now) / 1000))
  } else if (utilityTimer.stopwatchRunning && utilityTimer.stopwatchStartedAt) {
    display = formatClockTime((now - utilityTimer.stopwatchStartedAt) / 1000)
  }

  return (
    <button
      onClick={onOpen}
      className={`flex h-9 items-center justify-center gap-1.5 rounded-full font-bold ${
        display ? 'bg-accent/20 px-3 text-accent' : 'w-9 bg-surface-raised text-white/70'
      }`}
      aria-label="Timer & Stopwatch"
    >
      <Timer size={18} />
      {display && <span className="text-xs tabular-nums">{display}</span>}
    </button>
  )
}

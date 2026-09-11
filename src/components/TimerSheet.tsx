import { useEffect, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Sheet from './Sheet'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatClockTime } from '../lib/format'

const TIMER_PRESETS = [30, 60, 90, 120, 180, 300, 420, 600]

export default function TimerSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utilityTimer = useWorkoutStore((s) => s.utilityTimer)
  const setUtilityTimerMode = useWorkoutStore((s) => s.setUtilityTimerMode)
  const setTimerDuration = useWorkoutStore((s) => s.setTimerDuration)
  const startTimer = useWorkoutStore((s) => s.startTimer)
  const pauseTimer = useWorkoutStore((s) => s.pauseTimer)
  const resetTimer = useWorkoutStore((s) => s.resetTimer)
  const startStopwatch = useWorkoutStore((s) => s.startStopwatch)
  const pauseStopwatch = useWorkoutStore((s) => s.pauseStopwatch)
  const resetStopwatch = useWorkoutStore((s) => s.resetStopwatch)

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!open) return
    if (!utilityTimer.timerRunning && !utilityTimer.stopwatchRunning) return
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [open, utilityTimer.timerRunning, utilityTimer.stopwatchRunning])

  const timerRemaining = utilityTimer.timerRunning && utilityTimer.timerEndsAt
    ? Math.max(0, (utilityTimer.timerEndsAt - now) / 1000)
    : utilityTimer.timerRemainingSeconds

  const stopwatchElapsed = utilityTimer.stopwatchRunning && utilityTimer.stopwatchStartedAt
    ? (now - utilityTimer.stopwatchStartedAt) / 1000
    : utilityTimer.stopwatchElapsedSeconds

  return (
    <Sheet open={open} onClose={onClose} title="Timer & Stopwatch">
      <div className="p-4">
        <div className="mb-5 flex rounded-lg bg-surface-higher p-1">
          <button
            onClick={() => setUtilityTimerMode('timer')}
            className={`flex-1 rounded-md py-2 text-sm font-bold ${
              utilityTimer.mode === 'timer' ? 'bg-accent text-white' : 'text-white/50'
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setUtilityTimerMode('stopwatch')}
            className={`flex-1 rounded-md py-2 text-sm font-bold ${
              utilityTimer.mode === 'stopwatch' ? 'bg-accent text-white' : 'text-white/50'
            }`}
          >
            Stopwatch
          </button>
        </div>

        {utilityTimer.mode === 'timer' ? (
          <>
            <p className="mb-6 text-center text-5xl font-extrabold tabular-nums">{formatClockTime(timerRemaining)}</p>

            <div className="mb-5 grid grid-cols-4 gap-2">
              {TIMER_PRESETS.map((sec) => (
                <button
                  key={sec}
                  disabled={utilityTimer.timerRunning}
                  onClick={() => setTimerDuration(sec)}
                  className={`rounded-lg py-2.5 text-xs font-bold disabled:opacity-30 ${
                    utilityTimer.timerTotalSeconds === sec ? 'bg-accent text-white' : 'bg-surface-higher text-white/70'
                  }`}
                >
                  {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetTimer}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-higher text-white/70"
                aria-label="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
              {utilityTimer.timerRunning ? (
                <button
                  onClick={pauseTimer}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white"
                  aria-label="Pause timer"
                >
                  <Pause size={24} fill="white" />
                </button>
              ) : (
                <button
                  onClick={startTimer}
                  disabled={timerRemaining <= 0}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white disabled:opacity-30"
                  aria-label="Start timer"
                >
                  <Play size={24} fill="white" />
                </button>
              )}
              <div className="h-12 w-12" />
            </div>
          </>
        ) : (
          <>
            <p className="mb-6 text-center text-5xl font-extrabold tabular-nums">{formatClockTime(stopwatchElapsed)}</p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetStopwatch}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-higher text-white/70"
                aria-label="Reset stopwatch"
              >
                <RotateCcw size={18} />
              </button>
              {utilityTimer.stopwatchRunning ? (
                <button
                  onClick={pauseStopwatch}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white"
                  aria-label="Pause stopwatch"
                >
                  <Pause size={24} fill="white" />
                </button>
              ) : (
                <button
                  onClick={startStopwatch}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white"
                  aria-label="Start stopwatch"
                >
                  <Play size={24} fill="white" />
                </button>
              )}
              <div className="h-12 w-12" />
            </div>
          </>
        )}
      </div>
    </Sheet>
  )
}

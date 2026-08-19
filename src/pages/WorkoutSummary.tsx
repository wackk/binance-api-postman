import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy, Dumbbell, Clock, Layers, Trash2 } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatClock, formatDuration, formatVolume, formatWeight, relativeDate } from '../lib/format'

export default function WorkoutSummary() {
  const navigate = useNavigate()
  const { logId } = useParams()
  const history = useWorkoutStore((s) => s.history)
  const getExerciseById = useWorkoutStore((s) => s.getExerciseById)
  const deleteWorkoutLog = useWorkoutStore((s) => s.deleteWorkoutLog)

  const log = history.find((h) => h.id === logId)

  if (!log) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-white/50">Workout not found.</p>
        <button onClick={() => navigate('/workout')} className="text-sm font-semibold text-accent">Back to Workout</button>
      </div>
    )
  }

  function handleDelete() {
    if (confirm('Delete this workout log?')) {
      deleteWorkoutLog(log!.id)
      navigate('/workout')
    }
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold">Workout Summary</span>
        <button onClick={handleDelete} className="flex h-9 w-9 items-center justify-center text-red-400" aria-label="Delete workout">
          <Trash2 size={17} />
        </button>
      </div>

      <div className="px-4">
        {log.prIds.length > 0 && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-accent/15 px-3.5 py-3 text-accent">
            <Trophy size={18} />
            <span className="text-sm font-bold">{log.prIds.length} Personal Record{log.prIds.length > 1 ? 's' : ''} set! 🎉</span>
          </div>
        )}

        <h1 className="text-2xl font-extrabold">{log.name}</h1>
        <p className="mb-5 text-xs text-white/40">
          {relativeDate(log.endedAt)} · {formatClock(log.startedAt)} - {formatClock(log.endedAt)}
        </p>

        <div className="mb-6 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-surface-raised p-3 text-center">
            <Clock size={15} className="mx-auto mb-1 text-accent" />
            <p className="text-sm font-extrabold">{formatDuration(log.durationSeconds)}</p>
            <p className="text-[10px] text-white/40">Duration</p>
          </div>
          <div className="rounded-xl bg-surface-raised p-3 text-center">
            <Dumbbell size={15} className="mx-auto mb-1 text-accent" />
            <p className="text-sm font-extrabold">{formatVolume(log.totalVolume)}kg</p>
            <p className="text-[10px] text-white/40">Volume</p>
          </div>
          <div className="rounded-xl bg-surface-raised p-3 text-center">
            <Layers size={15} className="mx-auto mb-1 text-accent" />
            <p className="text-sm font-extrabold">{log.totalSets}</p>
            <p className="text-[10px] text-white/40">Sets</p>
          </div>
        </div>

        <div className="space-y-4">
          {log.exercises.map((entry) => {
            const exercise = getExerciseById(entry.exerciseId)
            const isPr = log.prIds.includes(entry.exerciseId)
            return (
              <div key={entry.id} className="rounded-xl bg-surface-raised p-3.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <p className="text-sm font-bold">{exercise?.name ?? 'Unknown'}</p>
                  {isPr && <Trophy size={13} className="text-accent" />}
                </div>
                <ul className="space-y-1">
                  {entry.sets.map((s, i) => (
                    <li key={s.id} className="flex justify-between text-sm text-white/70">
                      <span className="text-white/40">Set {i + 1}</span>
                      <span>{formatWeight(s.weight)}kg × {s.reps ?? '-'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => navigate('/workout')}
          className="mt-6 w-full rounded-xl bg-accent py-3 text-sm font-bold"
        >
          Done
        </button>
      </div>
    </div>
  )
}

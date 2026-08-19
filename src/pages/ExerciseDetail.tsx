import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy, ListChecks, History as HistoryIcon } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { equipmentIcon, estOneRepMax, formatWeight, muscleColor, relativeDate } from '../lib/format'

export default function ExerciseDetail() {
  const navigate = useNavigate()
  const { exerciseId } = useParams()
  const getExerciseById = useWorkoutStore((s) => s.getExerciseById)
  const history = useWorkoutStore((s) => s.history)

  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined

  const pastLogs = useMemo(() => {
    if (!exerciseId) return []
    return history
      .map((log) => ({ log, entry: log.exercises.find((e) => e.exerciseId === exerciseId) }))
      .filter((x): x is { log: typeof history[number]; entry: NonNullable<typeof x.entry> } => !!x.entry)
  }, [history, exerciseId])

  const records = useMemo(() => {
    let bestWeight = 0
    let bestWeightReps = 0
    let bestEst1RM = 0
    let bestVolume = 0
    for (const { entry } of pastLogs) {
      for (const s of entry.sets) {
        if (!s.weight) continue
        if (s.weight > bestWeight) {
          bestWeight = s.weight
          bestWeightReps = s.reps ?? 0
        }
        if (s.weight && s.reps) {
          bestEst1RM = Math.max(bestEst1RM, estOneRepMax(s.weight, s.reps))
          bestVolume = Math.max(bestVolume, s.weight * s.reps)
        }
      }
    }
    return { bestWeight, bestWeightReps, bestEst1RM, bestVolume }
  }, [pastLogs])

  if (!exercise) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-white/50">Exercise not found.</p>
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-accent">Go back</button>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="truncate text-sm font-bold">{exercise.name}</span>
      </div>

      <div className="px-4">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: muscleColor(exercise.category) + '33' }}
          >
            {equipmentIcon(exercise.equipment)}
          </div>
          <div>
            <h1 className="text-lg font-extrabold">{exercise.name}</h1>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: muscleColor(exercise.category) + '33', color: muscleColor(exercise.category) }}
              >
                {exercise.category}
              </span>
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-bold text-white/50">
                {exercise.equipment}
              </span>
            </div>
          </div>
        </div>

        {records.bestWeight > 0 && (
          <div className="mb-5 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-surface-raised p-3 text-center">
              <Trophy size={14} className="mx-auto mb-1 text-accent" />
              <p className="text-sm font-extrabold">{formatWeight(records.bestWeight)}kg</p>
              <p className="text-[10px] text-white/40">Best Weight</p>
            </div>
            <div className="rounded-xl bg-surface-raised p-3 text-center">
              <Trophy size={14} className="mx-auto mb-1 text-accent" />
              <p className="text-sm font-extrabold">{formatWeight(records.bestEst1RM)}kg</p>
              <p className="text-[10px] text-white/40">Est. 1RM</p>
            </div>
            <div className="rounded-xl bg-surface-raised p-3 text-center">
              <Trophy size={14} className="mx-auto mb-1 text-accent" />
              <p className="text-sm font-extrabold">{formatWeight(records.bestVolume)}kg</p>
              <p className="text-[10px] text-white/40">Best Set Vol.</p>
            </div>
          </div>
        )}

        {exercise.instructions.length > 0 && (
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <ListChecks size={15} className="text-accent" /> Instructions
            </div>
            <ol className="space-y-2">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-white/70">
                  <span className="shrink-0 font-bold text-accent">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-bold">
            <HistoryIcon size={15} className="text-accent" /> History
          </div>
          {pastLogs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-surface-border px-4 py-6 text-center text-xs text-white/40">
              No history yet for this exercise.
            </p>
          ) : (
            <ul className="space-y-3">
              {pastLogs.map(({ log, entry }) => (
                <li key={log.id} className="rounded-xl bg-surface-raised p-3.5">
                  <p className="mb-1.5 text-xs font-semibold text-white/40">{relativeDate(log.endedAt)}</p>
                  <ul className="space-y-1">
                    {entry.sets.map((s, i) => (
                      <li key={s.id} className="flex justify-between text-sm text-white/70">
                        <span className="text-white/40">Set {i + 1}</span>
                        <span>{formatWeight(s.weight)}kg × {s.reps ?? '-'}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

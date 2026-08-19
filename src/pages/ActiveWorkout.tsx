import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Trash2, Check, X } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import ExercisePicker from '../components/ExercisePicker'
import Sheet from '../components/Sheet'
import type { SetType, WorkoutExerciseEntry } from '../types'
import { formatDuration, formatWeight } from '../lib/format'

const SET_TYPE_LABEL: Record<SetType, string> = {
  normal: '',
  warmup: 'W',
  dropset: 'D',
  failure: 'F',
}
const SET_TYPE_ORDER: SetType[] = ['normal', 'warmup', 'dropset', 'failure']
const SET_TYPE_COLOR: Record<SetType, string> = {
  normal: 'text-white/50',
  warmup: 'text-yellow-400',
  dropset: 'text-purple-400',
  failure: 'text-red-400',
}

function ElapsedTime({ startedAt }: { startedAt: string }) {
  const [seconds, setSeconds] = useState(() => Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  return <span>{formatDuration(seconds)}</span>
}

function ExerciseCard({ entry }: { entry: WorkoutExerciseEntry }) {
  const navigate = useNavigate()
  const getExerciseById = useWorkoutStore((s) => s.getExerciseById)
  const updateSet = useWorkoutStore((s) => s.updateSet)
  const addSet = useWorkoutStore((s) => s.addSet)
  const removeSet = useWorkoutStore((s) => s.removeSet)
  const setSetType = useWorkoutStore((s) => s.setSetType)
  const toggleSetCompleted = useWorkoutStore((s) => s.toggleSetCompleted)
  const removeExerciseFromActive = useWorkoutStore((s) => s.removeExerciseFromActive)
  const updateEntryNotes = useWorkoutStore((s) => s.updateEntryNotes)
  const updateEntryRest = useWorkoutStore((s) => s.updateEntryRest)
  const [restOpen, setRestOpen] = useState(false)

  const exercise = getExerciseById(entry.exerciseId)

  return (
    <div className="rounded-xl bg-surface-raised p-3.5">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <button onClick={() => navigate(`/exercises/${entry.exerciseId}`)} className="text-left text-sm font-bold text-accent">
          {exercise?.name ?? 'Unknown Exercise'}
        </button>
        <button
          onClick={() => {
            if (confirm(`Remove ${exercise?.name ?? 'exercise'} from this workout?`)) removeExerciseFromActive(entry.id)
          }}
          className="text-white/40"
          aria-label="Remove exercise"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <input
        value={entry.notes}
        onChange={(e) => updateEntryNotes(entry.id, e.target.value)}
        placeholder="Add notes..."
        className="mb-2 w-full bg-transparent text-xs text-white/50 outline-none placeholder:text-white/30"
      />

      <button
        onClick={() => setRestOpen(true)}
        className="mb-2 flex items-center gap-1 text-xs font-medium text-white/40"
      >
        Rest timer: {entry.restSeconds}s <ChevronDown size={13} />
      </button>

      <div className="mb-1 grid grid-cols-[26px_54px_1fr_1fr_28px] items-center gap-1.5 px-1 text-[10px] font-semibold uppercase text-white/30">
        <span>Set</span>
        <span>Previous</span>
        <span>Kg</span>
        <span>Reps</span>
        <Check size={12} />
      </div>

      <div className="space-y-1.5">
        {entry.sets.map((s, si) => (
          <div
            key={s.id}
            className={`grid grid-cols-[26px_54px_1fr_1fr_28px] items-center gap-1.5 rounded-lg py-0.5 ${
              s.completed ? 'bg-green-500/10' : ''
            }`}
          >
            <button
              onClick={() => setSetType(entry.id, s.id, SET_TYPE_ORDER[(SET_TYPE_ORDER.indexOf(s.type) + 1) % SET_TYPE_ORDER.length])}
              className={`text-center text-xs font-bold ${SET_TYPE_COLOR[s.type]}`}
            >
              {SET_TYPE_LABEL[s.type] || si + 1}
            </button>
            <span className="truncate text-center text-[11px] text-white/30">
              {s.previousWeight && s.previousReps ? `${formatWeight(s.previousWeight)}×${s.previousReps}` : '-'}
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={s.weight ?? ''}
              onChange={(e) => updateSet(entry.id, s.id, { weight: e.target.value === '' ? null : Number(e.target.value) })}
              placeholder={s.previousWeight ? formatWeight(s.previousWeight) : '0'}
              className="w-full rounded-md bg-surface-higher px-1.5 py-1.5 text-center text-sm outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              value={s.reps ?? ''}
              onChange={(e) => updateSet(entry.id, s.id, { reps: e.target.value === '' ? null : Number(e.target.value) })}
              placeholder={s.previousReps ? String(s.previousReps) : '0'}
              className="w-full rounded-md bg-surface-higher px-1.5 py-1.5 text-center text-sm outline-none"
            />
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => toggleSetCompleted(entry.id, s.id)}
                className={`flex h-6 w-6 items-center justify-center rounded-md ${
                  s.completed ? 'bg-green-500 text-white' : 'bg-surface-higher text-white/30'
                }`}
                aria-label="Complete set"
              >
                <Check size={13} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => addSet(entry.id)}
          className="flex-1 rounded-lg bg-surface-higher py-2 text-xs font-bold text-white/70"
        >
          + Add Set
        </button>
        {entry.sets.length > 0 && (
          <button
            onClick={() => removeSet(entry.id, entry.sets[entry.sets.length - 1].id)}
            className="rounded-lg bg-surface-higher px-3 py-2 text-xs font-bold text-white/50"
          >
            Remove
          </button>
        )}
      </div>

      <Sheet open={restOpen} onClose={() => setRestOpen(false)} title="Rest Timer">
        <div className="grid grid-cols-4 gap-2 p-4">
          {[0, 30, 45, 60, 90, 120, 150, 180].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                updateEntryRest(entry.id, sec)
                setRestOpen(false)
              }}
              className={`rounded-lg py-2.5 text-xs font-bold ${
                entry.restSeconds === sec ? 'bg-accent text-white' : 'bg-surface-higher text-white/70'
              }`}
            >
              {sec === 0 ? 'Off' : `${sec}s`}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}

export default function ActiveWorkout() {
  const navigate = useNavigate()
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout)
  const addExerciseToActive = useWorkoutStore((s) => s.addExerciseToActive)
  const renameActiveWorkout = useWorkoutStore((s) => s.renameActiveWorkout)
  const finishWorkout = useWorkoutStore((s) => s.finishWorkout)
  const cancelActiveWorkout = useWorkoutStore((s) => s.cancelActiveWorkout)
  const [pickerOpen, setPickerOpen] = useState(false)

  const totalCompletedSets = useMemo(
    () => activeWorkout?.exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0) ?? 0,
    [activeWorkout],
  )

  useEffect(() => {
    if (!activeWorkout) navigate('/workout', { replace: true })
  }, [activeWorkout, navigate])

  if (!activeWorkout) return null

  function handleFinish() {
    if (totalCompletedSets === 0) {
      alert('Complete at least one set before finishing.')
      return
    }
    const log = finishWorkout(activeWorkout!.name || 'Workout')
    if (log) navigate(`/workout/summary/${log.id}`, { replace: true })
  }

  function handleCancel() {
    if (confirm('Discard this workout? This cannot be undone.')) {
      cancelActiveWorkout()
      navigate('/workout', { replace: true })
    }
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-3 py-2.5">
        <button onClick={() => navigate('/workout')} className="flex h-9 w-9 items-center justify-center text-white/70" aria-label="Minimize">
          <X size={20} />
        </button>
        <span className="text-sm font-bold text-white/70">
          <ElapsedTime startedAt={activeWorkout.startedAt} />
        </span>
        <button onClick={handleFinish} className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold">
          Finish
        </button>
      </div>

      <div className="px-4">
        <input
          value={activeWorkout.name}
          onChange={(e) => renameActiveWorkout(e.target.value)}
          className="mb-1 w-full bg-transparent text-2xl font-extrabold outline-none"
        />
        <p className="mb-5 text-xs text-white/40">{totalCompletedSets} sets completed</p>

        {activeWorkout.exercises.length === 0 && (
          <div className="mb-6 rounded-xl border border-dashed border-surface-border px-4 py-10 text-center">
            <p className="text-sm text-white/50">Add an exercise to get started.</p>
          </div>
        )}

        <div className="space-y-5">
          {activeWorkout.exercises.map((entry) => (
            <ExerciseCard key={entry.id} entry={entry} />
          ))}
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold"
        >
          <Plus size={16} /> Add Exercise
        </button>

        <button onClick={handleCancel} className="mt-3 w-full rounded-xl border border-red-500/30 py-3 text-sm font-bold text-red-400">
          Discard Workout
        </button>
      </div>

      <ExercisePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(ids) => ids.forEach(addExerciseToActive)} />
    </div>
  )
}

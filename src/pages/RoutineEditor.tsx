import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import ExercisePicker from '../components/ExercisePicker'
import ConfirmDialog from '../components/ConfirmDialog'
import { useDragScroll } from '../lib/useDragScroll'
import type { Routine, WorkoutExerciseEntry, WorkoutSet } from '../types'

function blankSet(): WorkoutSet {
  return {
    id: nanoid(8),
    type: 'normal',
    weight: null,
    reps: null,
    durationSeconds: null,
    distanceMeters: null,
    completed: false,
  }
}

function blankEntry(exerciseId: string, defaultRestSeconds: number): WorkoutExerciseEntry {
  return {
    id: nanoid(8),
    exerciseId,
    notes: '',
    restSeconds: defaultRestSeconds,
    supersetGroup: null,
    sets: [blankSet(), blankSet(), blankSet()],
  }
}

export default function RoutineEditor({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate()
  const { routineId } = useParams()
  const routines = useWorkoutStore((s) => s.routines)
  const folders = useWorkoutStore((s) => s.folders)
  const createRoutine = useWorkoutStore((s) => s.createRoutine)
  const updateRoutine = useWorkoutStore((s) => s.updateRoutine)
  const deleteRoutine = useWorkoutStore((s) => s.deleteRoutine)
  const getExerciseById = useWorkoutStore((s) => s.getExerciseById)
  const weightUnit = useWorkoutStore((s) => s.settings.weightUnit)
  const defaultRestSeconds = useWorkoutStore((s) => s.settings.defaultRestTimerSec)

  const existing = mode === 'edit' ? routines.find((r) => r.id === routineId) : undefined

  const [name, setName] = useState(existing?.name ?? 'New Routine')
  const [folderId, setFolderId] = useState<string | null>(existing?.folderId ?? null)
  const folderScrollRef = useDragScroll<HTMLDivElement>()
  const [exercises, setExercises] = useState<WorkoutExerciseEntry[]>(existing?.exercises ?? [])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && !existing) navigate('/workout', { replace: true })
  }, [mode, existing, navigate])

  function addExercises(ids: string[]) {
    setExercises((prev) => [...prev, ...ids.map((id) => blankEntry(id, defaultRestSeconds))])
  }

  function removeExercise(entryId: string) {
    setExercises((prev) => prev.filter((e) => e.id !== entryId))
  }

  function addSet(entryId: string) {
    setExercises((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, sets: [...e.sets, blankSet()] } : e)),
    )
  }

  function removeSet(entryId: string, setId: string) {
    setExercises((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e)),
    )
  }

  function updateSet(entryId: string, setId: string, patch: Partial<WorkoutSet>) {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) }
          : e,
      ),
    )
  }

  function moveExercise(entryId: string, dir: 'up' | 'down') {
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === entryId)
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (idx === -1 || swap < 0 || swap >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  function handleSave() {
    const trimmedName = name.trim() || 'Untitled Routine'
    if (mode === 'edit' && existing) {
      updateRoutine({ ...existing, name: trimmedName, exercises, folderId })
    } else {
      const created = createRoutine(trimmedName)
      const full: Routine = { ...created, name: trimmedName, exercises, folderId }
      updateRoutine(full)
    }
    navigate('/workout')
  }

  function handleDelete() {
    if (!existing) return
    deleteRoutine(existing.id)
    navigate('/workout')
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold">{mode === 'create' ? 'New Routine' : 'Edit Routine'}</span>
        <button onClick={handleSave} className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold">
          Save
        </button>
      </div>

      <div className="px-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Routine name"
          className="mb-3 w-full bg-transparent text-2xl font-extrabold outline-none placeholder:text-white/30"
        />

        {folders.length > 0 && (
          <div ref={folderScrollRef} className="no-scrollbar mb-6 flex cursor-grab select-none gap-2 overflow-x-auto active:cursor-grabbing">
            <button
              onClick={() => setFolderId(null)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                folderId === null ? 'bg-accent text-white' : 'bg-surface-raised text-white/50'
              }`}
            >
              No Folder
            </button>
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setFolderId(f.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  folderId === f.id ? 'text-white' : 'bg-surface-raised'
                }`}
                style={folderId === f.id ? { backgroundColor: f.colorHex } : { color: f.colorHex }}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {exercises.length === 0 && (
          <div className="mb-6 rounded-xl border border-dashed border-surface-border px-4 py-10 text-center">
            <p className="text-sm text-white/50">Get started by adding an exercise.</p>
          </div>
        )}

        <div className="space-y-5">
          {exercises.map((entry, idx) => {
            const exercise = getExerciseById(entry.exerciseId)
            return (
              <div key={entry.id} className="rounded-xl bg-surface-raised p-3.5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <button
                    onClick={() => navigate(`/exercises/${entry.exerciseId}`)}
                    className="text-left text-sm font-bold text-accent"
                  >
                    {exercise?.name ?? 'Unknown Exercise'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveExercise(entry.id, 'up')}
                      disabled={idx === 0}
                      className="text-white/30 disabled:opacity-20"
                      aria-label="Move up"
                    >
                      <GripVertical size={16} />
                    </button>
                    <button onClick={() => removeExercise(entry.id)} className="text-white/40" aria-label="Remove exercise">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mb-1 grid grid-cols-[28px_1fr_1fr_28px] gap-2 px-1 text-[10px] font-semibold uppercase text-white/30">
                  <span>Set</span>
                  <span>{weightUnit}</span>
                  <span>Reps</span>
                  <span />
                </div>
                <div className="space-y-1.5">
                  {entry.sets.map((s, si) => (
                    <div key={s.id} className="grid grid-cols-[28px_1fr_1fr_28px] items-center gap-2">
                      <span className="text-center text-xs font-bold text-white/50">{si + 1}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={s.weight ?? ''}
                        onChange={(e) =>
                          updateSet(entry.id, s.id, { weight: e.target.value === '' ? null : Number(e.target.value) })
                        }
                        placeholder="0"
                        className="w-full rounded-md bg-surface-higher px-2 py-1.5 text-center text-sm outline-none"
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        value={s.reps ?? ''}
                        onChange={(e) =>
                          updateSet(entry.id, s.id, { reps: e.target.value === '' ? null : Number(e.target.value) })
                        }
                        placeholder="0"
                        className="w-full rounded-md bg-surface-higher px-2 py-1.5 text-center text-sm outline-none"
                      />
                      <button
                        onClick={() => removeSet(entry.id, s.id)}
                        className="flex items-center justify-center text-white/30"
                        aria-label="Remove set"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSet(entry.id)}
                  className="mt-2.5 w-full rounded-lg bg-surface-higher py-2 text-xs font-bold text-white/70"
                >
                  + Add Set
                </button>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold"
        >
          <Plus size={16} /> Add Exercise
        </button>

        {mode === 'edit' && (
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="mt-3 w-full rounded-xl border border-red-500/30 py-3 text-sm font-bold text-red-400"
          >
            Delete Routine
          </button>
        )}
      </div>

      <ExercisePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={addExercises} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Routine"
        message={existing ? `Delete "${existing.name}"? This can't be undone.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  )
}

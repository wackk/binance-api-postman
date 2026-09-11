import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import ConfirmDialog from '../components/ConfirmDialog'
import type { MobilityStretch } from '../types'

function blankStretch(): MobilityStretch {
  return { name: '', durationSeconds: 60, targetArea: '' }
}

export default function MobilityRoutineEditor({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate()
  const { routineId } = useParams()
  const mobilityRoutines = useWorkoutStore((s) => s.mobilityRoutines)
  const createMobilityRoutine = useWorkoutStore((s) => s.createMobilityRoutine)
  const updateMobilityRoutine = useWorkoutStore((s) => s.updateMobilityRoutine)
  const deleteMobilityRoutine = useWorkoutStore((s) => s.deleteMobilityRoutine)

  const existing = mode === 'edit' ? mobilityRoutines.find((r) => r.id === routineId && r.isCustom) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [durationMinutes, setDurationMinutes] = useState(existing?.durationMinutes ?? 15)
  const [exercises, setExercises] = useState<MobilityStretch[]>(existing?.exercises ?? [blankStretch()])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && !existing) navigate('/mobility', { replace: true })
  }, [mode, existing, navigate])

  function addStretch() {
    setExercises((prev) => [...prev, blankStretch()])
  }

  function removeStretch(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  function updateStretch(index: number, patch: Partial<MobilityStretch>) {
    setExercises((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function moveStretch(index: number, dir: 'up' | 'down') {
    setExercises((prev) => {
      const swap = dir === 'up' ? index - 1 : index + 1
      if (swap < 0 || swap >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
  }

  function handleSave() {
    const trimmedTitle = title.trim() || 'Untitled Routine'
    const cleanExercises = exercises
      .map((e) => ({ ...e, name: e.name.trim(), targetArea: e.targetArea.trim() || 'General' }))
      .filter((e) => e.name.length > 0)
    const patch = { title: trimmedTitle, description: description.trim(), durationMinutes, exercises: cleanExercises }

    if (mode === 'edit' && existing) {
      updateMobilityRoutine(existing.id, patch)
    } else {
      const created = createMobilityRoutine(trimmedTitle, description.trim(), durationMinutes)
      updateMobilityRoutine(created.id, patch)
    }
    navigate('/mobility')
  }

  function handleDelete() {
    if (!existing) return
    deleteMobilityRoutine(existing.id)
    navigate('/mobility')
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold">{mode === 'create' ? 'New Mobility Routine' : 'Edit Mobility Routine'}</span>
        <button onClick={handleSave} className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold">
          Save
        </button>
      </div>

      <div className="px-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Routine title"
          className="mb-3 w-full bg-transparent text-2xl font-extrabold outline-none placeholder:text-white/30"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Focus / description"
          className="mb-3 w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none placeholder:text-white/30"
        />
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Duration (minutes)</label>
          <input
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>

        {exercises.length === 0 && (
          <div className="mb-6 rounded-xl border border-dashed border-surface-border px-4 py-10 text-center">
            <p className="text-sm text-white/50">Add a stretch to get started.</p>
          </div>
        )}

        <div className="space-y-3">
          {exercises.map((stretch, idx) => (
            <div key={idx} className="rounded-xl bg-surface-raised p-3.5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <input
                  value={stretch.name}
                  onChange={(e) => updateStretch(idx, { name: e.target.value })}
                  placeholder="Stretch name"
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-white/30"
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => moveStretch(idx, 'up')}
                    disabled={idx === 0}
                    className="text-white/30 disabled:opacity-20"
                    aria-label="Move up"
                  >
                    <GripVertical size={16} />
                  </button>
                  <button onClick={() => removeStretch(idx)} className="text-white/40" aria-label="Remove stretch">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase text-white/30">Seconds</label>
                  <input
                    type="number"
                    min={5}
                    value={stretch.durationSeconds}
                    onChange={(e) => updateStretch(idx, { durationSeconds: Math.max(5, Number(e.target.value) || 5) })}
                    className="w-full rounded-md bg-surface-higher px-2 py-1.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase text-white/30">Target Area</label>
                  <input
                    value={stretch.targetArea}
                    onChange={(e) => updateStretch(idx, { targetArea: e.target.value })}
                    placeholder="e.g. Hips"
                    className="w-full rounded-md bg-surface-higher px-2 py-1.5 text-sm outline-none placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addStretch}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-sm font-bold"
        >
          <Plus size={16} /> Add Stretch
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Routine"
        message={existing ? `Delete "${existing.title}"? This can't be undone.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  )
}

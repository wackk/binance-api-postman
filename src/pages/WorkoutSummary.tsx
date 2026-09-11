import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy, Dumbbell, Clock, Layers, Trash2, Pencil } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatClock, formatDuration, formatVolume, formatWeight, relativeDate, toDatetimeLocalValue } from '../lib/format'
import ConfirmDialog from '../components/ConfirmDialog'
import Sheet from '../components/Sheet'
import PRBadge from '../components/PRBadge'

export default function WorkoutSummary() {
  const navigate = useNavigate()
  const { logId } = useParams()
  const history = useWorkoutStore((s) => s.history)
  const getExerciseById = useWorkoutStore((s) => s.getExerciseById)
  const deleteWorkoutLog = useWorkoutStore((s) => s.deleteWorkoutLog)
  const updateWorkoutLog = useWorkoutStore((s) => s.updateWorkoutLog)
  const weightUnit = useWorkoutStore((s) => s.settings.weightUnit)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

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
    deleteWorkoutLog(log!.id)
    navigate('/workout')
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold">Workout Summary</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditOpen(true)} className="flex h-9 w-9 items-center justify-center text-white/70" aria-label="Edit workout">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeleteConfirmOpen(true)} className="flex h-9 w-9 items-center justify-center text-red-400" aria-label="Delete workout">
            <Trash2 size={17} />
          </button>
        </div>
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
            <p className="text-sm font-extrabold">{formatVolume(log.totalVolume)} {weightUnit}</p>
            <p className="text-[10px] text-white/40">Volume</p>
          </div>
          <div className="rounded-xl bg-surface-raised p-3 text-center">
            <Layers size={15} className="mx-auto mb-1 text-accent" />
            <p className="text-sm font-extrabold">{log.totalSets}</p>
            <p className="text-[10px] text-white/40">Sets</p>
          </div>
        </div>

        {log.notes && (
          <div className="mb-6 rounded-xl bg-surface-raised p-3.5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-white/40">Notes</p>
            <p className="text-sm text-white/70">{log.notes}</p>
          </div>
        )}

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
                <ul className="space-y-1.5">
                  {entry.sets.map((s, i) => (
                    <li key={s.id}>
                      <div className="flex justify-between text-sm text-white/70">
                        <span className="text-white/40">Set {i + 1}</span>
                        <span>{formatWeight(s.weight)}{weightUnit} × {s.reps ?? '-'}</span>
                      </div>
                      {s.prTypes && s.prTypes.length > 0 && (
                        <div className="mt-1 flex justify-end gap-1">
                          {s.prTypes.map((t) => (
                            <PRBadge key={t} type={t} />
                          ))}
                        </div>
                      )}
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Workout Log"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      <EditWorkoutSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        name={log.name}
        notes={log.notes}
        endedAt={log.endedAt}
        durationSeconds={log.durationSeconds}
        onSave={(patch) => {
          updateWorkoutLog(log.id, patch)
          setEditOpen(false)
        }}
      />
    </div>
  )
}

function EditWorkoutSheet({
  open,
  onClose,
  name,
  notes,
  endedAt,
  durationSeconds,
  onSave,
}: {
  open: boolean
  onClose: () => void
  name: string
  notes: string
  endedAt: string
  durationSeconds: number
  onSave: (patch: { name: string; notes: string; endedAt: string; durationSeconds: number }) => void
}) {
  const [nameValue, setNameValue] = useState(name)
  const [dateValue, setDateValue] = useState(() => toDatetimeLocalValue(new Date(endedAt)))
  const [minutes, setMinutes] = useState(() => Math.max(1, Math.round(durationSeconds / 60)))
  const [notesValue, setNotesValue] = useState(notes)

  function submit() {
    const ended = new Date(dateValue)
    onSave({
      name: nameValue.trim() || 'Workout',
      notes: notesValue.trim(),
      endedAt: ended.toISOString(),
      durationSeconds: Math.max(60, minutes * 60),
    })
  }

  return (
    <Sheet open={open} onClose={onClose} title="Edit Workout">
      <div className="space-y-4 p-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Name</label>
          <input
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Date & Time</label>
          <input
            type="datetime-local"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Duration (minutes)</label>
          <input
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Notes</label>
          <textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            rows={3}
            placeholder="How did it feel?"
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none placeholder:text-white/30"
          />
        </div>
        <button onClick={submit} className="w-full rounded-xl bg-accent py-3 text-sm font-bold">
          Save Changes
        </button>
      </div>
    </Sheet>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, History as HistoryIcon, MoreVertical, Copy, Trash2, Pencil, Play, Folder, FolderPlus, X, Sparkles } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatVolume, relativeDate } from '../lib/format'
import Sheet from '../components/Sheet'
import ConfirmDialog from '../components/ConfirmDialog'
import type { Routine, RoutineFolder } from '../types'

export default function WorkoutHome() {
  const navigate = useNavigate()
  const routines = useWorkoutStore((s) => s.routines)
  const folders = useWorkoutStore((s) => s.folders)
  const history = useWorkoutStore((s) => s.history)
  const weightUnit = useWorkoutStore((s) => s.settings.weightUnit)
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout)
  const startEmptyWorkout = useWorkoutStore((s) => s.startEmptyWorkout)
  const startWorkoutFromRoutine = useWorkoutStore((s) => s.startWorkoutFromRoutine)
  const deleteRoutine = useWorkoutStore((s) => s.deleteRoutine)
  const duplicateRoutine = useWorkoutStore((s) => s.duplicateRoutine)
  const createFolder = useWorkoutStore((s) => s.createFolder)
  const deleteFolder = useWorkoutStore((s) => s.deleteFolder)
  const getRoutineStats = useWorkoutStore((s) => s.getRoutineStats)
  const loadDemoData = useWorkoutStore((s) => s.loadDemoData)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [folderSheetOpen, setFolderSheetOpen] = useState(false)
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<RoutineFolder | null>(null)
  const [deleteRoutineTarget, setDeleteRoutineTarget] = useState<Routine | null>(null)

  function handleQuickStart() {
    if (!activeWorkout) startEmptyWorkout()
    navigate('/workout/active')
  }

  function handleStartRoutine(id: string) {
    if (!activeWorkout) startWorkoutFromRoutine(id)
    navigate('/workout/active')
  }

  return (
    <div className="px-4 pb-8 pt-2">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Workout</h1>
        <button
          onClick={() => navigate('/workout/history')}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-white/70"
          aria-label="Workout history"
        >
          <HistoryIcon size={18} />
        </button>
      </div>

      <button
        onClick={handleQuickStart}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold shadow-lg shadow-accent/20 active:scale-[0.99]"
      >
        <Play size={16} fill="white" /> Start Empty Workout
      </button>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">Routines</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFolderSheetOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-white/70"
          >
            <FolderPlus size={14} /> New Folder
          </button>
          <button
            onClick={() => navigate('/workout/routine/new')}
            className="flex items-center gap-1 rounded-lg bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-accent"
          >
            <Plus size={14} /> New Routine
          </button>
        </div>
      </div>

      {folders.length > 0 && (
        <div className="mb-4 space-y-2">
          {folders.map((f) => {
            const count = routines.filter((r) => r.folderId === f.id).length
            return (
              <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface-higher px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <Folder size={16} style={{ color: f.colorHex }} />
                  <span className="text-sm font-bold">{f.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">{count} routine{count === 1 ? '' : 's'}</span>
                  <button
                    onClick={() => setDeleteFolderTarget(f)}
                    className="text-white/30"
                    aria-label={`Delete folder ${f.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {routines.length === 0 ? (
        <div className="mb-8 rounded-xl border border-dashed border-surface-border px-4 py-8 text-center">
          <p className="text-sm text-white/50">No routines yet.</p>
          <p className="mt-1 text-xs text-white/30">Create a routine to plan out your workouts in advance.</p>
          {history.length === 0 && (
            <button
              onClick={loadDemoData}
              className="mx-auto mt-4 flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold"
            >
              <Sparkles size={13} /> Load Example Data
            </button>
          )}
        </div>
      ) : (
        <ul className="mb-8 space-y-3">
          {routines.map((r) => {
            const folder = folders.find((f) => f.id === r.folderId)
            const stats = getRoutineStats(r.id)
            return (
              <li key={r.id} className="rounded-xl bg-surface-raised p-4">
                <div className="flex items-start justify-between">
                  <button className="min-w-0 flex-1 text-left" onClick={() => navigate(`/workout/routine/${r.id}`)}>
                    {folder && (
                      <span
                        className="mb-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold"
                        style={{ backgroundColor: folder.colorHex + '26', color: folder.colorHex }}
                      >
                        {folder.name}
                      </span>
                    )}
                    <p className="truncate text-sm font-bold">{r.name}</p>
                    <p className="mt-0.5 truncate text-xs text-white/40">
                      Last performed: {stats.lastPerformedText} • ~{stats.estimatedDurationMinutes}m
                    </p>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setMenuFor(menuFor === r.id ? null : r.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-white/50"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuFor === r.id && (
                      <div className="absolute right-0 top-8 z-10 w-40 overflow-hidden rounded-lg bg-surface-higher shadow-xl ring-1 ring-white/10">
                        <button
                          onClick={() => {
                            navigate(`/workout/routine/${r.id}`)
                            setMenuFor(null)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            duplicateRoutine(r.id)
                            setMenuFor(null)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium"
                        >
                          <Copy size={13} /> Duplicate
                        </button>
                        <button
                          onClick={() => {
                            setDeleteRoutineTarget(r)
                            setMenuFor(null)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-red-400"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 truncate text-xs text-white/40">
                  {r.exercises.length === 0 ? 'No exercises' : `${r.exercises.length} exercise${r.exercises.length > 1 ? 's' : ''}`}
                </p>
                <button
                  onClick={() => handleStartRoutine(r.id)}
                  className="mt-3 w-full rounded-lg bg-surface-higher py-2 text-xs font-bold text-accent"
                >
                  Start Routine
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">Recent Workouts</h2>
        {history.length > 0 && (
          <button onClick={() => navigate('/workout/history')} className="text-xs font-semibold text-accent">
            See all
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-border px-4 py-8 text-center">
          <p className="text-sm text-white/50">No workouts logged yet.</p>
          <p className="mt-1 text-xs text-white/30">Start a workout to see it here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.slice(0, 3).map((log) => (
            <li key={log.id}>
              <button
                onClick={() => navigate(`/workout/summary/${log.id}`)}
                className="w-full rounded-xl bg-surface-raised p-4 text-left"
              >
                <p className="text-xs font-medium text-white/40">{relativeDate(log.endedAt)}</p>
                <p className="mt-0.5 text-sm font-bold">{log.name}</p>
                <div className="mt-2 flex gap-4 text-xs text-white/50">
                  <span>{log.exercises.length} exercises</span>
                  <span>{log.totalSets} sets</span>
                  <span>{formatVolume(log.totalVolume)} {weightUnit} volume</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <CreateFolderSheet open={folderSheetOpen} onClose={() => setFolderSheetOpen(false)} onCreate={createFolder} />

      <ConfirmDialog
        open={!!deleteFolderTarget}
        title="Delete Folder"
        message={deleteFolderTarget ? `Delete "${deleteFolderTarget.name}"? Routines inside will remain, just unfiled.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteFolderTarget) deleteFolder(deleteFolderTarget.id)
          setDeleteFolderTarget(null)
        }}
        onCancel={() => setDeleteFolderTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteRoutineTarget}
        title="Delete Routine"
        message={deleteRoutineTarget ? `Delete "${deleteRoutineTarget.name}"? This can't be undone.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteRoutineTarget) deleteRoutine(deleteRoutineTarget.id)
          setDeleteRoutineTarget(null)
        }}
        onCancel={() => setDeleteRoutineTarget(null)}
      />
    </div>
  )
}

function CreateFolderSheet({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState('')

  function submit() {
    if (!name.trim()) return
    onCreate(name.trim())
    setName('')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="New Folder">
      <div className="space-y-3 p-4">
        <p className="text-xs text-white/50">Organize your routines by phase, target muscle, or program type.</p>
        <div className="flex items-center gap-2 rounded-lg bg-surface-higher px-3 py-2.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Folder name"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
          {name && (
            <button onClick={() => setName('')} aria-label="Clear">
              <X size={14} className="text-white/40" />
            </button>
          )}
        </div>
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="w-full rounded-xl bg-accent py-3 text-sm font-bold disabled:opacity-40"
        >
          Create
        </button>
      </div>
    </Sheet>
  )
}

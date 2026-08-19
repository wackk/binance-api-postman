import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, History as HistoryIcon, MoreVertical, Copy, Trash2, Pencil, Play } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatVolume, relativeDate } from '../lib/format'

export default function WorkoutHome() {
  const navigate = useNavigate()
  const routines = useWorkoutStore((s) => s.routines)
  const history = useWorkoutStore((s) => s.history)
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout)
  const startEmptyWorkout = useWorkoutStore((s) => s.startEmptyWorkout)
  const startWorkoutFromRoutine = useWorkoutStore((s) => s.startWorkoutFromRoutine)
  const deleteRoutine = useWorkoutStore((s) => s.deleteRoutine)
  const duplicateRoutine = useWorkoutStore((s) => s.duplicateRoutine)
  const [menuFor, setMenuFor] = useState<string | null>(null)

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
        <button
          onClick={() => navigate('/workout/routine/new')}
          className="flex items-center gap-1 rounded-lg bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-accent"
        >
          <Plus size={14} /> New Routine
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="mb-8 rounded-xl border border-dashed border-surface-border px-4 py-8 text-center">
          <p className="text-sm text-white/50">No routines yet.</p>
          <p className="mt-1 text-xs text-white/30">Create a routine to plan out your workouts in advance.</p>
        </div>
      ) : (
        <ul className="mb-8 space-y-3">
          {routines.map((r) => (
            <li key={r.id} className="rounded-xl bg-surface-raised p-4">
              <div className="flex items-start justify-between">
                <button className="min-w-0 flex-1 text-left" onClick={() => navigate(`/workout/routine/${r.id}`)}>
                  <p className="truncate text-sm font-bold">{r.name}</p>
                  <p className="mt-0.5 truncate text-xs text-white/40">
                    {r.exercises.length === 0
                      ? 'No exercises'
                      : r.exercises.slice(0, 3).map((e) => e.exerciseId).join(', ').length > 40
                        ? `${r.exercises.length} exercises`
                        : `${r.exercises.length} exercise${r.exercises.length > 1 ? 's' : ''}`}
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
                          if (confirm(`Delete "${r.name}"?`)) deleteRoutine(r.id)
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
              <button
                onClick={() => handleStartRoutine(r.id)}
                className="mt-3 w-full rounded-lg bg-surface-higher py-2 text-xs font-bold text-accent"
              >
                Start Routine
              </button>
            </li>
          ))}
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
                  <span>{formatVolume(log.totalVolume)} kg volume</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { formatVolume, relativeDate } from '../lib/format'

export default function History() {
  const navigate = useNavigate()
  const history = useWorkoutStore((s) => s.history)

  const grouped = useMemo(() => {
    const groups: Record<string, typeof history> = {}
    for (const log of history) {
      const key = new Date(log.endedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      groups[key] = groups[key] || []
      groups[key].push(log)
    }
    return Object.entries(groups)
  }, [history])

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold">History</span>
      </div>

      <div className="px-4">
        {history.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-surface-border px-4 py-10 text-center">
            <p className="text-sm text-white/50">No workouts logged yet.</p>
          </div>
        ) : (
          grouped.map(([month, logs]) => (
            <div key={month} className="mb-5">
              <p className="mb-2 text-xs font-bold text-white/40">{month}</p>
              <ul className="space-y-3">
                {logs.map((log) => (
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
                        <span>{formatVolume(log.totalVolume)}kg volume</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

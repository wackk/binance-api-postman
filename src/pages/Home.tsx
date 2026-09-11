import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Mountain, Sparkles } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { boulderGradeIndex, sportGradeIndex } from '../data/climbing'
import { formatDuration, formatVolume, relativeDate } from '../lib/format'
import { useDragScroll } from '../lib/useDragScroll'

type Filter = 'All' | 'Workouts' | 'Climbing' | 'Mobility'

interface FeedItem {
  id: string
  kind: 'workout' | 'climbing' | 'mobility'
  timestamp: number
}

export default function Home() {
  const navigate = useNavigate()
  const history = useWorkoutStore((s) => s.history)
  const climbs = useWorkoutStore((s) => s.climbs)
  const mobilityLogs = useWorkoutStore((s) => s.mobilityLogs)
  const profile = useWorkoutStore((s) => s.profile)
  const loadDemoData = useWorkoutStore((s) => s.loadDemoData)
  const weightUnit = useWorkoutStore((s) => s.settings.weightUnit)
  const [filter, setFilter] = useState<Filter>('All')
  const filterScrollRef = useDragScroll<HTMLDivElement>()

  const climbingSessions = useMemo(() => {
    const byDay: Record<string, typeof climbs> = {}
    for (const c of climbs) {
      const key = new Date(c.timestampMs).toDateString()
      byDay[key] = byDay[key] || []
      byDay[key].push(c)
    }
    return Object.values(byDay).map((dayClimbs) => {
      const sorted = [...dayClimbs].sort((a, b) => b.timestampMs - a.timestampMs)
      const boulders = dayClimbs.filter((c) => c.type === 'Bouldering' && c.isSend)
      const sports = dayClimbs.filter((c) => c.type === 'Sport' && c.isSend)
      const avgBoulder =
        boulders.length > 0
          ? Math.round(boulders.reduce((n, c) => n + boulderGradeIndex(c.grade), 0) / boulders.length)
          : null
      const avgSport =
        sports.length > 0 ? Math.round(sports.reduce((n, c) => n + sportGradeIndex(c.grade), 0) / sports.length) : null
      return {
        id: `climb-${sorted[0].timestampMs}`,
        timestamp: sorted[0].timestampMs,
        totalAttempts: dayClimbs.reduce((n, c) => n + c.attempts, 0),
        sendsCount: dayClimbs.filter((c) => c.isSend).length,
        fallsCount: dayClimbs.filter((c) => !c.isSend).length,
        avgBoulder,
        avgSport,
        climbCount: dayClimbs.length,
      }
    })
  }, [climbs])

  const feed: FeedItem[] = useMemo(() => {
    const items: FeedItem[] = [
      ...history.map((h) => ({ id: h.id, kind: 'workout' as const, timestamp: new Date(h.endedAt).getTime() })),
      ...climbingSessions.map((c) => ({ id: c.id, kind: 'climbing' as const, timestamp: c.timestamp })),
      ...mobilityLogs.map((m) => ({ id: m.id, kind: 'mobility' as const, timestamp: new Date(m.completedAt).getTime() })),
    ]
    return items
      .filter((i) => filter === 'All' || (filter === 'Workouts' && i.kind === 'workout') || (filter === 'Climbing' && i.kind === 'climbing') || (filter === 'Mobility' && i.kind === 'mobility'))
      .sort((a, b) => b.timestamp - a.timestamp)
  }, [history, climbingSessions, mobilityLogs, filter])

  return (
    <div className="px-4 pb-8 pt-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Welcome back</p>
          <h1 className="text-2xl font-extrabold">{profile.username}</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-raised text-sm font-extrabold ring-1 ring-white/10"
        >
          {profile.username.slice(0, 1).toUpperCase()}
        </button>
      </div>

      <div ref={filterScrollRef} className="no-scrollbar mb-4 flex cursor-grab select-none gap-2 overflow-x-auto active:cursor-grabbing">
        {(['All', 'Workouts', 'Climbing', 'Mobility'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              filter === f ? 'bg-accent text-white' : 'bg-surface-raised text-white/50'
            }`}
          >
            {f === 'All' ? 'All Activity' : f}
          </button>
        ))}
      </div>

      {feed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-border px-4 py-10 text-center">
          <p className="text-sm text-white/50">No activity yet.</p>
          <p className="mt-1 text-xs text-white/30">Log a workout, climb, or mobility session to see it here.</p>
          <button
            onClick={loadDemoData}
            className="mx-auto mt-4 flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold"
          >
            <Sparkles size={13} /> Load Example Data
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {feed.map((item) => {
            if (item.kind === 'workout') {
              const log = history.find((h) => h.id === item.id)!
              return (
                <li key={item.id}>
                  <button onClick={() => navigate(`/workout/summary/${log.id}`)} className="w-full rounded-2xl bg-surface-raised p-4 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                          <Dumbbell size={12} /> Weightlifting
                        </p>
                        <p className="mt-0.5 text-sm font-bold">{log.name}</p>
                        <p className="text-xs text-white/40">
                          {relativeDate(log.endedAt)} • {formatDuration(log.durationSeconds)}
                        </p>
                      </div>
                      {log.prIds.length > 0 && (
                        <div className="flex flex-col items-center rounded-xl bg-surface-higher px-3 py-1.5">
                          <span className="text-sm font-extrabold">{log.prIds.length}</span>
                          <span className="text-[9px] font-bold text-accent">PRs</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex justify-between rounded-xl bg-white/[0.04] p-3">
                      <Stat label="Volume" value={`${formatVolume(log.totalVolume)} ${weightUnit}`} />
                      <Stat label="Sets" value={String(log.totalSets)} />
                      <Stat label="Exercises" value={String(log.exercises.length)} />
                    </div>
                  </button>
                </li>
              )
            }
            if (item.kind === 'climbing') {
              const c = climbingSessions.find((x) => x.id === item.id)!
              return (
                <li key={item.id} className="rounded-2xl bg-surface-raised p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-orange-400">
                        <Mountain size={12} /> Climbing
                      </p>
                      <p className="mt-0.5 text-sm font-bold">Climbing Session</p>
                      <p className="text-xs text-white/40">{relativeDate(new Date(c.timestamp).toISOString())}</p>
                    </div>
                    <div className="flex flex-col items-center rounded-xl bg-surface-higher px-3 py-1.5">
                      <span className="text-sm font-extrabold">{c.totalAttempts}</span>
                      <span className="text-[9px] font-bold text-white/40">Attempts</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between rounded-xl bg-white/[0.04] p-3">
                    <Stat
                      label="Grade"
                      value={c.avgBoulder !== null ? `V${c.avgBoulder}` : c.avgSport !== null ? `Sport` : '-'}
                    />
                    <Stat label="Sends" value={String(c.sendsCount)} />
                    <Stat label="Falls" value={String(c.fallsCount)} />
                  </div>
                </li>
              )
            }
            const m = mobilityLogs.find((x) => x.id === item.id)!
            return (
              <li key={item.id} className="rounded-2xl bg-surface-raised p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                  <Sparkles size={12} /> Mobility & Flexibility
                </p>
                <p className="mt-0.5 text-sm font-bold">{m.routineTitle}</p>
                <p className="text-xs text-white/40">
                  {relativeDate(m.completedAt)} • {formatDuration(m.durationSeconds)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.exercisesDone.map((e) => (
                    <span key={e} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-white/70">
                      {e}
                    </span>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-wide text-white/40">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}

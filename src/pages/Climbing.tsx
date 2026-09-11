import { useMemo, useState } from 'react'
import { Plus, Trash2, Star, TrendingUp, Mountain, Calendar as CalendarIcon } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { BOULDER_GRADES, CLIMBING_STYLE_TAGS, SPORT_GRADES, boulderGradeIndex, sportGradeIndex } from '../data/climbing'
import type { ClimbEntry, ClimbType } from '../types'
import Sheet from '../components/Sheet'
import { MiniBarChart, MiniLineChart } from '../components/charts'
import { useDragScroll } from '../lib/useDragScroll'

const TIME_FILTERS = [
  { key: '1W', days: 7 },
  { key: '1M', days: 30 },
  { key: '3M', days: 90 },
  { key: '1Y', days: 365 },
  { key: 'ALL', days: Infinity },
] as const

function isSameDay(ms1: number, ms2: number) {
  const d1 = new Date(ms1)
  const d2 = new Date(ms2)
  return d1.toDateString() === d2.toDateString()
}

export default function Climbing() {
  const climbs = useWorkoutStore((s) => s.climbs)
  const logClimb = useWorkoutStore((s) => s.logClimb)
  const deleteClimb = useWorkoutStore((s) => s.deleteClimb)
  const getClimbingStats = useWorkoutStore((s) => s.getClimbingStats)
  const [logOpen, setLogOpen] = useState(false)
  const [selectedDateMs, setSelectedDateMs] = useState(() => Date.now())
  const [timeFilter, setTimeFilter] = useState<(typeof TIME_FILTERS)[number]['key']>('1M')
  const [gradeTab, setGradeTab] = useState<ClimbType>('Bouldering')
  const dayScrollRef = useDragScroll<HTMLDivElement>()

  const stats = getClimbingStats()

  const last14Days = useMemo(() => {
    const list: number[] = []
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      list.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i).getTime())
    }
    return list
  }, [])

  const climbsForSelectedDate = useMemo(
    () => climbs.filter((c) => isSameDay(c.timestampMs, selectedDateMs)).sort((a, b) => b.timestampMs - a.timestampMs),
    [climbs, selectedDateMs],
  )

  const rangeDays = TIME_FILTERS.find((f) => f.key === timeFilter)!.days
  const cutoff = rangeDays === Infinity ? -Infinity : Date.now() - rangeDays * 86400000
  const climbsInRange = useMemo(() => climbs.filter((c) => c.timestampMs >= cutoff), [climbs, cutoff])

  const sessionDays = useMemo(() => {
    const set = new Set(climbsInRange.map((c) => new Date(c.timestampMs).setHours(0, 0, 0, 0)))
    return Array.from(set).sort((a, b) => a - b).slice(-8)
  }, [climbsInRange])

  const sessionVolumeData = sessionDays.map((day) => ({
    label: new Date(day).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
    value: climbsInRange.filter((c) => new Date(c.timestampMs).setHours(0, 0, 0, 0) === day).length,
  }))

  const avgGradeData = sessionDays
    .map((day) => {
      const dayClimbs = climbsInRange.filter(
        (c) => new Date(c.timestampMs).setHours(0, 0, 0, 0) === day && c.type === gradeTab && c.isSend,
      )
      if (dayClimbs.length === 0) return null
      const grades = gradeTab === 'Bouldering' ? BOULDER_GRADES : SPORT_GRADES
      const idxFn = gradeTab === 'Bouldering' ? boulderGradeIndex : sportGradeIndex
      const avgIdx = Math.round(dayClimbs.reduce((n, c) => n + idxFn(c.grade), 0) / dayClimbs.length)
      return {
        label: new Date(day).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
        value: avgIdx,
        display: grades[avgIdx] ?? grades[0],
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const sessionIntensityData = sessionDays.map((day) => {
    const dayClimbs = climbsInRange.filter((c) => new Date(c.timestampMs).setHours(0, 0, 0, 0) === day)
    const score = dayClimbs.reduce((n, c) => {
      const idx = c.type === 'Bouldering' ? boulderGradeIndex(c.grade) : sportGradeIndex(c.grade)
      return n + idx * c.attempts * (c.isSend ? 1.5 : 1)
    }, 0)
    return {
      label: new Date(day).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
      value: Math.round(score),
    }
  })

  const styleTagData = useMemo(() => {
    const scores: Record<string, number> = {}
    for (const tag of CLIMBING_STYLE_TAGS) scores[tag] = 0
    for (const c of climbsInRange) {
      const idx = c.type === 'Bouldering' ? boulderGradeIndex(c.grade) : sportGradeIndex(c.grade)
      for (const tag of c.styleTags) scores[tag] = (scores[tag] ?? 0) + idx * c.attempts
    }
    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1
    return CLIMBING_STYLE_TAGS.map((tag) => ({
      tag,
      weightedScore: Math.round(scores[tag]),
      percentage: (scores[tag] / total) * 100,
    })).sort((a, b) => b.weightedScore - a.weightedScore)
  }, [climbsInRange])

  return (
    <div className="px-4 pb-8 pt-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-orange-400">
            <Mountain size={13} /> Bouldering & Sport Log
          </p>
          <h1 className="text-2xl font-extrabold">Climbing</h1>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2.5 text-xs font-bold"
        >
          <Plus size={15} /> Log Climb
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-surface-raised p-3">
          <p className="flex items-center gap-1 text-[9px] font-bold uppercase text-white/40">
            <Star size={11} className="text-orange-400" /> Max Boulder
          </p>
          <p className="mt-1 text-xl font-extrabold text-orange-400">{stats.highestBoulderGrade}</p>
        </div>
        <div className="rounded-xl bg-surface-raised p-3">
          <p className="flex items-center gap-1 text-[9px] font-bold uppercase text-white/40">
            <Mountain size={11} className="text-emerald-400" /> Max Sport
          </p>
          <p className="mt-1 text-xl font-extrabold text-emerald-400">{stats.highestSportGrade}</p>
        </div>
        <div className="rounded-xl bg-surface-raised p-3">
          <p className="flex items-center gap-1 text-[9px] font-bold uppercase text-white/40">
            <TrendingUp size={11} className="text-accent" /> Avg/Session
          </p>
          <p className="mt-1 text-xl font-extrabold">{stats.avgClimbsPerSession.toFixed(1)}</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface-raised p-3.5">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-white/40">
          <CalendarIcon size={13} /> RECENT SESSIONS
        </div>
        <div ref={dayScrollRef} className="no-scrollbar mb-3 flex cursor-grab select-none gap-1.5 overflow-x-auto active:cursor-grabbing">
          {last14Days.map((day) => {
            const selected = isSameDay(day, selectedDateMs)
            const count = climbs.filter((c) => isSameDay(c.timestampMs, day)).length
            return (
              <button
                key={day}
                onClick={() => setSelectedDateMs(day)}
                className={`flex w-12 shrink-0 flex-col items-center rounded-xl py-2 ${
                  selected ? 'bg-orange-500' : 'bg-surface-higher'
                }`}
              >
                <span className={`text-[9px] font-bold ${selected ? 'text-white' : 'text-white/40'}`}>
                  {new Date(day).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                </span>
                <span className={`text-base font-extrabold ${selected ? 'text-white' : 'text-white/90'}`}>
                  {new Date(day).getDate()}
                </span>
                {count > 0 && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />}
              </button>
            )
          })}
        </div>
        <p className="mb-2 text-xs font-bold text-white/50">
          Climbs on {new Date(selectedDateMs).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} (
          {climbsForSelectedDate.length})
        </p>
        {climbsForSelectedDate.length === 0 ? (
          <div className="rounded-lg bg-surface-higher px-3 py-5 text-center text-xs text-white/40">
            No climbs logged for this date.
          </div>
        ) : (
          <div className="space-y-2">
            {climbsForSelectedDate.map((c) => (
              <ClimbItem key={c.id} climb={c} onDelete={() => deleteClimb(c.id)} />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl bg-surface-raised p-3.5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-white/40">PROGRESS & ANALYTICS</p>
          <div className="flex gap-1">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setTimeFilter(f.key)}
                className={`rounded px-1.5 py-1 text-[9px] font-bold ${
                  timeFilter === f.key ? 'bg-orange-500 text-white' : 'bg-surface-higher text-white/50'
                }`}
              >
                {f.key}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-1 text-xs font-bold">Climbs Per Session</p>
        <MiniBarChart data={sessionVolumeData} color="#FB923C" />

        <p className="mb-1 mt-5 text-xs font-bold">Average Grade Sent Over Time</p>
        <div className="mb-2 flex overflow-hidden rounded-lg bg-surface-higher p-1">
          {(['Bouldering', 'Sport'] as ClimbType[]).map((t) => (
            <button
              key={t}
              onClick={() => setGradeTab(t)}
              className={`flex-1 rounded-md py-1.5 text-[11px] font-bold ${
                gradeTab === t ? (t === 'Bouldering' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white') : 'text-white/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <MiniLineChart data={avgGradeData} color={gradeTab === 'Bouldering' ? '#FB923C' : '#34D399'} />

        <p className="mb-1 mt-5 text-xs font-bold">Session Intensity Over Time</p>
        <MiniBarChart data={sessionIntensityData} color="#0C7CFF" />

        <p className="mb-1 mt-5 text-xs font-bold">Style Tag Training Balance</p>
        <div className="space-y-2">
          {styleTagData.slice(0, 8).map((s) => {
            const badge =
              s.weightedScore === 0
                ? { text: 'NOT TRAINED', color: '#FF5252' }
                : s.percentage >= 15
                  ? { text: 'OVER TRAINED', color: '#FFB74D' }
                  : s.percentage >= 5
                    ? { text: 'BALANCED', color: '#FB923C' }
                    : { text: 'UNDER TRAINED', color: '#64B5F6' }
            const maxScore = Math.max(...styleTagData.map((d) => d.weightedScore), 1)
            return (
              <div key={s.tag} className="rounded-lg bg-surface-higher px-3 py-2">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{s.tag}</span>
                    <span
                      className="rounded px-1.5 py-0.5 text-[8px] font-bold"
                      style={{ backgroundColor: badge.color + '33', color: badge.color }}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/40">
                    {s.weightedScore} pts ({s.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(2, (s.weightedScore / maxScore) * 100)}%`, backgroundColor: badge.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <LogClimbSheet
        open={logOpen}
        initialDateMs={selectedDateMs}
        onClose={() => setLogOpen(false)}
        onSave={(params) => {
          logClimb(params)
          setLogOpen(false)
        }}
      />
    </div>
  )
}

function ClimbItem({ climb, onDelete }: { climb: ClimbEntry; onDelete: () => void }) {
  const tagColor = climb.type === 'Bouldering' ? '#FB923C' : '#34D399'
  return (
    <div className="rounded-lg bg-surface-higher p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg px-2.5 py-1.5 text-sm font-extrabold" style={{ backgroundColor: tagColor + '30', color: tagColor }}>
            {climb.grade}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: tagColor }}>
              {climb.type}
              <span className={climb.isSend ? 'text-emerald-400' : 'text-red-400'}>
                • {climb.isSend ? `SENT (${climb.attempts})` : `ATTEMPT (${climb.attempts})`}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {climb.styleTags.map((t) => (
                <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/50">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onDelete} className="text-white/30" aria-label="Delete climb">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function LogClimbSheet({
  open,
  initialDateMs,
  onClose,
  onSave,
}: {
  open: boolean
  initialDateMs: number
  onClose: () => void
  onSave: (params: { type: ClimbType; grade: string; styleTags: string[]; attempts: number; isSend: boolean; timestampMs: number }) => void
}) {
  const [type, setType] = useState<ClimbType>('Bouldering')
  const [grade, setGrade] = useState(BOULDER_GRADES[4])
  const gradeScrollRef = useDragScroll<HTMLDivElement>()
  const [tags, setTags] = useState<string[]>(['Dynamic', 'Technical'])
  const [attempts, setAttempts] = useState(1)
  const [isSend, setIsSend] = useState(true)
  const [dateMs, setDateMs] = useState(initialDateMs)

  const grades = type === 'Bouldering' ? BOULDER_GRADES : SPORT_GRADES

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function submit() {
    onSave({ type, grade, styleTags: tags, attempts, isSend, timestampMs: dateMs })
  }

  return (
    <Sheet open={open} onClose={onClose} title="Log a Climb" fullHeight>
      <div className="space-y-4 p-4">
        <div className="flex overflow-hidden rounded-xl bg-surface-higher p-1">
          {(['Bouldering', 'Sport'] as ClimbType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t)
                setGrade(t === 'Bouldering' ? BOULDER_GRADES[4] : SPORT_GRADES[5])
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold ${
                type === t ? (t === 'Bouldering' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white') : 'text-white/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-white/50">Select Grade</p>
          <div ref={gradeScrollRef} className="no-scrollbar flex cursor-grab select-none gap-1.5 overflow-x-auto active:cursor-grabbing">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  grade === g ? (type === 'Bouldering' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white') : 'bg-surface-higher'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1.5 text-xs font-bold text-white/50">Result</p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsSend(true)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${isSend ? 'bg-emerald-500 text-white' : 'bg-surface-higher'}`}
              >
                Send ✓
              </button>
              <button
                onClick={() => setIsSend(false)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${!isSend ? 'bg-red-500 text-white' : 'bg-surface-higher'}`}
              >
                Attempt
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="mb-1.5 text-xs font-bold text-white/50">Tries: {attempts}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAttempts((a) => Math.max(1, a - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-higher font-bold"
              >
                -
              </button>
              <span className="w-4 text-center text-sm font-bold">{attempts}</span>
              <button
                onClick={() => setAttempts((a) => a + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-higher font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-white/50">Style Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {CLIMBING_STYLE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                  tags.includes(tag) ? 'bg-orange-500/30 text-orange-300 ring-1 ring-orange-400' : 'bg-surface-higher text-white/60'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-bold text-white/50">Session Date</p>
          <input
            type="date"
            value={new Date(dateMs).toISOString().slice(0, 10)}
            onChange={(e) => setDateMs(new Date(e.target.value + 'T12:00:00').getTime())}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>

        <button onClick={submit} className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold">
          Log Climb
        </button>
      </div>
    </Sheet>
  )
}

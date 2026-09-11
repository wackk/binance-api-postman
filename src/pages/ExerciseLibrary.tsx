import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { EQUIPMENT_TYPES, MUSCLE_GROUPS } from '../data/exercises'
import { equipmentIcon, muscleColor } from '../lib/format'
import Sheet from '../components/Sheet'
import CreateExerciseSheet from '../components/CreateExerciseSheet'
import { useDragScroll } from '../lib/useDragScroll'
import type { Equipment, Exercise } from '../types'

export default function ExerciseLibrary({ mode: _mode }: { mode?: 'browse' }) {
  const navigate = useNavigate()
  const allExercises = useWorkoutStore((s) => s.getAllExercises())
  const addCustomExercise = useWorkoutStore((s) => s.addCustomExercise)
  const [query, setQuery] = useState('')
  const [muscle, setMuscle] = useState<string>('All')
  const [equipmentFilter, setEquipmentFilter] = useState<Set<Equipment>>(new Set())
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const muscleScrollRef = useDragScroll<HTMLDivElement>()

  const filtered = useMemo(() => {
    return allExercises
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
      .filter((e) => muscle === 'All' || e.category === muscle)
      .filter((e) => equipmentFilter.size === 0 || equipmentFilter.has(e.equipment))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allExercises, query, muscle, equipmentFilter])

  const grouped = useMemo(() => {
    const groups: Record<string, Exercise[]> = {}
    for (const e of filtered) {
      const letter = e.name[0].toUpperCase()
      groups[letter] = groups[letter] || []
      groups[letter].push(e)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  function toggleEquipment(eq: Equipment) {
    setEquipmentFilter((prev) => {
      const next = new Set(prev)
      if (next.has(eq)) next.delete(eq)
      else next.add(eq)
      return next
    })
  }

  return (
    <div className="pb-8">
      <div className="px-4 pt-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Exercises</h1>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-accent"
            aria-label="Create exercise"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-surface-raised px-3 py-2.5">
            <Search size={16} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
          <button
            onClick={() => setFilterSheetOpen(true)}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              equipmentFilter.size > 0 ? 'bg-accent' : 'bg-surface-raised text-white/60'
            }`}
            aria-label="Filters"
          >
            <SlidersHorizontal size={16} />
            {equipmentFilter.size > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-accent">
                {equipmentFilter.size}
              </span>
            )}
          </button>
        </div>

        <div
          ref={muscleScrollRef}
          className="no-scrollbar -mx-4 mb-4 flex cursor-grab select-none gap-2 overflow-x-auto px-4 pb-1 active:cursor-grabbing"
        >
          {['All', ...MUSCLE_GROUPS].map((m) => (
            <button
              key={m}
              onClick={() => setMuscle(m)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                muscle === m ? 'bg-accent text-white' : 'bg-surface-raised text-white/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {filtered.length === 0 && <p className="mt-10 text-center text-sm text-white/40">No exercises found.</p>}
        {grouped.map(([letter, list]) => (
          <div key={letter} className="mb-2">
            <p className="sticky top-0 -mx-4 bg-surface px-4 py-1.5 text-xs font-bold text-white/40">{letter}</p>
            <ul className="divide-y divide-surface-border">
              {list.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => navigate(`/exercises/${e.id}`)}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base"
                      style={{ backgroundColor: muscleColor(e.category) + '33' }}
                    >
                      {equipmentIcon(e.equipment)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {e.name}
                        {e.isCustom && <span className="ml-1.5 rounded bg-surface-higher px-1.5 py-0.5 text-[9px] font-bold text-white/40">CUSTOM</span>}
                      </p>
                      <p className="truncate text-xs text-white/40">
                        {e.category} · {e.equipment}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Sheet open={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} title="Filter by Equipment">
        <div className="flex flex-wrap gap-2 p-4">
          {EQUIPMENT_TYPES.map((eq) => (
            <button
              key={eq}
              onClick={() => toggleEquipment(eq)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                equipmentFilter.has(eq) ? 'bg-accent text-white' : 'bg-surface-higher text-white/60'
              }`}
            >
              {equipmentIcon(eq)} {eq}
            </button>
          ))}
        </div>
        {equipmentFilter.size > 0 && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setEquipmentFilter(new Set())}
              className="flex items-center gap-1 text-xs font-semibold text-white/50"
            >
              <X size={12} /> Clear filters
            </button>
          </div>
        )}
      </Sheet>

      <CreateExerciseSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(payload) => {
          const created = addCustomExercise(payload)
          setCreateOpen(false)
          navigate(`/exercises/${created.id}`)
        }}
      />
    </div>
  )
}

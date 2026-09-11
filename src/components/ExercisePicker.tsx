import { useMemo, useState } from 'react'
import { Search, Check, Plus } from 'lucide-react'
import Sheet from './Sheet'
import CreateExerciseSheet from './CreateExerciseSheet'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { MUSCLE_GROUPS } from '../data/exercises'
import { equipmentIcon, muscleColor } from '../lib/format'
import { useDragScroll } from '../lib/useDragScroll'

export default function ExercisePicker({
  open,
  onClose,
  onSelect,
  multi = true,
}: {
  open: boolean
  onClose: () => void
  onSelect: (exerciseIds: string[]) => void
  multi?: boolean
}) {
  const allExercises = useWorkoutStore((s) => s.getAllExercises())
  const addCustomExercise = useWorkoutStore((s) => s.addCustomExercise)
  const [query, setQuery] = useState('')
  const [muscle, setMuscle] = useState<string>('All')
  const [selected, setSelected] = useState<string[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const muscleScrollRef = useDragScroll<HTMLDivElement>()

  const filtered = useMemo(() => {
    return allExercises.filter((e) => {
      const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase())
      const matchesMuscle = muscle === 'All' || e.category === muscle
      return matchesQuery && matchesMuscle
    })
  }, [allExercises, query, muscle])

  function toggle(id: string) {
    if (!multi) {
      onSelect([id])
      setSelected([])
      onClose()
      return
    }
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function confirm() {
    if (selected.length === 0) return
    onSelect(selected)
    setSelected([])
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add Exercise" fullHeight>
      <div className="flex h-full flex-col">
        <div className="shrink-0 space-y-2.5 px-4 pt-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-higher px-3 py-2.5">
            <Search size={16} className="text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
          <div
            ref={muscleScrollRef}
            className="no-scrollbar -mx-4 flex cursor-grab select-none gap-2 overflow-x-auto px-4 pb-1 active:cursor-grabbing"
          >
            {['All', ...MUSCLE_GROUPS].map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(m)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  muscle === m ? 'bg-accent text-white' : 'bg-surface-higher text-white/60'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="mb-1 flex w-full items-center gap-3 border-b border-surface-border py-3 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Plus size={18} />
            </div>
            <p className="text-sm font-semibold text-accent">Create New Exercise</p>
          </button>
          {filtered.length === 0 && (
            <p className="mt-8 text-center text-sm text-white/40">No exercises found.</p>
          )}
          <ul className="divide-y divide-surface-border">
            {filtered.map((e) => {
              const isSelected = selected.includes(e.id)
              return (
                <li key={e.id}>
                  <button
                    onClick={() => toggle(e.id)}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base"
                      style={{ backgroundColor: muscleColor(e.category) + '33' }}
                    >
                      {equipmentIcon(e.equipment)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{e.name}</p>
                      <p className="truncate text-xs text-white/40">
                        {e.category} · {e.equipment}
                      </p>
                    </div>
                    {multi && (
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-accent bg-accent' : 'border-white/30'
                        }`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {multi && (
          <div className="shrink-0 border-t border-surface-border px-4 py-3">
            <button
              onClick={confirm}
              disabled={selected.length === 0}
              className="w-full rounded-xl bg-accent py-3 text-sm font-bold disabled:opacity-40"
            >
              Add {selected.length > 0 ? `${selected.length} Exercise${selected.length > 1 ? 's' : ''}` : 'Exercises'}
            </button>
          </div>
        )}
      </div>

      <CreateExerciseSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          const created = addCustomExercise(payload)
          setCreateOpen(false)
          toggle(created.id)
        }}
      />
    </Sheet>
  )
}

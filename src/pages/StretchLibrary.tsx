import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react'
import { STRETCH_LIBRARY, STRETCH_TARGET_AREAS } from '../data/stretches'
import { stretchAreaColor, stretchEquipmentIcon } from '../lib/format'
import Sheet from '../components/Sheet'
import { useDragScroll } from '../lib/useDragScroll'
import type { Stretch, StretchEquipment } from '../types'

const STRETCH_EQUIPMENT_TYPES: StretchEquipment[] = [
  'None', 'Wall', 'Strap or Towel', 'Foam Roller', 'Chair or Bench', 'Pull-up Bar', 'Other',
]

export default function StretchLibrary() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [area, setArea] = useState<string>('All')
  const [equipmentFilter, setEquipmentFilter] = useState<Set<StretchEquipment>>(new Set())
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const areaScrollRef = useDragScroll<HTMLDivElement>()

  const filtered = useMemo(() => {
    return STRETCH_LIBRARY
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .filter((s) => area === 'All' || s.targetArea === area)
      .filter((s) => equipmentFilter.size === 0 || equipmentFilter.has(s.equipment))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [query, area, equipmentFilter])

  const grouped = useMemo(() => {
    const groups: Record<string, Stretch[]> = {}
    for (const s of filtered) {
      const letter = s.name[0].toUpperCase()
      groups[letter] = groups[letter] || []
      groups[letter].push(s)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  function toggleEquipment(eq: StretchEquipment) {
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
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-extrabold">Stretch Library</h1>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-surface-raised px-3 py-2.5">
            <Search size={16} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stretches"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
          <button
            onClick={() => setFilterSheetOpen(true)}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              equipmentFilter.size > 0 ? 'bg-emerald-500' : 'bg-surface-raised text-white/60'
            }`}
            aria-label="Filters"
          >
            <SlidersHorizontal size={16} />
            {equipmentFilter.size > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-emerald-500">
                {equipmentFilter.size}
              </span>
            )}
          </button>
        </div>

        <div
          ref={areaScrollRef}
          className="no-scrollbar -mx-4 mb-4 flex cursor-grab select-none gap-2 overflow-x-auto px-4 pb-1 active:cursor-grabbing"
        >
          {['All', ...STRETCH_TARGET_AREAS].map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                area === a ? 'bg-emerald-500 text-white' : 'bg-surface-raised text-white/60'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {filtered.length === 0 && <p className="mt-10 text-center text-sm text-white/40">No stretches found.</p>}
        {grouped.map(([letter, list]) => (
          <div key={letter} className="mb-2">
            <p className="sticky top-0 -mx-4 bg-surface px-4 py-1.5 text-xs font-bold text-white/40">{letter}</p>
            <ul className="divide-y divide-surface-border">
              {list.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => navigate(`/stretches/${s.id}`)}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base"
                      style={{ backgroundColor: stretchAreaColor(s.targetArea) + '33' }}
                    >
                      {stretchEquipmentIcon(s.equipment)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="truncate text-xs text-white/40">
                        {s.targetArea} · {s.equipment}
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
          {STRETCH_EQUIPMENT_TYPES.map((eq) => (
            <button
              key={eq}
              onClick={() => toggleEquipment(eq)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                equipmentFilter.has(eq) ? 'bg-emerald-500 text-white' : 'bg-surface-higher text-white/60'
              }`}
            >
              {stretchEquipmentIcon(eq)} {eq}
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
    </div>
  )
}

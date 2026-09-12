import { useMemo, useState } from 'react'
import { Search, Check, Plus } from 'lucide-react'
import Sheet from './Sheet'
import { STRETCH_LIBRARY, STRETCH_TARGET_AREAS } from '../data/stretches'
import { stretchAreaColor, stretchEquipmentIcon } from '../lib/format'
import { useDragScroll } from '../lib/useDragScroll'
import type { MobilityStretch } from '../types'

export default function StretchPicker({
  open,
  onClose,
  onSelect,
  multi = true,
  initialArea = 'All',
  hideIds,
  allowCustom = true,
}: {
  open: boolean
  onClose: () => void
  onSelect: (stretches: MobilityStretch[]) => void
  multi?: boolean
  /** Pre-select this area's filter chip when the sheet opens — e.g. showing only "Hip Flexors" when substituting a hip stretch. */
  initialArea?: string
  /** Stretch ids to hide entirely, such as the one currently being substituted. */
  hideIds?: string[]
  allowCustom?: boolean
}) {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState<string>(initialArea)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [customCount, setCustomCount] = useState(0)
  const areaScrollRef = useDragScroll<HTMLDivElement>()

  const filtered = useMemo(() => {
    return STRETCH_LIBRARY.filter((s) => {
      if (hideIds?.includes(s.id)) return false
      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase())
      const matchesArea = area === 'All' || s.targetArea === area
      return matchesQuery && matchesArea
    })
  }, [query, area, hideIds])

  function reset() {
    setSelectedIds([])
    setCustomCount(0)
    setQuery('')
    setArea(initialArea)
  }

  function toLibraryStretch(id: string): MobilityStretch | undefined {
    const s = STRETCH_LIBRARY.find((x) => x.id === id)
    return s ? { name: s.name, durationSeconds: s.defaultDurationSeconds, targetArea: s.targetArea } : undefined
  }

  function toggle(id: string) {
    if (!multi) {
      const stretch = toLibraryStretch(id)
      if (stretch) onSelect([stretch])
      reset()
      onClose()
      return
    }
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function addCustom() {
    const blank: MobilityStretch = { name: '', durationSeconds: 60, targetArea: 'General' }
    if (!multi) {
      onSelect([blank])
      reset()
      onClose()
      return
    }
    setCustomCount((n) => n + 1)
  }

  function confirm() {
    const libStretches = selectedIds.map(toLibraryStretch).filter((s): s is MobilityStretch => !!s)
    const customStretches: MobilityStretch[] = Array.from({ length: customCount }, () => ({
      name: '',
      durationSeconds: 60,
      targetArea: 'General',
    }))
    const all = [...libStretches, ...customStretches]
    if (all.length === 0) return
    onSelect(all)
    reset()
    onClose()
  }

  const totalSelected = selectedIds.length + customCount

  return (
    <Sheet open={open} onClose={onClose} title="Add Stretch" fullHeight>
      <div className="flex h-full flex-col">
        <div className="shrink-0 space-y-2.5 px-4 pt-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-higher px-3 py-2.5">
            <Search size={16} className="text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stretches"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
          <div
            ref={areaScrollRef}
            className="no-scrollbar -mx-4 flex cursor-grab select-none gap-2 overflow-x-auto px-4 pb-1 active:cursor-grabbing"
          >
            {['All', ...STRETCH_TARGET_AREAS].map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  area === a ? 'bg-emerald-500 text-white' : 'bg-surface-higher text-white/60'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {allowCustom && (
            <button
              onClick={addCustom}
              className="mb-1 flex w-full items-center gap-3 border-b border-surface-border py-3 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
                <Plus size={18} />
              </div>
              <p className="text-sm font-semibold text-emerald-400">Create Custom Stretch</p>
              {customCount > 0 && (
                <span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  +{customCount}
                </span>
              )}
            </button>
          )}
          {filtered.length === 0 && (
            <p className="mt-8 text-center text-sm text-white/40">No stretches found.</p>
          )}
          <ul className="divide-y divide-surface-border">
            {filtered.map((s) => {
              const isSelected = selectedIds.includes(s.id)
              return (
                <li key={s.id}>
                  <button
                    onClick={() => toggle(s.id)}
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
                    {multi && (
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'
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
              disabled={totalSelected === 0}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold disabled:opacity-40"
            >
              Add {totalSelected > 0 ? `${totalSelected} Stretch${totalSelected > 1 ? 'es' : ''}` : 'Stretches'}
            </button>
          </div>
        )}
      </div>
    </Sheet>
  )
}

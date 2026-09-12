import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ListChecks, Timer, Info } from 'lucide-react'
import { STRETCH_LIBRARY } from '../data/stretches'
import { stretchAreaColor, stretchEquipmentIcon, formatClockTime } from '../lib/format'

export default function StretchDetail() {
  const navigate = useNavigate()
  const { stretchId } = useParams()
  const stretch = STRETCH_LIBRARY.find((s) => s.id === stretchId)

  if (!stretch) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-white/50">Stretch not found.</p>
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-emerald-400">Go back</button>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-3 py-2.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center text-white/70">
          <ArrowLeft size={20} />
        </button>
        <span className="truncate text-sm font-bold">{stretch.name}</span>
      </div>

      <div className="px-4">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: stretchAreaColor(stretch.targetArea) + '33' }}
          >
            {stretchEquipmentIcon(stretch.equipment)}
          </div>
          <div>
            <h1 className="text-lg font-extrabold">{stretch.name}</h1>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: stretchAreaColor(stretch.targetArea) + '33', color: stretchAreaColor(stretch.targetArea) }}
              >
                {stretch.targetArea}
              </span>
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-bold text-white/50">
                {stretch.equipment}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-xl bg-surface-raised p-3.5">
          <Timer size={16} className="text-emerald-400" />
          <span className="text-sm font-bold">Hold for {formatClockTime(stretch.defaultDurationSeconds)}</span>
          <span className="text-xs text-white/40">(per side if applicable)</span>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-bold">
            <ListChecks size={15} className="text-emerald-400" /> How To
          </div>
          <ol className="space-y-2.5">
            {stretch.instructions.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-white/70">
                <span className="shrink-0 font-bold text-emerald-400">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {stretch.cue && (
          <div className="flex gap-2.5 rounded-xl bg-emerald-400/10 p-3.5 text-xs text-emerald-200/80">
            <Info size={15} className="mt-0.5 shrink-0 text-emerald-400" />
            <p>{stretch.cue}</p>
          </div>
        )}
      </div>
    </div>
  )
}

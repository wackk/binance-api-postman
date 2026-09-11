import { Trophy, Flame, Medal, Star } from 'lucide-react'
import { useToastStore, type ToastItem } from '../store/useToastStore'
import PRBadge from './PRBadge'

export const CATEGORY_META: Record<NonNullable<ToastItem['category']>, { icon: typeof Flame; color: string }> = {
  streak: { icon: Flame, color: '#FB923C' },
  workouts: { icon: Medal, color: '#4DA1FF' },
  prs: { icon: Star, color: '#A78BFA' },
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const dismissToast = useToastStore((s) => s.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-x-2 top-2 z-40 flex flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          className="pointer-events-auto flex items-center gap-3 rounded-xl bg-surface-higher px-3.5 py-3 text-left shadow-lg shadow-black/30 ring-1 ring-white/10 animate-slide-down"
        >
          <ToastIcon toast={toast} />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold">{toast.title}</p>
            <p className="truncate text-xs text-white/50">{toast.subtitle}</p>
          </div>
          {toast.kind === 'pr' && toast.prTypes && toast.prTypes.length > 0 && (
            <div className="flex shrink-0 gap-1">
              {toast.prTypes.map((t) => (
                <PRBadge key={t} type={t} compact />
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function ToastIcon({ toast }: { toast: ToastItem }) {
  if (toast.kind === 'pr') {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: '#FBBF2426' }}>
        <Trophy size={17} style={{ color: '#FBBF24' }} strokeWidth={2.5} />
      </span>
    )
  }
  const meta = CATEGORY_META[toast.category ?? 'workouts']
  const Icon = meta.icon
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: meta.color + '26' }}>
      <Icon size={17} style={{ color: meta.color }} strokeWidth={2.5} />
    </span>
  )
}

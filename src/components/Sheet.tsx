import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export default function Sheet({
  open,
  onClose,
  title,
  children,
  fullHeight,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  fullHeight?: boolean
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 animate-fade-in"
      />
      <div
        className={`relative z-10 flex flex-col rounded-t-2xl bg-surface-raised animate-slide-up ${
          fullHeight ? 'h-[92%]' : 'max-h-[85%]'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3.5">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-border text-white/70"
          >
            <X size={16} />
          </button>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

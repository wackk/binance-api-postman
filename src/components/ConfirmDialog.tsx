export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  hideCancel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  hideCancel?: boolean
  onConfirm: () => void
  onCancel?: () => void
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-8">
      <button
        aria-label="Dismiss"
        onClick={onCancel ?? onConfirm}
        className="absolute inset-0 bg-black/60 animate-fade-in"
      />
      <div className="relative z-10 w-full max-w-[280px] rounded-2xl bg-surface-higher p-5 text-center shadow-2xl ring-1 ring-white/10 animate-slide-up">
        <p className="text-sm font-bold">{title}</p>
        {message && <p className="mt-1.5 text-xs leading-relaxed text-white/60">{message}</p>}
        <div className="mt-4 flex gap-2">
          {!hideCancel && (
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-surface-border py-2.5 text-xs font-bold text-white/70"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white ${destructive ? 'bg-red-500' : 'bg-accent'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

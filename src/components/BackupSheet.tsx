import { useMemo, useRef, useState } from 'react'
import { Download, Upload, Copy, Check, FileUp } from 'lucide-react'
import Sheet from './Sheet'
import ConfirmDialog from './ConfirmDialog'
import { useWorkoutStore } from '../store/useWorkoutStore'

/**
 * Exports/imports the entire persisted store as JSON. Pulling straight from
 * getState() (JSON.stringify silently drops the function-valued actions)
 * means every field that exists on the store today — and any added later —
 * is included automatically, with no per-field list to maintain here.
 */
function buildExportJson(): string {
  const { restTimer, utilityTimer, ...data } = useWorkoutStore.getState()
  return JSON.stringify(data, null, 2)
}

export default function BackupSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'export' | 'import'>('export')
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [confirmImportOpen, setConfirmImportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportJson = useMemo(() => (open ? buildExportJson() : ''), [open, tab])

  function handleClose() {
    setImportText('')
    setImportError(null)
    setTab('export')
    onClose()
  }

  function downloadFile() {
    const blob = new Blob([exportJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reppy-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(exportJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      textareaRef.current?.select()
    }
  }

  function handleFilePicked(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setImportText(String(reader.result ?? ''))
      setImportError(null)
    }
    reader.readAsText(file)
  }

  function handleImportClick() {
    try {
      const parsed = JSON.parse(importText)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setImportError('That doesn’t look like a Reppy backup file.')
        return
      }
      setImportError(null)
      setConfirmImportOpen(true)
    } catch {
      setImportError('Couldn’t parse that as JSON.')
    }
  }

  function confirmImport() {
    const parsed = JSON.parse(importText)
    useWorkoutStore.setState(parsed)
    setConfirmImportOpen(false)
    handleClose()
  }

  return (
    <Sheet open={open} onClose={handleClose} title="Backup & Restore" fullHeight>
      <div className="flex h-full flex-col">
        <div className="shrink-0 px-4 pt-3">
          <div className="flex rounded-lg bg-surface-higher p-1">
            <button
              onClick={() => setTab('export')}
              className={`flex-1 rounded-md py-2 text-sm font-bold ${tab === 'export' ? 'bg-accent text-white' : 'text-white/50'}`}
            >
              Export
            </button>
            <button
              onClick={() => setTab('import')}
              className={`flex-1 rounded-md py-2 text-sm font-bold ${tab === 'import' ? 'bg-accent text-white' : 'text-white/50'}`}
            >
              Import
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {tab === 'export' ? (
            <>
              <p className="text-xs text-white/50">
                Save all your routines, exercises, workout history, mobility routines and settings as a JSON file, then
                bring it into Reppy on another device to keep everything in sync.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={downloadFile}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold"
                >
                  <Download size={15} /> Download File
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-higher py-3 text-sm font-bold text-white/80"
                >
                  {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>
              <textarea
                ref={textareaRef}
                readOnly
                value={exportJson}
                rows={16}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-lg bg-surface-higher p-3 font-mono text-[10px] leading-relaxed text-white/60 outline-none"
              />
            </>
          ) : (
            <>
              <p className="text-xs text-white/50">
                Paste JSON you copied from Export on another device, or pick a downloaded backup file, then import to
                restore it here. This replaces your current data with the backup.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface-higher py-3 text-sm font-bold text-white/80"
              >
                <FileUp size={15} /> Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFilePicked(file)
                  e.target.value = ''
                }}
              />
              <textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value)
                  setImportError(null)
                }}
                placeholder="Paste backup JSON here..."
                rows={12}
                className="w-full rounded-lg bg-surface-higher p-3 font-mono text-[10px] leading-relaxed outline-none placeholder:text-white/30"
              />
              {importError && <p className="text-xs font-semibold text-red-400">{importError}</p>}
              <button
                onClick={handleImportClick}
                disabled={!importText.trim()}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold disabled:opacity-40"
              >
                <Upload size={15} /> Import & Restore
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmImportOpen}
        title="Restore Backup"
        message="This replaces your current routines, exercises, history, and settings with the contents of this backup. This can't be undone."
        confirmLabel="Restore"
        destructive
        onConfirm={confirmImport}
        onCancel={() => setConfirmImportOpen(false)}
      />
    </Sheet>
  )
}

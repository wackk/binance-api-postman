import { Sparkles } from 'lucide-react'

export default function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised">
        <Sparkles className="text-accent" size={26} />
      </div>
      <h1 className="text-lg font-bold">{title}</h1>
      <p className="text-sm text-white/50">{subtitle}</p>
    </div>
  )
}

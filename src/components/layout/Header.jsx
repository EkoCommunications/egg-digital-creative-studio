import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-[60px] bg-brand-sidebar border-b border-brand-border flex items-center px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-blue">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-brand-text leading-tight">
            Creative Studio
          </h1>
          <p className="text-[11px] text-brand-text-muted leading-tight">
            Powered by AI &middot; Egg Digital
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-xs text-brand-text-muted bg-brand-card px-3 py-1.5 rounded-full border border-brand-border">
          Dynamic Creative Intelligence
        </span>
      </div>
    </header>
  )
}

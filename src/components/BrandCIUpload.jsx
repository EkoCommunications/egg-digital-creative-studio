import { useRef } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function BrandCIUpload() {
  const { brandCIName, setBrandCI, removeBrandCI } = useStore()
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBrandCI(file)
    }
  }

  if (brandCIName) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-brand-border bg-brand-card">
        <div className="p-2 rounded-md bg-brand-accent/10">
          <FileText className="w-5 h-5 text-brand-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-brand-text truncate">
            {brandCIName}
          </p>
          <p className="text-xs text-brand-text-muted">Brand CI Document</p>
        </div>
        <button
          onClick={removeBrandCI}
          className="p-1.5 rounded-md hover:bg-brand-card-hover text-brand-text-muted hover:text-brand-danger transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className={cn(
          'w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-brand-border',
          'hover:border-brand-accent/50 hover:bg-brand-card-hover/50 transition-all duration-200 cursor-pointer'
        )}
      >
        <div className="p-2 rounded-md bg-brand-card">
          <Upload className="w-5 h-5 text-brand-text-muted" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-brand-text">Upload Brand CI</p>
          <p className="text-xs text-brand-text-muted">PDF format (optional)</p>
        </div>
      </button>
    </div>
  )
}

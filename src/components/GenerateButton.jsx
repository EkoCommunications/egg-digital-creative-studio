import { Loader2, Sparkles } from 'lucide-react'
import useStore from '@/store/useStore'
import useGeneration from '@/hooks/useGeneration'
import { cn } from '@/lib/utils'

export default function GenerateButton() {
  const { referenceImage, selectedSegments, isGenerating } = useStore()
  const { generate } = useGeneration()

  const isDisabled = !referenceImage || selectedSegments.length === 0 || isGenerating

  // Build tooltip message for disabled state
  let tooltipMessage = ''
  if (!referenceImage && selectedSegments.length === 0) {
    tooltipMessage = 'Upload a reference image and select at least one segment to generate'
  } else if (!referenceImage) {
    tooltipMessage = 'Upload a reference image to generate'
  } else if (selectedSegments.length === 0) {
    tooltipMessage = 'Select at least one target segment to generate'
  }

  return (
    <div className="relative group">
      <button
        onClick={generate}
        disabled={isDisabled}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-semibold text-base transition-all duration-200 cursor-pointer',
          'gradient-btn text-white',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Creatives</span>
          </>
        )}
      </button>
      {/* Tooltip for disabled state */}
      {isDisabled && !isGenerating && tooltipMessage && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-xs text-brand-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-50">
          {tooltipMessage}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-brand-border" />
        </div>
      )}
    </div>
  )
}

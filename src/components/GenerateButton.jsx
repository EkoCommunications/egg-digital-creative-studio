import { Loader2, Sparkles } from 'lucide-react'
import useStore from '@/store/useStore'
import useGeneration from '@/hooks/useGeneration'
import { cn } from '@/lib/utils'

export default function GenerateButton() {
  const { referenceImage, selectedSegments, isGenerating } = useStore()
  const { generate } = useGeneration()

  const isDisabled = !referenceImage || selectedSegments.length === 0 || isGenerating

  return (
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
  )
}

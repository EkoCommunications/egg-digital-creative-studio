import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import useStore from '@/store/useStore'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export default function ProgressIndicator() {
  const { generationProgress, segments, selectedSegments, isGenerating } = useStore()

  if (!isGenerating && Object.keys(generationProgress).length === 0) return null

  const selectedSegmentDetails = segments.filter((s) =>
    selectedSegments.includes(s.id)
  )

  const totalSegments = selectedSegmentDetails.length
  const completedCount = Object.values(generationProgress).filter(
    (s) => s === 'completed' || s === 'success' || s === 'failed' || s === 'error'
  ).length
  const progressPercent = totalSegments > 0 ? (completedCount / totalSegments) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brand-text">Generation Progress</span>
        <span className="text-xs text-brand-text-muted">
          {completedCount}/{totalSegments}
        </span>
      </div>
      <Progress value={progressPercent} />

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {selectedSegmentDetails.map((segment) => {
          const status = generationProgress[segment.id]
          return (
            <div
              key={segment.id}
              className="flex items-center gap-2 text-sm"
            >
              {status === 'completed' || status === 'success' ? (
                <CheckCircle className="w-4 h-4 text-brand-success shrink-0" />
              ) : status === 'failed' || status === 'error' ? (
                <XCircle className="w-4 h-4 text-brand-danger shrink-0" />
              ) : status === 'generating' ? (
                <Loader2 className="w-4 h-4 text-brand-accent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-brand-border shrink-0" />
              )}
              <span className={cn(
                'truncate',
                status === 'completed' || status === 'success'
                  ? 'text-brand-success'
                  : status === 'failed' || status === 'error'
                  ? 'text-brand-danger'
                  : status === 'generating'
                  ? 'text-brand-accent'
                  : 'text-brand-text-muted'
              )}>
                {segment.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

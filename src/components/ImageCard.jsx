import { Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import CIValidationBadge from '@/components/CIValidationBadge'

export default function ImageCard({ result }) {
  const {
    segment_id,
    segment_name,
    image_base64,
    image_mime,
    status,
    error,
  } = result

  const imageUrl = image_base64
    ? `data:${image_mime || 'image/png'};base64,${image_base64}`
    : null

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `creative-${segment_name?.replace(/\s+/g, '_').toLowerCase() || 'image'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isSuccess = status === 'success' || status === 'completed'
  const isFailed = status === 'failed' || status === 'error'

  return (
    <div className={cn(
      'group relative rounded-lg border overflow-hidden transition-all duration-300',
      'hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-accent/10',
      isSuccess ? 'border-brand-border' : 'border-brand-danger/50',
      'bg-brand-card'
    )}>
      {/* Image */}
      <div className="relative aspect-square bg-brand-bg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`AI-generated creative for ${segment_name} segment`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isFailed ? (
              <div className="text-center p-4">
                <AlertCircle className="w-8 h-8 text-brand-danger mx-auto mb-2" />
                <p className="text-xs text-brand-text-muted">
                  {error || 'Generation failed'}
                </p>
              </div>
            ) : (
              <div className="skeleton-shimmer w-full h-full" />
            )}
          </div>
        )}

        {/* Download overlay */}
        {imageUrl && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleDownload}
              className="p-3 bg-brand-accent rounded-full text-brand-bg hover:bg-brand-accent/80 transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-brand-text truncate">
              {segment_name}
            </p>
          </div>
          <div className="ml-2 shrink-0">
            {isSuccess ? (
              <CheckCircle className="w-4 h-4 text-brand-success" />
            ) : isFailed ? (
              <XCircle className="w-4 h-4 text-brand-danger" />
            ) : null}
          </div>
        </div>
        {/* Brand CI Validation Score */}
        {isSuccess && segment_id && (
          <CIValidationBadge segmentId={segment_id} compact />
        )}
      </div>
    </div>
  )
}

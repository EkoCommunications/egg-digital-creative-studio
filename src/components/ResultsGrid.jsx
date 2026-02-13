import { ImageIcon } from 'lucide-react'
import useStore from '@/store/useStore'
import ImageCard from '@/components/ImageCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function ResultsGrid() {
  const { results, isGenerating, selectedSegments, segments } = useStore()

  // Loading skeletons during generation
  if (isGenerating && results.length === 0) {
    const selectedDetails = segments.filter((s) => selectedSegments.includes(s.id))
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedDetails.map((segment) => (
          <div key={segment.id} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="p-6 rounded-full bg-brand-card mb-6">
          <ImageIcon className="w-12 h-12 text-brand-text-muted" />
        </div>
        <h3 className="text-xl font-semibold text-brand-text mb-2">
          No creatives yet
        </h3>
        <p className="text-brand-text-muted max-w-md">
          Upload a reference image and select target segments to generate
          AI-powered creative variations for each audience.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {results.map((result, index) => (
        <ImageCard key={`${result.segment_id || index}`} result={result} />
      ))}
    </div>
  )
}

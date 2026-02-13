import { useEffect } from 'react'
import { Users, Loader2 } from 'lucide-react'
import useStore from '@/store/useStore'
import { fetchSegments } from '@/api/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function SegmentSelector() {
  const {
    segments,
    segmentsLoading,
    selectedSegments,
    toggleSegment,
    selectAllSegments,
    deselectAllSegments,
    setSegments,
    setError,
  } = useStore()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchSegments()
        if (!cancelled) {
          setSegments(data.segments || data || [])
        }
      } catch (err) {
        console.error('Failed to fetch segments:', err)
        if (!cancelled) {
          // Use fallback segments for demo
          setSegments([
            { id: 'young_professionals', name: 'Young Professionals', age_range: '25-34', description: 'Career-focused millennials' },
            { id: 'gen_z', name: 'Gen Z', age_range: '18-24', description: 'Digital natives' },
            { id: 'families', name: 'Families', age_range: '30-45', description: 'Parents with children' },
            { id: 'seniors', name: 'Active Seniors', age_range: '55-70', description: 'Active lifestyle seniors' },
            { id: 'students', name: 'Students', age_range: '18-22', description: 'University students' },
            { id: 'executives', name: 'Executives', age_range: '35-55', description: 'C-suite and management' },
          ])
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [setSegments, setError])

  if (segmentsLoading) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={selectAllSegments}
          className="text-xs text-brand-accent hover:text-brand-accent"
        >
          Select All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={deselectAllSegments}
          className="text-xs text-brand-text-muted"
        >
          Deselect All
        </Button>
        <span className="ml-auto text-xs text-brand-text-muted">
          {selectedSegments.length}/{segments.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment) => {
          const isSelected = selectedSegments.includes(segment.id)
          return (
            <button
              key={segment.id}
              onClick={() => toggleSegment(segment.id)}
              className={cn(
                'flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-brand-accent bg-brand-accent/10 shadow-[0_0_12px_rgba(0,212,170,0.15)]'
                  : 'border-brand-border bg-brand-card hover:bg-brand-card-hover hover:border-brand-border'
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <Users className={cn(
                  'w-3.5 h-3.5 shrink-0',
                  isSelected ? 'text-brand-accent' : 'text-brand-text-muted'
                )} />
                <span className={cn(
                  'text-sm font-medium truncate',
                  isSelected ? 'text-brand-accent' : 'text-brand-text'
                )}>
                  {segment.name}
                </span>
              </div>
              {segment.age_range && (
                <span className="text-xs text-brand-text-muted mt-1 ml-5.5">
                  {segment.age_range}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

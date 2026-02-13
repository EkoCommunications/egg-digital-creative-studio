import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

const ratios = [
  {
    value: 'auto',
    label: 'Auto',
    sublabel: 'Original',
    width: 20,
    height: 16,
  },
  {
    value: '1:1',
    label: '1:1',
    sublabel: 'Square',
    width: 18,
    height: 18,
  },
  {
    value: '16:9',
    label: '16:9',
    sublabel: 'Landscape',
    width: 24,
    height: 14,
  },
  {
    value: '9:16',
    label: '9:16',
    sublabel: 'Portrait',
    width: 14,
    height: 24,
  },
]

export default function AspectRatioSelector() {
  const { aspectRatio, setAspectRatio } = useStore()

  return (
    <div className="grid grid-cols-4 gap-2">
      {ratios.map((ratio) => {
        const isActive = aspectRatio === ratio.value
        return (
          <button
            key={ratio.value}
            onClick={() => setAspectRatio(ratio.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer',
              isActive
                ? 'border-brand-accent bg-brand-accent/10'
                : 'border-brand-border bg-brand-card hover:bg-brand-card-hover'
            )}
          >
            <div className="flex items-center justify-center h-8">
              <div
                className={cn(
                  'border-2 rounded-sm',
                  isActive ? 'border-brand-accent' : 'border-brand-text-muted'
                )}
                style={{
                  width: `${ratio.width}px`,
                  height: `${ratio.height}px`,
                }}
              />
            </div>
            <div className="text-center">
              <p className={cn(
                'text-xs font-semibold',
                isActive ? 'text-brand-accent' : 'text-brand-text'
              )}>
                {ratio.label}
              </p>
              <p className="text-[10px] text-brand-text-muted">{ratio.sublabel}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

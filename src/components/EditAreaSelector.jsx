import { User, ImageIcon, Type } from 'lucide-react'
import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

const areas = [
  {
    value: 'actor',
    label: 'Actor',
    icon: User,
  },
  {
    value: 'background',
    label: 'Background',
    icon: ImageIcon,
  },
  {
    value: 'text',
    label: 'Text',
    icon: Type,
  },
]

export default function EditAreaSelector() {
  const { editAreas, toggleEditArea } = useStore()

  return (
    <div className="flex gap-2">
      {areas.map((area) => {
        const isActive = editAreas.includes(area.value)
        const Icon = area.icon
        return (
          <button
            key={area.value}
            onClick={() => toggleEditArea(area.value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer',
              isActive
                ? 'border-brand-accent bg-brand-accent/15 text-brand-accent'
                : 'border-brand-border bg-brand-card text-brand-text-muted hover:bg-brand-card-hover'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{area.label}</span>
          </button>
        )
      })}
    </div>
  )
}

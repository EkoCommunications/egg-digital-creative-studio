import ImageUpload from '@/components/ImageUpload'
import BrandCIUpload from '@/components/BrandCIUpload'
import SegmentSelector from '@/components/SegmentSelector'
import AspectRatioSelector from '@/components/AspectRatioSelector'
import EditAreaSelector from '@/components/EditAreaSelector'
import GenerateButton from '@/components/GenerateButton'
import ProgressIndicator from '@/components/ProgressIndicator'
import { Separator } from '@/components/ui/separator'

function SectionLabel({ children }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-3">
      {children}
    </h3>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-[380px] shrink-0 bg-brand-sidebar border-r border-brand-border flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Reference Image */}
        <section>
          <SectionLabel>Reference Image</SectionLabel>
          <ImageUpload />
        </section>

        <Separator />

        {/* Brand CI */}
        <section>
          <SectionLabel>Brand CI</SectionLabel>
          <BrandCIUpload />
        </section>

        <Separator />

        {/* Target Segments */}
        <section>
          <SectionLabel>Target Segments</SectionLabel>
          <SegmentSelector />
        </section>

        <Separator />

        {/* Aspect Ratio */}
        <section>
          <SectionLabel>Aspect Ratio</SectionLabel>
          <AspectRatioSelector />
        </section>

        <Separator />

        {/* Edit Areas */}
        <section>
          <SectionLabel>Edit Areas</SectionLabel>
          <EditAreaSelector />
        </section>

        <Separator />

        {/* Progress */}
        <ProgressIndicator />
      </div>

      {/* Generate Button - Fixed at bottom */}
      <div className="p-5 border-t border-brand-border bg-brand-sidebar">
        <GenerateButton />
      </div>
    </aside>
  )
}

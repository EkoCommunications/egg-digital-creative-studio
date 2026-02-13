import { Download, Clock, ImageIcon } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import useStore from '@/store/useStore'
import ResultsGrid from '@/components/ResultsGrid'
import { Button } from '@/components/ui/button'

export default function MainContent() {
  const { results, generationTime, isGenerating, error } = useStore()

  const successResults = results.filter(
    (r) => (r.status === 'success' || r.status === 'completed') && r.image_base64
  )

  const handleDownloadAll = async () => {
    if (successResults.length === 0) return

    const zip = new JSZip()
    const folder = zip.folder('creatives')

    successResults.forEach((result, idx) => {
      const ext = result.image_mime?.includes('png') ? 'png' : 'jpg'
      const name = `${result.segment_name?.replace(/\s+/g, '_').toLowerCase() || `creative_${idx}`}.${ext}`
      folder.file(name, result.image_base64, { base64: true })
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'creatives.zip')
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg">
      {/* Results header bar */}
      {(results.length > 0 || isGenerating) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-brand-text">Results</h2>
            {results.length > 0 && (
              <span className="text-sm text-brand-text-muted flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                {successResults.length} creative{successResults.length !== 1 ? 's' : ''} generated
              </span>
            )}
            {generationTime && (
              <span className="text-sm text-brand-text-muted flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {generationTime}s
              </span>
            )}
          </div>

          {successResults.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </Button>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 p-4 rounded-lg bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-sm">
          {error}
        </div>
      )}

      {/* Results content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ResultsGrid />
      </div>
    </main>
  )
}

import { useState } from 'react'
import { Download, Clock, ImageIcon, X, AlertTriangle, Type } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import useStore from '@/store/useStore'
import ResultsGrid from '@/components/ResultsGrid'
import TextEditor from '@/components/TextEditor'
import { Button } from '@/components/ui/button'

export default function MainContent() {
  const { results, generationTime, isGenerating, error, setError } = useStore()
  const [showTextEditor, setShowTextEditor] = useState(false)

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

          <div className="flex items-center gap-2">
            {successResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTextEditor(!showTextEditor)}
                className="gap-2"
              >
                <Type className="w-4 h-4" />
                {showTextEditor ? 'Hide' : 'Edit'} Text
              </Button>
            )}
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
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 p-4 rounded-lg bg-brand-danger/10 border border-brand-danger/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-brand-danger shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-brand-danger">Generation Failed</p>
            <p className="text-sm text-brand-danger/80 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 rounded-md hover:bg-brand-danger/20 text-brand-danger shrink-0 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ResultsGrid />
      </div>

      {/* Text Editor Toolbar */}
      <TextEditor
        isVisible={showTextEditor}
        onClose={() => setShowTextEditor(false)}
      />
    </main>
  )
}

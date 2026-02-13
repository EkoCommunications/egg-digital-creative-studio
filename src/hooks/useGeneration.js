import { useCallback } from 'react'
import useStore from '@/store/useStore'
import { generateImages } from '@/api/client'

export default function useGeneration() {
  const {
    referenceImage,
    brandCI,
    selectedSegments,
    segments,
    aspectRatio,
    editAreas,
    isGenerating,
    setIsGenerating,
    setResults,
    setError,
    setGenerationTime,
    updateProgress,
    clearProgress,
  } = useStore()

  const generate = useCallback(async () => {
    if (!referenceImage || selectedSegments.length === 0 || isGenerating) return

    setIsGenerating(true)
    setError(null)
    setResults([])
    clearProgress()

    const startTime = Date.now()

    // Set all selected segments to 'generating' status
    selectedSegments.forEach((segId) => {
      updateProgress(segId, 'generating')
    })

    // Build segment details for API
    const segmentDetails = segments
      .filter((s) => selectedSegments.includes(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        age_range: s.age_range,
        description: s.description,
      }))

    try {
      const response = await generateImages({
        referenceImage,
        brandCI,
        segments: segmentDetails,
        aspectRatio,
        editAreas,
      })

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      setGenerationTime(elapsed)

      // Process results
      const results = response.results || response || []
      setResults(results)

      // Update progress for each result
      results.forEach((result) => {
        const segId = result.segment_id
        if (segId) {
          const status = result.status === 'success' || result.status === 'completed'
            ? 'completed'
            : 'failed'
          updateProgress(segId, status)
        }
      })
    } catch (err) {
      console.error('Generation failed:', err)
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Generation failed. Please try again.'
      setError(message)

      // Mark all as failed
      selectedSegments.forEach((segId) => {
        updateProgress(segId, 'failed')
      })
    } finally {
      setIsGenerating(false)
    }
  }, [
    referenceImage,
    brandCI,
    selectedSegments,
    segments,
    aspectRatio,
    editAreas,
    isGenerating,
    setIsGenerating,
    setResults,
    setError,
    setGenerationTime,
    updateProgress,
    clearProgress,
  ])

  return { generate, isGenerating }
}

import { useCallback } from 'react'
import useStore from '@/store/useStore'
import { generateImages } from '@/api/client'

export default function useGeneration() {
  const {
    referenceImage,
    brandCI,
    selectedSegments,
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

    // Send only segment ID strings to the API (not full objects)
    const segmentIds = selectedSegments

    try {
      const response = await generateImages({
        referenceImage,
        brandCI,
        segments: segmentIds,
        aspectRatio,
        editAreas,
      })

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      setGenerationTime(elapsed)

      // Process results and errors
      const successResults = response.results || []
      const errorResults = response.errors || []
      const allResults = [...successResults, ...errorResults]
      setResults(allResults)

      // Update progress for each result
      allResults.forEach((result) => {
        const segId = result.segment_id
        if (segId) {
          const status = result.status === 'success' || result.status === 'completed'
            ? 'completed'
            : 'failed'
          updateProgress(segId, status)
        }
      })

      // Show partial error message if some segments failed
      if (errorResults.length > 0 && successResults.length > 0) {
        setError(`${errorResults.length} of ${allResults.length} creatives failed to generate. Successfully generated ${successResults.length}.`)
      } else if (errorResults.length > 0 && successResults.length === 0) {
        setError('All creatives failed to generate. Please try again or check the AI service status.')
      }
    } catch (err) {
      console.error('Generation failed:', err)
      let message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Generation failed. Please try again.'

      // Sanitize raw Python/technical error messages for end users
      if (message.includes("Invalid segment ID") || message.includes("Must be a string")) {
        message = 'Failed to process segments. Please try again or refresh the page.'
      } else if (message.includes("GOOGLE_AI_STUDIO_API_KEY")) {
        message = 'AI service is not configured. Please contact the administrator.'
      } else if (message.includes("Gemini API error")) {
        message = 'The AI image generation service encountered an error. Please try again.'
      } else if (message.length > 200) {
        message = 'Generation failed due to a server error. Please try again.'
      }
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

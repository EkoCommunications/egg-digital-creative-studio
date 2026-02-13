import { create } from 'zustand'

const initialState = {
  referenceImage: null,
  referenceImagePreview: null,
  brandCI: null,
  brandCIName: null,
  selectedSegments: [],
  aspectRatio: 'auto',
  editAreas: ['actor', 'background', 'text'],
  segments: [],
  segmentsLoading: true,
  isGenerating: false,
  generationProgress: {},
  results: [],
  error: null,
  generationTime: null,
}

const useStore = create((set, get) => ({
  ...initialState,

  setReferenceImage: (file) => {
    if (!file) {
      set({ referenceImage: null, referenceImagePreview: null })
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      set({ referenceImage: file, referenceImagePreview: reader.result })
    }
    reader.readAsDataURL(file)
  },

  removeReferenceImage: () => {
    set({ referenceImage: null, referenceImagePreview: null })
  },

  setBrandCI: (file) => {
    set({ brandCI: file, brandCIName: file?.name || null })
  },

  removeBrandCI: () => {
    set({ brandCI: null, brandCIName: null })
  },

  toggleSegment: (id) => {
    const { selectedSegments } = get()
    if (selectedSegments.includes(id)) {
      set({ selectedSegments: selectedSegments.filter((s) => s !== id) })
    } else {
      set({ selectedSegments: [...selectedSegments, id] })
    }
  },

  selectAllSegments: () => {
    const { segments } = get()
    set({ selectedSegments: segments.map((s) => s.id) })
  },

  deselectAllSegments: () => {
    set({ selectedSegments: [] })
  },

  setAspectRatio: (ratio) => {
    set({ aspectRatio: ratio })
  },

  toggleEditArea: (area) => {
    const { editAreas } = get()
    if (editAreas.includes(area)) {
      if (editAreas.length === 1) return // Must have at least one
      set({ editAreas: editAreas.filter((a) => a !== area) })
    } else {
      set({ editAreas: [...editAreas, area] })
    }
  },

  setSegments: (segments) => {
    set({ segments, segmentsLoading: false })
  },

  setResults: (results) => {
    set({ results })
  },

  setIsGenerating: (val) => {
    set({ isGenerating: val })
  },

  setError: (err) => {
    set({ error: err })
  },

  setGenerationTime: (time) => {
    set({ generationTime: time })
  },

  updateProgress: (segmentId, status) => {
    set((state) => ({
      generationProgress: {
        ...state.generationProgress,
        [segmentId]: status,
      },
    }))
  },

  clearProgress: () => {
    set({ generationProgress: {} })
  },

  reset: () => {
    set(initialState)
  },
}))

export default useStore

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 minutes for generation
  headers: {
    'Content-Type': 'application/json',
  },
})

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // reader.result is "data:<mime>;base64,<data>"
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function fetchSegments() {
  const response = await api.get('/segments')
  return response.data
}

export async function generateImages({
  referenceImage,
  brandCI,
  segments,
  aspectRatio,
  editAreas,
}) {
  const referenceBase64 = await fileToBase64(referenceImage)

  const payload = {
    reference_image_base64: referenceBase64,
    reference_image_mime: referenceImage.type,
    segments,
    aspect_ratio: aspectRatio,
    edit_areas: editAreas,
  }

  if (brandCI) {
    payload.brand_ci_base64 = await fileToBase64(brandCI)
  }

  const response = await api.post('/generate', payload)
  return response.data
}

export async function fetchHistory() {
  const response = await api.get('/history')
  return response.data
}

export default api

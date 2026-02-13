import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, ImageIcon } from 'lucide-react'
import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function ImageUpload() {
  const { referenceImagePreview, setReferenceImage, removeReferenceImage } = useStore()

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setReferenceImage(acceptedFiles[0])
      }
    },
    [setReferenceImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  })

  if (referenceImagePreview) {
    return (
      <div className="relative group">
        <div className="relative rounded-lg overflow-hidden border border-brand-border">
          <img
            src={referenceImagePreview}
            alt="Reference"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeReferenceImage()
              }}
              className="p-2 bg-brand-danger rounded-full text-white hover:bg-brand-danger/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-brand-text-muted mt-2 text-center">
          Click the image to replace
        </p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
        isDragActive
          ? 'border-brand-accent bg-brand-accent/10'
          : 'border-brand-border hover:border-brand-accent/50 hover:bg-brand-card-hover/50'
      )}
    >
      <input {...getInputProps()} aria-label="Upload reference image" />
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 rounded-full bg-brand-card">
          {isDragActive ? (
            <ImageIcon className="w-8 h-8 text-brand-accent" />
          ) : (
            <Upload className="w-8 h-8 text-brand-text-muted" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-brand-text">
            {isDragActive ? 'Drop your image here' : 'Drop your reference image here'}
          </p>
          <p className="text-xs text-brand-text-muted mt-1">
            PNG, JPG up to 10MB
          </p>
        </div>
      </div>
    </div>
  )
}

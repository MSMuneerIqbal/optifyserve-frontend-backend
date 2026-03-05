/**
 * Photo Upload Component (Before/After)
 * Phase 11: Jobs/Service Management Module
 */

import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, X, Image as ImageIcon } from 'lucide-react'

interface PhotoUploadProps {
  label: string
  category: 'before' | 'after'
  photos: { id: string; url: string; caption?: string }[]
  onAdd: (file: File, caption?: string) => void
  onRemove: (id: string) => void
  maxPhotos?: number
}

export function PhotoUpload({ label, photos, onAdd, onRemove, maxPhotos = 5 }: PhotoUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && photos.length < maxPhotos) {
        onAdd(file)
      }
    })
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && photos.length < maxPhotos) {
        onAdd(file)
      }
    })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        capture="environment"
      />

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map(photo => (
            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <button
                type="button"
                className="absolute top-1 end-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(photo.id)}
              >
                <X className="h-3 w-3" />
              </button>
              {photo.caption && (
                <p className="absolute bottom-0 start-0 end-0 bg-black/50 text-white text-xs p-1 truncate">
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {photos.length < maxPhotos && (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary/70 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/70'
          }`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
        >
          <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">
            <span className="hidden sm:inline">{t('jobs.clickOrDragPhotos')}</span>
            <span className="sm:hidden">{t('jobs.tapToUploadPhoto')}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {photos.length}/{maxPhotos} {t('jobs.photos')}
          </p>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload

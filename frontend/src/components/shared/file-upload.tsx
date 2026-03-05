import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, generateId, formatFileSize } from '@/lib/utils'
import type { Attachment } from '@/types/common.types'

interface FileUploadProps {
  value: Attachment[]
  onChange: (files: Attachment[]) => void
  accept?: string
  maxFiles?: number
  maxSizeMB?: number
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept,
  maxFiles = 5,
  maxSizeMB = 10,
  className,
}: FileUploadProps) {
  const { t } = useTranslation()
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return

      const newFiles: Attachment[] = []
      const maxBytes = maxSizeMB * 1024 * 1024

      for (let i = 0; i < fileList.length; i++) {
        if (value.length + newFiles.length >= maxFiles) break
        const file = fileList[i]
        if (file.size > maxBytes) continue

        newFiles.push({
          id: generateId(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        })
      }

      if (newFiles.length > 0) {
        onChange([...value, ...newFiles])
      }
    },
    [value, onChange, maxFiles, maxSizeMB]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      e.target.value = ''
    },
    [handleFiles]
  )

  const removeFile = useCallback(
    (id: string) => {
      onChange(value.filter((f) => f.id !== id))
    },
    [value, onChange]
  )

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          value.length >= maxFiles && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={value.length >= maxFiles}
        />
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">{t('common.dragDropFiles')}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('common.maxFileSize', { size: maxSizeMB })} &middot; {t('common.maxFiles', { count: maxFiles })}
        </p>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

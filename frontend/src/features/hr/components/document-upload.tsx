/**
 * Document Upload Component
 * Phase 10: HR Module
 */

import { useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, FileText, X } from 'lucide-react'
import { DOCUMENT_TYPES } from '../types/document.types'
import type { DocumentTypeId } from '../types/document.types'

function createUploadSchema(t: (key: string) => string) {
  return z.object({
    employeeId: z.string().min(1, t('validation.employeeRequired')),
    documentTypeId: z.string().min(1, t('validation.documentTypeRequired')),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    notes: z.string().optional(),
  })
}

interface DocumentUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: {
    employeeId: string
    documentTypeId: DocumentTypeId
    issueDate?: string
    expiryDate?: string
    notes?: string
    file: File
  }) => void
  isUploading: boolean
  employees: { id: string; name: string }[]
}

export function DocumentUpload({ isOpen, onClose, onUpload, isUploading, employees }: DocumentUploadProps) {
  const { t } = useTranslation()
  const uploadSchema = useMemo(() => createUploadSchema(t), [t])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<ReturnType<typeof createUploadSchema>>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { employeeId: '', documentTypeId: '', issueDate: '', expiryDate: '', notes: '' },
  })

  const selectedType = DOCUMENT_TYPES.find((dt) => dt.id === form.watch('documentTypeId'))
  const selectedEmployee = employees.find((e) => e.id === form.watch('employeeId'))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setFileError(t('hr.fileSizeTooLarge'))
      return
    }

    // Validate file format if document type is selected
    if (selectedType) {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!selectedType.allowedFormats.includes(ext)) {
        setFileError(`${t('hr.onlyFormatsAllowed')}: ${selectedType.allowedFormats.join(', ').toUpperCase()}`)
        return
      }
    }

    setFileError(null)
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError(t('hr.fileSizeTooLarge'))
        return
      }
      setFileError(null)
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (data: z.infer<ReturnType<typeof createUploadSchema>>) => {
    if (!selectedFile) {
      setFileError(t('hr.pleaseSelectFile'))
      return
    }
    onUpload({
      employeeId: data.employeeId,
      documentTypeId: data.documentTypeId as DocumentTypeId,
      issueDate: data.issueDate || undefined,
      expiryDate: data.expiryDate || undefined,
      notes: data.notes || undefined,
      file: selectedFile,
    })
    // Reset after upload
    setSelectedFile(null)
    setFileError(null)
    form.reset()
  }

  const handleClose = () => {
    setSelectedFile(null)
    setFileError(null)
    form.reset()
    onClose()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('hr.uploadDocument')}</DialogTitle>
          {selectedEmployee && (
            <p className="text-sm text-muted-foreground">{t('hr.for')}: {selectedEmployee.name}</p>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Employee selector */}
            <FormField control={form.control} name="employeeId" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hr.employee')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder={t('hr.selectEmployee')} /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Document type */}
            <FormField control={form.control} name="documentTypeId" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hr.documentType')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder={t('hr.selectDocumentType')} /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedType && (
                  <p className="text-xs text-muted-foreground">{selectedType.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )} />

            {/* File upload area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={selectedType
                  ? selectedType.allowedFormats.map((f) => `.${f}`).join(',')
                  : '.pdf,.jpg,.jpeg,.png,.doc,.docx'}
                onChange={handleFileChange}
              />

              {selectedFile ? (
                // Show selected file
                <div className="border rounded-lg p-4 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                // Drop zone
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/70 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">{t('hr.clickToUploadOrDrag')}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedType
                      ? `${t('hr.allowed')}: ${selectedType.allowedFormats.join(', ').toUpperCase()} | ${t('hr.max')} ${selectedType.maxFiles} ${t('hr.files')}`
                      : `PDF, JPG, PNG ${t('hr.upTo')} 10MB`}
                  </p>
                </div>
              )}

              {fileError && (
                <p className="text-sm text-red-600 mt-1">{fileError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="issueDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('hr.issueDate')}</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {selectedType?.hasExpiry && (
                <FormField control={form.control} name="expiryDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.expiry')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hr.notes')}</FormLabel>
                <FormControl><Textarea {...field} rows={2} placeholder={t('hr.optionalNotes')} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isUploading || !selectedFile}>
                {isUploading ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Upload className="h-4 w-4 me-2" />}
                {t('hr.upload')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentUpload

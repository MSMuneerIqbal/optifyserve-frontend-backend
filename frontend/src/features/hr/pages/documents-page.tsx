/**
 * Documents Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { DocumentList } from '../components/document-list'
import { DocumentUpload } from '../components/document-upload'
import { DocumentExpiryAlerts } from '../components/document-expiry-alerts'
import { sampleDocuments, sampleDocumentExpiryAlerts, sampleEmployees } from '@/data/employees.data'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EmployeeDocument, DocumentVerificationStatus, DocumentTypeId } from '../types/document.types'

export function DocumentsPage() {
  const { t } = useTranslation()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [viewingDoc, setViewingDoc] = useState<EmployeeDocument | null>(null)

  const isLoading = false
  const isLoadingAlerts = false
  const isUploading = false

  const documents = sampleDocuments
  const expiryAlerts = sampleDocumentExpiryAlerts
  const employees = sampleEmployees.map((e) => ({ id: e.id, name: e.fullName }))

  const handleUpload = (_data: {
    employeeId: string
    documentTypeId: DocumentTypeId
    issueDate?: string
    expiryDate?: string
    notes?: string
    file: File
  }) => {
    toast.success(t('hr.documentUploaded'))
    setIsUploadOpen(false)
  }

  const handleVerify = (_doc: EmployeeDocument, _status: DocumentVerificationStatus) => {
    toast.success(t('hr.verificationUpdated'))
  }

  const handleDelete = (_doc: EmployeeDocument) => {
    toast.success(t('hr.documentDeleted'))
  }

  const handleView = (doc: EmployeeDocument) => {
    setViewingDoc(doc)
  }

  const handleDownload = (doc: EmployeeDocument) => {
    toast.info(t('hr.downloadStarted'), { description: `${t('hr.downloading')} ${doc.fileName}...` })
    const blob = new Blob([`Mock content for ${doc.fileName}`], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title={t('hr.documentsTitle')} description={t('hr.documentsDescription')} />

      {/* Expiry Alerts */}
      <DocumentExpiryAlerts alerts={expiryAlerts} isLoading={isLoadingAlerts} />

      {/* Document List */}
      <DocumentList
        documents={documents}
        isLoading={isLoading}
        onUpload={() => setIsUploadOpen(true)}
        onView={handleView}
        onDownload={handleDownload}
        onVerify={handleVerify}
        onDelete={handleDelete}
        isManager={true}
      />

      {/* Upload Dialog */}
      <DocumentUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
        employees={employees}
      />

      {/* View Document Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingDoc?.documentTypeName}</DialogTitle>
          </DialogHeader>
          {viewingDoc && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('hr.employee')}</p>
                  <p className="font-medium">{viewingDoc.employeeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('hr.documentType')}</p>
                  <p className="font-medium">{viewingDoc.documentTypeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('hr.fileName')}</p>
                  <p className="font-medium">{viewingDoc.fileName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('hr.fileSize')}</p>
                  <p className="font-medium">
                    {viewingDoc.fileSize < 1024 * 1024
                      ? `${(viewingDoc.fileSize / 1024).toFixed(1)} KB`
                      : `${(viewingDoc.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
                {viewingDoc.issueDate && (
                  <div>
                    <p className="text-muted-foreground">{t('hr.issueDate')}</p>
                    <p className="font-medium">{viewingDoc.issueDate}</p>
                  </div>
                )}
                {viewingDoc.expiryDate && (
                  <div>
                    <p className="text-muted-foreground">{t('common.expiryDate')}</p>
                    <p className="font-medium">{viewingDoc.expiryDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">{t('hr.verificationStatus')}</p>
                  <p className="font-medium capitalize">{viewingDoc.verificationStatus}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('hr.uploaded')}</p>
                  <p className="font-medium">{viewingDoc.uploadedAt}</p>
                </div>
              </div>
              {viewingDoc.notes && (
                <div className="text-sm">
                  <p className="text-muted-foreground">{t('common.notes')}</p>
                  <p className="font-medium">{viewingDoc.notes}</p>
                </div>
              )}
              {/* Document preview placeholder */}
              <div className="border rounded-lg p-8 text-center bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  {t('hr.documentPreview')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('hr.file')}: {viewingDoc.fileName} ({viewingDoc.fileFormat.toUpperCase()})
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DocumentsPage

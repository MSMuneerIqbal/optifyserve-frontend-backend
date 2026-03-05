/**
 * Document List Component
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { FileText, MoreHorizontal, Eye, Download, Trash2, CheckCircle, XCircle, Upload } from 'lucide-react'
import type { EmployeeDocument, DocumentVerificationStatus } from '../types/document.types'
import { DOCUMENT_VERIFICATION_CONFIG } from '../types/document.types'

interface DocumentListProps {
  documents: EmployeeDocument[]
  isLoading: boolean
  onUpload: () => void
  onView?: (doc: EmployeeDocument) => void
  onDownload?: (doc: EmployeeDocument) => void
  onVerify: (doc: EmployeeDocument, status: DocumentVerificationStatus) => void
  onDelete: (doc: EmployeeDocument) => void
  isManager?: boolean
}

export function DocumentList({ documents, isLoading, onUpload, onView, onDownload, onVerify, onDelete, isManager }: DocumentListProps) {
  const { t } = useTranslation()

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('hr.documents')}
          </CardTitle>
          <Button size="sm" onClick={onUpload}>
            <Upload className="h-4 w-4 me-1.5" />
            {t('hr.uploadDocument')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('hr.document')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('hr.file')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('hr.issueDate')}</TableHead>
                <TableHead>{t('common.expiry')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {t('hr.noDocumentsUploaded')}
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => {
                  const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date()
                  const config = DOCUMENT_VERIFICATION_CONFIG[doc.verificationStatus]

                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{doc.documentTypeName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                            {doc.employeeName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm">
                          <p className="truncate max-w-[120px]">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {doc.issueDate ? formatDate(doc.issueDate) : '-'}
                      </TableCell>
                      <TableCell>
                        {doc.expiryDate ? (
                          <span className={cn('text-sm', isExpired && 'text-red-600 font-medium')}>
                            {formatDate(doc.expiryDate)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">{t('common.na')}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs',
                            doc.verificationStatus === 'verified' && 'bg-green-100 text-green-800',
                            doc.verificationStatus === 'pending' && 'bg-amber-100 text-amber-800',
                            doc.verificationStatus === 'rejected' && 'bg-red-100 text-red-800',
                            doc.verificationStatus === 'expired' && 'bg-slate-100 text-slate-800',
                          )}
                        >
                          {t(config.key)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              if (onView) {
                                onView(doc)
                              } else {
                                // Fallback: open file URL in new tab
                                window.open(doc.fileUrl, '_blank')
                              }
                            }}>
                              <Eye className="h-4 w-4 me-2" />{t('common.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              if (onDownload) {
                                onDownload(doc)
                              } else {
                                // Fallback: trigger download
                                const link = document.createElement('a')
                                link.href = doc.fileUrl
                                link.download = doc.fileName
                                link.click()
                              }
                            }}>
                              <Download className="h-4 w-4 me-2" />{t('common.download')}
                            </DropdownMenuItem>
                            {isManager && doc.verificationStatus === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => onVerify(doc, 'verified')}>
                                  <CheckCircle className="h-4 w-4 me-2 text-green-600" />{t('hr.verify')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onVerify(doc, 'rejected')}>
                                  <XCircle className="h-4 w-4 me-2 text-red-600" />{t('common.reject')}
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(doc)}>
                              <Trash2 className="h-4 w-4 me-2" />{t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentList

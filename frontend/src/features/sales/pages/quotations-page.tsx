/**
 * Quotations Page
 * Phase 6: Sales Module
 *
 * Main page for managing quotations
 * Handles list, create, edit, and view operations
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { QuotationList } from '../components/quotation-list'
import { QuotationForm } from '../components/quotation-form'
import { QuotationPreview } from '../components/quotation-preview'
import { sampleQuotations } from '@/data/quotations.data'
import type { Quotation, QuotationFormData } from '../types/quotation.types'

type ViewMode = 'list' | 'create' | 'edit' | 'view'

export function QuotationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const list = sampleQuotations
  const isSubmitting = false

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Derive summary from the list
  const summary = list.length > 0 ? {
    totalQuotations: list.length,
    draftCount: list.filter((q) => q.status === 'draft').length,
    sentCount: list.filter((q) => q.status === 'sent').length,
    acceptedCount: list.filter((q) => q.status === 'accepted').length,
    rejectedCount: list.filter((q) => q.status === 'rejected').length,
    conversionRate: list.length > 0
      ? (list.filter((q) => q.status === 'converted').length / list.length) * 100
      : 0,
  } : null

  // Handle view quotation
  const handleView = useCallback((quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setViewMode('view')
  }, [])

  // Handle edit quotation
  const handleEdit = useCallback((quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setViewMode('edit')
    setIsFormOpen(true)
  }, [])

  // Handle create quotation
  const handleCreate = useCallback(() => {
    setSelectedQuotation(null)
    setViewMode('create')
    setIsFormOpen(true)
  }, [])

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setViewMode('list')
    setSelectedQuotation(null)
    setIsFormOpen(false)
  }, [])

  // Handle form submit
  const handleFormSubmit = async (_data: QuotationFormData) => {
    if (viewMode === 'edit' && selectedQuotation) {
      toast.success(t('sales.quotationUpdatedSuccess'))
    } else {
      toast.success(t('sales.quotationCreatedSuccess'))
    }
    handleBackToList()
  }

  // Handle form submit and send
  const handleFormSubmitAndSend = async (_data: QuotationFormData) => {
    toast.success(t('sales.quotationCreatedSentSuccess'))
    handleBackToList()
  }

  // Handle send quotation
  const handleSend = async () => {
    if (selectedQuotation) {
      toast.success(t('sales.quotationSentSuccess'))
      handleBackToList()
    }
  }

  // Handle convert to invoice
  const handleConvert = async () => {
    if (selectedQuotation) {
      const invoiceNum = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`
      toast.success(
        t('sales.quotationConvertedWithInvoice', {
          quotation: selectedQuotation.quotationNumber,
          invoice: invoiceNum,
        })
      )
      navigate('/sales/invoices')
    }
  }

  // Render based on view mode
  if (viewMode === 'view' && selectedQuotation) {
    return (
      <QuotationPreview
        quotation={selectedQuotation}
        onBack={handleBackToList}
        onSend={selectedQuotation.status === 'draft' ? handleSend : undefined}
        onConvert={selectedQuotation.status === 'accepted' ? handleConvert : undefined}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t('sales.quotationsTitle')}
        description={t('sales.quotationsDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('sales.newQuotation')}</span>
            <span className="sm:hidden">{t('common.new')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <SummaryCard
            label={t('sales.totalQuotations')}
            value={summary.totalQuotations}
            variant="default"
          />
          <SummaryCard
            label={t('sales.draftQuotations')}
            value={summary.draftCount}
            variant="neutral"
          />
          <SummaryCard
            label={t('sales.sentQuotations')}
            value={summary.sentCount}
            variant="info"
          />
          <SummaryCard
            label={t('sales.acceptedQuotations')}
            value={summary.acceptedCount}
            variant="success"
          />
          <SummaryCard
            label={t('sales.rejectedQuotations')}
            value={summary.rejectedCount}
            variant="error"
          />
          <SummaryCard
            label={t('sales.conversionRate')}
            value={`${Math.round(summary.conversionRate)}%`}
            variant="default"
          />
        </div>
      )}

      {/* Quotation List */}
      <QuotationList
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Create/Edit Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewMode === 'edit' ? t('sales.editQuotation') : t('sales.newQuotation')}
            </SheetTitle>
          </SheetHeader>

          <QuotationForm
            quotation={viewMode === 'edit' ? selectedQuotation ?? undefined : undefined}
            onSubmit={handleFormSubmit}
            onSend={viewMode === 'create' ? handleFormSubmitAndSend : undefined}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Summary Card Component
interface SummaryCardProps {
  label: string
  value: number | string
  variant?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'error'
}

function SummaryCard({ label, value, variant = 'default' }: SummaryCardProps) {
  const variantStyles = {
    default: 'border-border',
    neutral: 'border-l-4 border-l-slate-500',
    info: 'border-l-4 border-l-blue-500',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-amber-500',
    error: 'border-l-4 border-l-red-500',
  }

  return (
    <div className={`rounded-lg border bg-white p-4 ${variantStyles[variant]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

export default QuotationsPage

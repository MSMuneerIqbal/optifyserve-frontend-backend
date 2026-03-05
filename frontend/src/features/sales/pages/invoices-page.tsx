/**
 * Invoices Page
 * Phase 6: Sales Module
 *
 * Main page for managing invoices
 * Handles list, create, edit, view, and payment operations
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { useCurrency } from '@/contexts/currency-context'
import { InvoiceList } from '../components/invoice-list'
import { InvoiceForm } from '../components/invoice-form'
import { InvoicePreview } from '../components/invoice-preview'
import { PaymentForm } from '../components/payment-form'
import { sampleInvoices } from '@/data/invoices.data'
import type { Invoice, InvoiceFormData, PaymentFormData } from '../types/invoice.types'

type ViewMode = 'list' | 'create' | 'edit' | 'view'

export function InvoicesPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const list = sampleInvoices
  const isSubmitting = false

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  // Derive summary from the list
  const summary = list.length > 0 ? {
    totalInvoices: list.length,
    paidCount: list.filter((i) => i.status === 'paid').length,
    partiallyPaidCount: list.filter((i) => i.status === 'partially-paid').length,
    overdueCount: list.filter((i) => i.status === 'overdue').length,
    totalReceived: list.reduce((sum, i) => sum + (i.paidAmount || 0), 0),
    totalOutstanding: list.reduce((sum, i) => sum + (i.balanceAmount || 0), 0),
    totalValue: list.reduce((sum, i) => sum + (i.total || 0), 0),
  } : null

  // Handle view invoice
  const handleView = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setViewMode('view')
  }, [])

  // Handle edit invoice
  const handleEdit = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setViewMode('edit')
    setIsFormOpen(true)
  }, [])

  // Handle create invoice
  const handleCreate = useCallback(() => {
    setSelectedInvoice(null)
    setViewMode('create')
    setIsFormOpen(true)
  }, [])

  // Handle record payment
  const handleRecordPayment = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsPaymentOpen(true)
  }, [])

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setViewMode('list')
    setSelectedInvoice(null)
    setIsFormOpen(false)
  }, [])

  // Handle form submit
  const handleFormSubmit = async (_data: InvoiceFormData) => {
    if (viewMode === 'edit' && selectedInvoice) {
      toast.success(t('sales.invoiceUpdatedSuccess'))
    } else {
      toast.success(t('sales.invoiceCreatedSuccess'))
    }
    handleBackToList()
  }

  // Handle form submit and send
  const handleFormSubmitAndSend = async (_data: InvoiceFormData) => {
    toast.success(t('sales.invoiceCreatedSentSuccess'))
    handleBackToList()
  }

  // Handle send invoice
  const handleSend = async () => {
    if (selectedInvoice) {
      toast.success(t('sales.invoiceSentSuccess'))
      handleBackToList()
    }
  }

  // Handle payment submit
  const handlePaymentSubmit = async (_data: PaymentFormData) => {
    toast.success(t('sales.paymentRecordedSuccess'))
    setIsPaymentOpen(false)
    if (viewMode === 'view' && selectedInvoice) {
      handleBackToList()
    }
  }

  // Render based on view mode
  if (viewMode === 'view' && selectedInvoice) {
    return (
      <InvoicePreview
        invoice={selectedInvoice}
        onBack={handleBackToList}
        onSend={selectedInvoice.status === 'draft' ? handleSend : undefined}
        onRecordPayment={
          ['sent', 'partially-paid', 'overdue'].includes(selectedInvoice.status)
            ? () => setIsPaymentOpen(true)
            : undefined
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t('sales.invoicesTitle')}
        description={t('sales.invoicesDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('sales.newInvoice')}</span>
            <span className="sm:hidden">{t('common.new')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryCard
            label={t('sales.totalInvoices')}
            value={summary.totalInvoices}
            variant="default"
          />
          <SummaryCard
            label={t('sales.paidInvoices')}
            value={summary.paidCount}
            subValue={formatAmount(summary.totalReceived)}
            variant="success"
          />
          <SummaryCard
            label={t('sales.partiallyPaidInvoices')}
            value={summary.partiallyPaidCount}
            variant="warning"
          />
          <SummaryCard
            label={t('sales.overdueInvoices')}
            value={summary.overdueCount}
            variant="error"
          />
          <SummaryCard
            label={t('sales.outstandingAmount')}
            value={formatAmount(summary.totalOutstanding)}
            variant="info"
          />
          <SummaryCard
            label={t('sales.totalValue')}
            value={formatAmount(summary.totalValue)}
            variant="default"
          />
        </div>
      )}

      {/* Invoice List */}
      <InvoiceList
        onView={handleView}
        onEdit={handleEdit}
        onRecordPayment={handleRecordPayment}
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
              {viewMode === 'edit' ? t('sales.editInvoice') : t('sales.newInvoice')}
            </SheetTitle>
          </SheetHeader>

          <InvoiceForm
            invoice={viewMode === 'edit' ? selectedInvoice ?? undefined : undefined}
            onSubmit={handleFormSubmit}
            onSend={viewMode === 'create' ? handleFormSubmitAndSend : undefined}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </SheetContent>
      </Sheet>

      {/* Payment Form Dialog */}
      {selectedInvoice && (
        <PaymentForm
          invoice={selectedInvoice}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onSubmit={handlePaymentSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}

// Summary Card Component
interface SummaryCardProps {
  label: string
  value: number | string
  subValue?: string
  variant?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'error'
}

function SummaryCard({ label, value, subValue, variant = 'default' }: SummaryCardProps) {
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
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
      {subValue && (
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{subValue}</p>
      )}
    </div>
  )
}

export default InvoicesPage

/**
 * Purchase Orders Page
 * Phase 8: Purchase Module
 *
 * Main page for managing purchase orders
 */

import { useState, useCallback } from 'react'
import { Plus, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { useCurrency } from '@/contexts/currency-context'
import { toast } from 'sonner'
import { PurchaseOrderList } from '../components/purchase-order-list'
import { PurchaseOrderForm } from '../components/purchase-order-form'
import { PurchaseOrderDetail } from '../components/purchase-order-detail'
import { POApprovalModal } from '../components/po-approval-modal'
import { samplePurchaseOrders } from '@/data/purchase-orders.data'
import type { PurchaseOrder, POFormData } from '../types/purchase-order.types'

type ViewMode = 'list' | 'view'

export function PurchaseOrdersPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [approvalPO, setApprovalPO] = useState<PurchaseOrder | null>(null)

  const isSubmitting = false
  const poList = samplePurchaseOrders

  const summary = poList.length > 0 ? {
    totalOrders: poList.length,
    draftCount: poList.filter((po) => po.status === 'draft').length,
    pendingApprovalCount: poList.filter((po) => po.status === 'pending-approval').length,
    approvedCount: poList.filter((po) => po.status === 'approved').length,
    totalValue: poList.reduce((sum, po) => sum + (po.total || 0), 0),
    totalPendingValue: poList
      .filter((po) => ['draft', 'pending-approval'].includes(po.status))
      .reduce((sum, po) => sum + (po.total || 0), 0),
  } : null

  const isCreating = isSubmitting
  const isUpdating = isSubmitting
  const isApproving = isSubmitting
  const isRejecting = isSubmitting

  const handleView = useCallback((po: PurchaseOrder) => {
    setSelectedPO(po)
    setViewMode('view')
  }, [])

  const handleEdit = useCallback((po: PurchaseOrder) => {
    setSelectedPO(po)
    setFormMode('edit')
    setIsFormOpen(true)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedPO(null)
    setFormMode('create')
    setIsFormOpen(true)
  }, [])

  const handleBackToList = useCallback(() => {
    setViewMode('list')
    setSelectedPO(null)
  }, [])

  const handleFormSubmit = async (_data: POFormData) => {
    if (formMode === 'edit') {
      toast.success(t('purchase.poUpdated'))
    } else {
      toast.success(t('purchase.poCreated'))
    }
    setIsFormOpen(false)
    setSelectedPO(null)
  }

  const handleApproveSubmit = (_id: string, _comments?: string) => {
    toast.success(t('purchase.poApproved'))
    setApprovalPO(null)
  }

  const handleRejectSubmit = (_id: string, _reason: string) => {
    toast.success(t('purchase.poRejected'))
    setApprovalPO(null)
  }

  // Detail view
  if (viewMode === 'view' && selectedPO) {
    return (
      <PurchaseOrderDetail
        purchaseOrder={selectedPO}
        onBack={handleBackToList}
        onSubmitForApproval={
          selectedPO.status === 'draft' ? () => toast.success(t('purchase.submittedForApproval')) : undefined
        }
        onApprove={
          selectedPO.status === 'pending-approval' ? () => setApprovalPO(selectedPO) : undefined
        }
        onReject={
          selectedPO.status === 'pending-approval' ? () => setApprovalPO(selectedPO) : undefined
        }
        onSend={
          selectedPO.status === 'approved' ? () => toast.success(t('purchase.sentToVendor')) : undefined
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('purchase.purchaseOrdersTitle')}
        description={t('purchase.purchaseOrdersDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('purchase.newPO')}</span>
            <span className="sm:hidden">{t('common.new')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryCard label={t('purchase.totalPOs')} value={summary.totalOrders} variant="default" />
          <SummaryCard label={t('common.draft')} value={summary.draftCount} variant="default" />
          <SummaryCard label={t('purchase.pendingApproval')} value={summary.pendingApprovalCount} variant="warning" />
          <SummaryCard label={t('common.approved')} value={summary.approvedCount} variant="success" />
          <SummaryCard label={t('purchase.totalValue')} value={formatAmount(summary.totalValue)} variant="info" />
          <SummaryCard label={t('purchase.pendingValue')} value={formatAmount(summary.totalPendingValue)} variant="error" />
        </div>
      )}

      <PurchaseOrderList
        onView={handleView}
        onEdit={handleEdit}
        onApprove={(po) => setApprovalPO(po)}
      />

      {/* Create/Edit Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {formMode === 'edit' ? t('purchase.editPO') : t('purchase.newPO')}
            </SheetTitle>
          </SheetHeader>
          <PurchaseOrderForm
            purchaseOrder={formMode === 'edit' ? selectedPO ?? undefined : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isCreating || isUpdating}
          />
        </SheetContent>
      </Sheet>

      {/* Approval Modal */}
      <POApprovalModal
        purchaseOrder={approvalPO}
        isOpen={!!approvalPO}
        onClose={() => setApprovalPO(null)}
        onApprove={handleApproveSubmit}
        onReject={handleRejectSubmit}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: number | string
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
}

function SummaryCard({ label, value, variant = 'default' }: SummaryCardProps) {
  const variantStyles = {
    default: 'border-border',
    info: 'border-l-4 border-l-blue-500',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-amber-500',
    error: 'border-l-4 border-l-red-500',
  }
  return (
    <div className={`rounded-lg border bg-white p-4 ${variantStyles[variant]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
    </div>
  )
}

export default PurchaseOrdersPage

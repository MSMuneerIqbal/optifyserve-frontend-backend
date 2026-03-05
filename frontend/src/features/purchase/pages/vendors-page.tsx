/**
 * Vendors Page
 * Phase 8: Purchase Module
 *
 * Main page for managing vendors/suppliers
 */

import { useState, useCallback } from 'react'
import { Plus, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { useCurrency } from '@/contexts/currency-context'
import { toast } from 'sonner'
import { VendorList } from '../components/vendor-list'
import { VendorForm } from '../components/vendor-form'
import { VendorDetailPanel } from '../components/vendor-detail-panel'
import { sampleVendors } from '@/data/vendors.data'
import type { Vendor, VendorFormData } from '../types/vendor.types'

export function VendorsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const isSubmitting = false
  const vendorList = sampleVendors

  const summary = vendorList.length > 0 ? {
    totalVendors: vendorList.length,
    activeCount: vendorList.filter((v) => v.status === 'active').length,
    totalPurchaseValue: vendorList.reduce((sum, v) => sum + (v.totalPurchaseValue || 0), 0),
    totalOutstanding: vendorList.reduce((sum, v) => sum + (v.outstandingAmount || 0), 0),
  } : null

  const handleView = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsDetailOpen(true)
  }, [])

  const handleEdit = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor)
    setFormMode('edit')
    setIsFormOpen(true)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedVendor(null)
    setFormMode('create')
    setIsFormOpen(true)
  }, [])

  const handleFormSubmit = async (_data: VendorFormData) => {
    if (formMode === 'edit') {
      toast.success(t('purchase.vendorUpdated'))
    } else {
      toast.success(t('purchase.vendorCreated'))
    }
    setIsFormOpen(false)
    setSelectedVendor(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('purchase.vendorsTitle')}
        description={t('purchase.vendorsDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('purchase.addVendor')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <SummaryCard label={t('purchase.totalVendors')} value={summary.totalVendors} variant="default" />
          <SummaryCard label={t('common.active')} value={summary.activeCount} variant="success" />
          <SummaryCard label={t('purchase.totalValue')} value={formatAmount(summary.totalPurchaseValue)} variant="info" />
          <SummaryCard label={t('purchase.outstanding')} value={formatAmount(summary.totalOutstanding)} variant="warning" />
        </div>
      )}

      <VendorList onView={handleView} onEdit={handleEdit} />

      {/* Create/Edit Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {formMode === 'edit' ? t('purchase.editVendor') : t('purchase.newVendor')}
            </SheetTitle>
          </SheetHeader>
          <VendorForm
            vendor={formMode === 'edit' ? selectedVendor ?? undefined : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </SheetContent>
      </Sheet>

      {/* Detail Panel */}
      <VendorDetailPanel
        vendorId={selectedVendor?.id ?? null}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
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

export default VendorsPage

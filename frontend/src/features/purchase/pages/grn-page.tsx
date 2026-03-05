/**
 * GRN Page
 * Phase 8: Purchase Module
 *
 * Main page for Goods Receipt Notes
 */

import { useState, useCallback } from 'react'
import { Plus, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { toast } from 'sonner'
import { GRNList } from '../components/grn-list'
import { GRNForm } from '../components/grn-form'
import type { GoodsReceiptNote, GRNFormData } from '../types/grn.types'

export function GRNPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const isCreating = false

  const handleCreate = useCallback(() => {
    setIsFormOpen(true)
  }, [])

  const handleView = useCallback((_grn: GoodsReceiptNote) => {
    // View is handled inline for now
  }, [])

  const handleFormSubmit = async (_data: GRNFormData) => {
    toast.success(t('purchase.grnCreated'))
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('purchase.grnTitle')}
        description={t('purchase.grnDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('purchase.newGRN')}</span>
            <span className="sm:hidden">{t('common.new')}</span>
          </Button>
        }
      />

      <GRNList onView={handleView} />

      {/* Create GRN Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('purchase.newGRN')}
            </SheetTitle>
          </SheetHeader>
          <GRNForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isCreating}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default GRNPage

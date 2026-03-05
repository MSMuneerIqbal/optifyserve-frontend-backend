/**
 * Stock Movements Page
 * Phase 7: Inventory Module
 *
 * Stock movement recording and history
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp, ArrowRight, Wrench } from 'lucide-react'
import { StockMovementForm } from '../components/stock-movement-form'
import { StockHistoryTimeline } from '../components/stock-history-timeline'

export function StockMovementsPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState<'in' | 'out' | 'transfer' | 'adjustment'>('in')
  const [selectedItemId] = useState<string>()

  const handleOpenForm = (type: 'in' | 'out' | 'transfer' | 'adjustment') => {
    setFormType(type)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    // In a full implementation, refresh the timeline
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('inventory.stockMovementsTitle')}
        description={t('inventory.stockMovementsDescription')}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenForm('in')} className="gap-2">
              <ArrowDown className="h-4 w-4" />
              <span className="hidden sm:inline">{t('inventory.stockIn')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOpenForm('out')} className="gap-2">
              <ArrowUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('inventory.stockOut')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOpenForm('transfer')} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              <span className="hidden sm:inline">{t('inventory.transfer')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOpenForm('adjustment')} className="gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">{t('inventory.adjust')}</span>
            </Button>
          </div>
        }
      />

      {/* Movement Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formType === 'in' && t('inventory.recordStockIn')}
              {formType === 'out' && t('inventory.recordStockOut')}
              {formType === 'transfer' && t('inventory.transferStock')}
              {formType === 'adjustment' && t('inventory.stockAdjustment')}
            </DialogTitle>
          </DialogHeader>
          <StockMovementForm
            defaultType={formType}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* History Timeline */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{t('inventory.recentMovements')}</h3>
        {selectedItemId ? (
          <StockHistoryTimeline itemId={selectedItemId} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {t('inventory.selectItemForHistory')}
          </div>
        )}
      </div>
    </div>
  )
}

export default StockMovementsPage

/**
 * Warehouses Page
 * Phase 7: Inventory Module
 *
 * Main warehouses management page with list and forms
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WarehouseList } from '../components/warehouse-list'
import { WarehouseForm } from '../components/warehouse-form'
import type { Warehouse } from '../types/warehouse.types'

export function WarehousesPage() {
  const { t } = useTranslation()
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>()
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [_viewingWarehouse, setViewingWarehouse] = useState<Warehouse | undefined>()

  const isSubmitting = false

  const handleView = (warehouse: Warehouse) => {
    setViewingWarehouse(warehouse)
  }

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(Object.keys(warehouse).length > 0 ? warehouse : undefined)
    setViewingWarehouse(undefined)
    setIsFormDialogOpen(true)
  }

  const handleFormSubmit = async (_data: unknown) => {
    toast.success(selectedWarehouse?.id ? t('inventory.warehouseUpdated') : t('inventory.warehouseCreated'))
    setIsFormDialogOpen(false)
    setSelectedWarehouse(undefined)
  }

  const handleFormCancel = () => {
    setIsFormDialogOpen(false)
    setSelectedWarehouse(undefined)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('inventory.warehousesTitle')}
        description={t('inventory.warehousesDescription')}
      />

      <WarehouseList
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWarehouse?.id ? t('inventory.editWarehouse') : t('inventory.createWarehouse')}
            </DialogTitle>
          </DialogHeader>
          <WarehouseForm
            warehouse={selectedWarehouse}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WarehousesPage

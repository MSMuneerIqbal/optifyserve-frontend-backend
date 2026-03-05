/**
 * Items Page
 * Phase 7: Inventory Module
 *
 * Main items management page with list, detail panel, and forms
 */

import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ItemList } from '../components/item-list'
import { ItemDetailPanel } from '../components/item-detail-panel'
import { ItemForm } from '../components/item-form'
import { ItemImportDialog } from '../components/item-import-dialog'
import type { Item } from '../types/item.types'

export function ItemsPage() {
  const { t } = useTranslation()
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | undefined>()
  const [isImportOpen, setIsImportOpen] = useState(false)

  const isSubmitting = false

  const handleView = (item: Item) => {
    setSelectedItemId(item.id)
    setIsDetailPanelOpen(true)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(Object.keys(item).length > 0 ? item : undefined)
    setIsDetailPanelOpen(false)
    setIsFormDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(undefined)
    setIsFormDialogOpen(true)
  }

  const handleFormSubmit = async (_data: unknown) => {
    toast.success(editingItem?.id ? t('inventory.itemUpdated') : t('inventory.itemCreated'))
    setIsFormDialogOpen(false)
    setEditingItem(undefined)
  }

  const handleFormCancel = () => {
    setIsFormDialogOpen(false)
    setEditingItem(undefined)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('inventory.itemsTitle')}
        description={t('inventory.itemsDescription')}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">{t('inventory.importItems')}</span>
            </Button>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('inventory.addItem')}
            </Button>
          </div>
        }
      />

      <ItemList
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* Detail Panel */}
      <ItemDetailPanel
        itemId={selectedItemId}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onEdit={handleEdit}
      />

      {/* Import Dialog */}
      <ItemImportDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? t('inventory.editItem') : t('inventory.createItem')}
            </DialogTitle>
          </DialogHeader>
          <ItemForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ItemsPage

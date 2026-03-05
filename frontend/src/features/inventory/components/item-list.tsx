/**
 * Item List Component
 * Phase 7: Inventory Module
 *
 * Responsive list view for items with filtering
 * Mobile card view, Desktop table view
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Edit, Trash2, Barcode } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { StatusBadge } from '@/components/shared/status-badge'
import { SimplePagination } from '@/components/shared/simple-pagination'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleItems } from '@/data/items.data'
import type { Item, ItemFilters } from '../types/item.types'
import { UNIT_OF_MEASURE_KEYS, ITEM_STATUS_CONFIG } from '../types/item.types'

interface ItemListProps {
  onEdit: (item: Item) => void
  onView: (item: Item) => void
  className?: string
}

export function ItemList({ onEdit, onView, className }: ItemListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  // Filter state
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    pageSize: 25,
  })
  const [searchValue, setSearchValue] = useState('')

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Item | null }>({
    isOpen: false,
    item: null,
  })

  // Static data
  const items = sampleItems
  const isLoading = false
  const error = null
  const isDeleting = false

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue || undefined, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Handle filter change
  const handleFilterChange = (key: keyof ItemFilters, value: string | boolean | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }))
  }

  // Handle delete
  const handleDelete = () => {
    if (deleteConfirm.item) {
      toast.success(t('inventory.itemDeletedSuccess', { name: deleteConfirm.item.name }))
      setDeleteConfirm({ isOpen: false, item: null })
    }
  }

  // Mock category options - in real app, would fetch from item categories API
  const categoryOptions = [
    { value: 'cat_001', label: t('inventory.catAirConditioners') },
    { value: 'cat_002', label: t('inventory.catElectricalItems') },
    { value: 'cat_003', label: t('inventory.catPlumbingSupplies') },
    { value: 'cat_004', label: t('inventory.catSafetyEquipment') },
    { value: 'cat_005', label: t('inventory.catToolsHardware') },
    { value: 'cat_006', label: t('inventory.catServices') },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('inventory.failedToLoadItems')}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  const hasActiveFilters = filters.search || filters.category || filters.status || filters.lowStock || filters.outOfStock

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        {/* Search */}
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('inventory.searchItems')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="ps-9 h-10 w-full"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary" className="shrink-0">
            {t('common.search')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder={t('inventory.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inventory.allCategories')}</SelectItem>
              {categoryOptions?.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={filters.status ? 'secondary' : 'outline'}
            onClick={() => handleFilterChange('status', filters.status === 'active' ? undefined : 'active')}
          >
            {t('inventory.activeOnly')}
          </Button>

          <Button
            variant={filters.lowStock ? 'secondary' : 'outline'}
            onClick={() => handleFilterChange('lowStock', filters.lowStock ? undefined : true)}
          >
            {t('inventory.lowStock')}
          </Button>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            {t('common.clearFilters')}
          </Button>
        )}
      </div>

      {/* Add Button */}
      <div>
        <Button onClick={() => onEdit({} as Item)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('inventory.addItem')}</span>
          <span className="sm:hidden">{t('common.add')}</span>
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <EmptyState
          icon="package"
          title={t('inventory.noItemsFound')}
          description={
            hasActiveFilters
              ? t('common.tryAdjustingFilters')
              : t('inventory.createFirstItem')
          }
          action={
            !hasActiveFilters
              ? {
                  label: t('inventory.createItem'),
                  onClick: () => onEdit({} as Item),
                }
              : undefined
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    <input type="checkbox" className="me-2" />
                    {t('inventory.skuItem')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('common.category')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('inventory.unit')}
                  </th>
                  <th className="px-4 py-3 text-end text-sm font-medium text-muted-foreground">
                    {t('inventory.cost')}
                  </th>
                  <th className="px-4 py-3 text-end text-sm font-medium text-muted-foreground">
                    {t('inventory.price')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('inventory.stock')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('inventory.reorder')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('common.status')}
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(item)}
                  >
                    <td className="px-4">
                      <input type="checkbox" className="me-2" />
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.barcode && (
                          <span className="text-xs text-muted-foreground block">
                            {item.barcode}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4">
                      {item.category?.name}
                    </td>
                    <td className="px-2 text-center">
                      {t(UNIT_OF_MEASURE_KEYS[item.unitOfMeasure]) || item.unitOfMeasure}
                    </td>
                    <td className="text-right font-medium">
                      {formatAmount(item.costPrice)}
                    </td>
                    <td className="text-right font-medium">
                      {formatAmount(item.sellingPrice)}
                    </td>
                    <td className="text-center">
                      {item.reorderPoint > 0 ? item.reorderPoint : '-'}
                    </td>
                    <td className="text-center">
                      {item.reorderPoint > 0 && item.reorderPoint <= 5 ? (
                        <StatusBadge variant="error">
                          {t('inventory.low')}
                        </StatusBadge>
                      ) : item.reorderPoint <= 10 ? (
                        <StatusBadge variant="warning">
                          {t('inventory.medium')}
                        </StatusBadge>
                      ) : (
                        <StatusBadge variant="success">
                          {t('inventory.ok')}
                        </StatusBadge>
                      )}
                    </td>
                    <td className="px-4">
                      {ITEM_STATUS_CONFIG[item.status]?.variant ? (
                        <StatusBadge variant={ITEM_STATUS_CONFIG[item.status]?.variant}>
                          {t(ITEM_STATUS_CONFIG[item.status]?.key)}
                        </StatusBadge>
                      ) : (
                        <span className="text-muted-foreground">{item.status}</span>
                      )}
                    </td>
                    <td className="px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Barcode className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm({ isOpen: true, item })}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 me-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(item)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <span className="font-semibold text-lg">{item.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {t(UNIT_OF_MEASURE_KEYS[item.unitOfMeasure]) || item.unitOfMeasure}
                      </Badge>
                    </div>
                    <StatusBadge variant={ITEM_STATUS_CONFIG[item.status]?.variant}>
                      {t(ITEM_STATUS_CONFIG[item.status]?.key)}
                    </StatusBadge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirm({ isOpen: true, item })}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                <div className="space-y-2">
                  {item.sku && (
                    <div className="text-sm text-muted-foreground">
                      <span>{t('inventory.sku')}:</span> {item.sku}
                    </div>
                  )}
                  {item.barcode && (
                    <div className="text-sm text-muted-foreground">
                      <span>{t('inventory.barcode')}:</span> {item.barcode}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('inventory.cost')}:</span>
                      <span className="font-medium">{formatAmount(item.costPrice)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('inventory.price')}:</span>
                      <span className="font-medium">{formatAmount(item.sellingPrice)}</span>
                    </div>
                  </div>
                  {item.reorderPoint && (
                    <div className="text-sm text-muted-foreground">
                      <span>{t('inventory.reorderPoint')}:</span> {item.reorderPoint}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            ))}
          </div>

          {/* Pagination */}
          <SimplePagination
            page={filters.page ?? 1}
            pageSize={filters.pageSize ?? 25}
            totalItems={items.length}
            totalPages={Math.ceil(items.length / (filters.pageSize ?? 25))}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showRowsPerPage
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title={t('inventory.deleteItem')}
        description={t('inventory.confirmDeleteItem', { name: deleteConfirm.item?.name })}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ItemList

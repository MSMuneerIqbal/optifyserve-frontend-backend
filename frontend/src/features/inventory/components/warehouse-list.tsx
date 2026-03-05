/**
 * Warehouse List Component
 * Phase 7: Inventory Module
 *
 * Responsive list view for warehouses
 * Mobile card view, Desktop table view
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Edit, Trash2, MapPin, Building2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { sampleWarehouses } from '@/data/warehouses.data'
import type { Warehouse, WarehouseFilters } from '../types/warehouse.types'
import { WAREHOUSE_TYPE_KEYS, WAREHOUSE_STATUS_CONFIG } from '../types/warehouse.types'

interface WarehouseListProps {
  onEdit: (warehouse: Warehouse) => void
  onView: (warehouse: Warehouse) => void
  className?: string
}

export function WarehouseList({ onEdit, onView, className }: WarehouseListProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<WarehouseFilters>({
    page: 1,
    pageSize: 25,
  })
  const [searchValue, setSearchValue] = useState('')

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; warehouse: Warehouse | null }>({
    isOpen: false,
    warehouse: null,
  })

  // Static data
  const warehouses = sampleWarehouses
  const isLoading = false
  const error = null
  const isDeleting = false

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue || undefined, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleFilterChange = (key: keyof WarehouseFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  const handleDelete = () => {
    if (deleteConfirm.warehouse) {
      toast.success(t('inventory.warehouseDeletedSuccess', { name: deleteConfirm.warehouse.name }))
      setDeleteConfirm({ isOpen: false, warehouse: null })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('inventory.failedToLoadWarehouses')}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  const hasActiveFilters = filters.search || filters.type || filters.status

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('inventory.searchWarehouses')}
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

        <div className="flex gap-2">
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder={t('inventory.allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inventory.allTypes')}</SelectItem>
              <SelectItem value="main">{t('inventory.mainWarehouse')}</SelectItem>
              <SelectItem value="branch">{t('inventory.branchWarehouse')}</SelectItem>
              <SelectItem value="store">{t('inventory.retailStore')}</SelectItem>
              <SelectItem value="warehouse">{t('inventory.warehouse')}</SelectItem>
              <SelectItem value="van">{t('inventory.serviceVan')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder={t('inventory.allStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inventory.allStatus')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              {t('common.clear')}
            </Button>
          )}
        </div>
      </div>

      {/* Add Button */}
      <div>
        <Button onClick={() => onEdit({} as Warehouse)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('inventory.addWarehouse')}</span>
          <span className="sm:hidden">{t('common.add')}</span>
        </Button>
      </div>

      {/* Empty State */}
      {warehouses.length === 0 ? (
        <EmptyState
          icon="package"
          title={t('inventory.noWarehousesFound')}
          description={
            hasActiveFilters
              ? t('common.tryAdjustingFilters')
              : t('inventory.createFirstWarehouse')
          }
          action={
            !hasActiveFilters
              ? {
                  label: t('inventory.createWarehouse'),
                  onClick: () => onEdit({} as Warehouse),
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
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('common.name')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('inventory.code')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('common.type')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('inventory.branch')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('inventory.location')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('common.status')}
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(warehouse)}
                  >
                    <td className="px-4">
                      <div>
                        <span className="font-medium">{warehouse.name}</span>
                      </div>
                    </td>
                    <td className="px-4">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {warehouse.code}
                      </code>
                    </td>
                    <td className="px-4">
                      <Badge variant="secondary" className="text-xs">
                        {t(WAREHOUSE_TYPE_KEYS[warehouse.type]) || warehouse.type}
                      </Badge>
                    </td>
                    <td className="px-4">
                      {warehouse.branchId || '-'}
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {warehouse.address?.city || '-'}
                      </div>
                    </td>
                    <td className="px-4">
                      {WAREHOUSE_STATUS_CONFIG[warehouse.status]?.variant ? (
                        <StatusBadge variant={WAREHOUSE_STATUS_CONFIG[warehouse.status]?.variant}>
                          {t(WAREHOUSE_STATUS_CONFIG[warehouse.status]?.key)}
                        </StatusBadge>
                      ) : (
                        <span className="text-muted-foreground">{warehouse.status}</span>
                      )}
                    </td>
                    <td className="px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(warehouse)}>
                            <Edit className="h-4 w-4 me-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm({ isOpen: true, warehouse })}
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
            {warehouses.map((warehouse) => (
              <Card
                key={warehouse.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(warehouse)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-semibold text-lg">{warehouse.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs bg-muted px-2 py-0.5 rounded">
                            {warehouse.code}
                          </code>
                          <Badge variant="secondary" className="text-xs">
                            {t(WAREHOUSE_TYPE_KEYS[warehouse.type]) || warehouse.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <StatusBadge variant={WAREHOUSE_STATUS_CONFIG[warehouse.status]?.variant}>
                      {t(WAREHOUSE_STATUS_CONFIG[warehouse.status]?.key)}
                    </StatusBadge>
                  </div>

                  {warehouse.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {warehouse.address.city}, {warehouse.address.emirate}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(warehouse)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirm({ isOpen: true, warehouse })}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, warehouse: null })}
        onConfirm={handleDelete}
        title={t('inventory.deleteWarehouse')}
        description={t('inventory.confirmDeleteWarehouse', { name: deleteConfirm.warehouse?.name })}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default WarehouseList

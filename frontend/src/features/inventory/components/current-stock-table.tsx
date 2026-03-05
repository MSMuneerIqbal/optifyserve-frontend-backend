/**
 * Current Stock Table Component
 * Phase 7: Inventory Module
 *
 * Real-time stock levels per warehouse
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Package, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleItems } from '@/data/items.data'
import { sampleWarehouses } from '@/data/warehouses.data'

interface CurrentStockTableProps {
  warehouseId?: string
  className?: string
}

export function CurrentStockTable({ warehouseId, className }: CurrentStockTableProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(warehouseId || 'all')
  const [searchValue, setSearchValue] = useState('')

  const items = sampleItems
  const warehouses = sampleWarehouses
  const isLoading = false

  // Filter items by tracked stock and selected warehouse
  const filteredItems = items?.filter((item) => item.stockTracked) || []

  // Get stock level for item in warehouse (mock calculation)
  const getStockLevel = (itemId: string, _whId: string) => {
    const item = filteredItems.find((i) => i.id === itemId)
    if (!item || !selectedWarehouse) return { current: 0, status: 'ok' }

    const current = Math.floor(Math.random() * 50) + 1 // Mock stock level
    const reorderPoint = item.reorderPoint

    let status: 'ok' | 'low' | 'out'
    if (current === 0) status = 'out'
    else if (current <= reorderPoint) status = 'low'
    else status = 'ok'

    return { current, status }
  }

  const totalValue = filteredItems.reduce((sum, item) => {
    const { current } = getStockLevel(item.id, selectedWarehouse)
    return sum + (current * item.costPrice)
  }, 0)

  const lowStockCount = filteredItems.filter((item) => {
    const { status } = getStockLevel(item.id, selectedWarehouse)
    return status === 'low' || status === 'out'
  }).length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('inventory.totalItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{filteredItems.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('inventory.lowStockItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{lowStockCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('inventory.stockValue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(totalValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('inventory.searchItems')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="ps-9 h-10 w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedWarehouse}
            onValueChange={setSelectedWarehouse}
          >
            <SelectTrigger className="h-10 w-[200px]">
              <SelectValue placeholder={t('inventory.allWarehouses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inventory.allWarehouses')}</SelectItem>
              {warehouses?.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  {wh.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('inventory.item')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {t('inventory.sku')}
                  </th>
                  <th className="px-4 py-3 text-end text-sm font-medium text-muted-foreground">
                    {t('inventory.cost')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('inventory.currentStock')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('inventory.reorderPoint')}
                  </th>
                  <th className="px-4 py-3 text-end text-sm font-medium text-muted-foreground">
                    {t('inventory.stockValue')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    {t('common.status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const { current, status } = getStockLevel(item.id, selectedWarehouse)
                  const value = current * item.costPrice

                  return (
                    <tr key={item.id} className="hover:bg-muted/50">
                      <td className="px-4">
                        <div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {item.sku}
                        </code>
                      </td>
                      <td className="px-4 text-end">
                        {formatAmount(item.costPrice)}
                      </td>
                      <td className="px-4 text-center">
                        <span className="font-medium">{current}</span>
                      </td>
                      <td className="px-4 text-center">
                        {item.reorderPoint}
                      </td>
                      <td className="px-4 text-end">
                        {formatAmount(value)}
                      </td>
                      <td className="px-4 text-center">
                        <StatusBadge
                          variant={
                            status === 'out' ? 'error' : status === 'low' ? 'warning' : 'success'
                          }
                        >
                          {status === 'out' ? t('inventory.outOfStock') : status === 'low' ? t('inventory.lowStock') : t('inventory.inStock')}
                        </StatusBadge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredItems.map((item) => {
              const { current, status } = getStockLevel(item.id, selectedWarehouse)
              const value = current * item.costPrice

              return (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-semibold">{item.name}</span>
                        <code className="block text-xs bg-muted px-2 py-0.5 rounded mt-1">
                          {item.sku}
                        </code>
                      </div>
                      <StatusBadge
                        variant={
                          status === 'out' ? 'error' : status === 'low' ? 'warning' : 'success'
                        }
                      >
                        {status === 'out' ? t('inventory.out') : status === 'low' ? t('inventory.low') : t('inventory.ok')}
                      </StatusBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('inventory.stock')}:</span>
                        <span className="ms-2 font-medium">{current}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('inventory.reorder')}:</span>
                        <span className="ms-2 font-medium">{item.reorderPoint}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('inventory.cost')}:</span>
                        <span className="ms-2 font-medium">{formatAmount(item.costPrice)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('inventory.value')}:</span>
                        <span className="ms-2 font-medium">{formatAmount(value)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('inventory.noItemsFound')}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default CurrentStockTable

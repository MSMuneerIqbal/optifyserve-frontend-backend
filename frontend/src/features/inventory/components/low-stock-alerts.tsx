/**
 * Low Stock Alerts Component
 * Phase 7: Inventory Module
 *
 * Displays items below reorder point
 */

import { useTranslation } from 'react-i18next'
import { AlertTriangle, Package, TrendingUp, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleItems } from '@/data/items.data'

interface LowStockAlertsProps {
  warehouseId?: string
  limit?: number
  className?: string
}

export function LowStockAlerts({ limit = 10, className }: LowStockAlertsProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const items = sampleItems
  const isLoading = false

  // Filter items that are tracked and have low stock
  const lowStockItems = items
    ?.filter((item) => item.stockTracked && item.reorderPoint > 0)
    .map((item) => {
      // Mock current stock - in real app, this would come from stock API
      const currentStock = Math.floor(Math.random() * (item.reorderPoint * 2))
      const stockPercent = (currentStock / item.reorderPoint) * 100
      const isOutOfStock = currentStock === 0
      const isLowStock = currentStock <= item.reorderPoint

      return {
        ...item,
        currentStock,
        stockPercent: Math.min(stockPercent, 100),
        isOutOfStock,
        isLowStock,
      }
    })
    .filter((item) => item.isOutOfStock || item.isLowStock)
    .sort((a, b) => a.stockPercent - b.stockPercent)
    .slice(0, limit) || []

  const criticalCount = lowStockItems.filter((item) => item.isOutOfStock).length
  const reorderCost = lowStockItems.reduce((sum, item) => {
    const neededQty = item.reorderQuantity || (item.reorderPoint * 2)
    return sum + (neededQty * item.costPrice)
  }, 0)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn(criticalCount > 0 && 'border-destructive')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className={cn('h-4 w-4', criticalCount > 0 ? 'text-destructive' : 'text-muted-foreground')} />
              {t('inventory.criticalAlerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className={cn('text-2xl font-bold', criticalCount > 0 ? 'text-destructive' : '')}>
              {criticalCount}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {t('inventory.outOfStockItems')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {t('inventory.totalAlerts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{lowStockItems.length}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {t('inventory.itemsNeedAttention')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              {t('inventory.estReorderCost')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-bold text-green-600">
              {formatAmount(reorderCost)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {t('inventory.toReplenishAll')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Mail className="h-4 w-4" />
          {t('inventory.sendReport')}
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          {t('inventory.exportToCsv')}
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <Card key={item.id} className={cn('transition-shadow hover:shadow-md', item.isOutOfStock && 'border-destructive bg-destructive/5')}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{item.name}</span>
                      <StatusBadge
                        variant={item.isOutOfStock ? 'error' : 'warning'}
                      >
                        {item.isOutOfStock ? t('inventory.outOfStock') : t('inventory.lowStock')}
                      </StatusBadge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('inventory.currentStock')}</p>
                        <p className={cn('font-medium', item.currentStock === 0 ? 'text-destructive' : '')}>
                          {item.currentStock}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('inventory.reorderPoint')}</p>
                        <p className="font-medium">{item.reorderPoint}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('inventory.reorderQty')}</p>
                        <p className="font-medium">{item.reorderQuantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('inventory.leadTime')}</p>
                        <p className="font-medium">{item.leadTimeDays} {t('common.days')}</p>
                      </div>
                    </div>

                    {/* Stock Level Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{t('inventory.stockLevel')}</span>
                        <span className={cn(item.stockPercent < 25 ? 'text-destructive font-medium' : '')}>
                          {item.stockPercent.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={item.stockPercent}
                        className={cn(
                          'h-2',
                          item.stockPercent < 25 && '[&_[role=progressbar]]:bg-destructive'
                        )}
                      />
                    </div>

                    {/* Reorder Info */}
                    {item.currentStock > 0 && (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                        {t('inventory.orderRecommendation', {
                          quantity: item.reorderQuantity,
                          cost: formatAmount(item.reorderQuantity * item.costPrice),
                          days: item.leadTimeDays,
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      {t('inventory.reorder')}
                    </Button>
                    <Button size="sm" variant="ghost">
                      {t('common.view')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {lowStockItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <p className="text-lg font-medium text-green-600">{t('inventory.allGood')}</p>
                <p className="text-sm text-muted-foreground">{t('inventory.noLowStockAlerts')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default LowStockAlerts

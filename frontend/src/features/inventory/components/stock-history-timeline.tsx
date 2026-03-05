/**
 * Stock History Timeline Component
 * Phase 7: Inventory Module
 *
 * Displays chronological history of stock movements for an item
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUp, ArrowRight, Wrench, Filter, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn, formatDate } from '@/lib/utils'
import { sampleStockMovements } from '@/data/stock.data'
import type { StockMovement } from '../types/stock.types'

interface StockHistoryTimelineProps {
  itemId: string
  warehouseId?: string
  limit?: number
  className?: string
}

export function StockHistoryTimeline({
  itemId,
  warehouseId,
  className,
}: StockHistoryTimelineProps) {
  const { t } = useTranslation()
  const [movementType, setMovementType] = useState<string>('all')
  const isLoading = false

  // Filter movements from static data based on props
  const movements = (sampleStockMovements as StockMovement[]).filter((m) => {
    if (m.itemId !== itemId) return false
    if (warehouseId && m.warehouseId !== warehouseId) return false
    if (movementType !== 'all' && m.type !== movementType) return false
    return true
  })

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowDown className="h-4 w-4 text-green-600" />
      case 'out':
        return <ArrowUp className="h-4 w-4 text-red-600" />
      case 'transfer':
        return <ArrowRight className="h-4 w-4 text-blue-600" />
      case 'adjustment':
        return <Wrench className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getMovementBadge = (movement: StockMovement) => {
    if (movement.type === 'adjustment' && movement.adjustmentReason) {
      const reasonColors: Record<string, string> = {
        damage: 'error',
        expired: 'warning',
        lost: 'warning',
        return: 'info',
        correction: 'secondary',
        production: 'success',
      }
      const reasonKeys: Record<string, string> = {
        damage: 'status.damaged',
        expired: 'status.expired',
        lost: 'status.lostStolen',
        return: 'status.customerReturn',
        correction: 'status.countingCorrection',
        production: 'status.manufacturedOutput',
      }
      return { variant: reasonColors[movement.adjustmentReason] || 'secondary', label: t(reasonKeys[movement.adjustmentReason] || movement.adjustmentReason) }
    }

    const typeLabels: Record<string, string> = {
      in: t('inventory.stockIn'),
      out: t('inventory.stockOut'),
      transfer: t('inventory.transfer'),
      adjustment: t('inventory.adjustment'),
    }
    return { variant: 'secondary', label: typeLabels[movement.type] || movement.type }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('inventory.movementHistory')}</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={movementType} onValueChange={setMovementType}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inventory.allMovements')}</SelectItem>
              <SelectItem value="in">{t('inventory.stockIn')}</SelectItem>
              <SelectItem value="out">{t('inventory.stockOut')}</SelectItem>
              <SelectItem value="transfer">{t('inventory.transfers')}</SelectItem>
              <SelectItem value="adjustment">{t('inventory.adjustments')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : movements.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('inventory.noStockMovementsFound')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {movements.map((movement, index) => {
            const badge = getMovementBadge(movement)
            const isPositive = movement.quantity > 0

            return (
              <Card key={movement.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Timeline Line */}
                    <div className="relative flex flex-col items-center">
                      <div className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2',
                        isPositive ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                      )}>
                        {getMovementIcon(movement.type)}
                      </div>
                      {index < movements.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border min-h-[60px] mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={badge.variant as any} className="text-xs">
                            {badge.label}
                          </Badge>
                          {movement.referenceNumber && (
                            <code className="text-xs bg-muted px-2 py-0.5 rounded">
                              {movement.referenceNumber}
                            </code>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(new Date(movement.createdAt))}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            'font-semibold text-lg',
                            isPositive ? 'text-green-600' : 'text-red-600'
                          )}>
                            {isPositive ? '+' : ''}{movement.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            {movement.item?.name}
                          </span>
                        </div>

                        {movement.type === 'transfer' && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{movement.fromWarehouseId}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{movement.toWarehouseId}</span>
                          </div>
                        )}

                        {movement.warehouseId && movement.type !== 'transfer' && (
                          <div className="text-xs text-muted-foreground">
                            {t('inventory.warehouse')}: {movement.warehouseId}
                          </div>
                        )}

                        {movement.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {movement.notes}
                          </p>
                        )}

                        {movement.performedBy && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                            <span className="text-xs text-muted-foreground">
                              {t('common.by')} {movement.performedBy.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Badge */}
                    <div className={cn(
                      'text-center min-w-[60px]',
                      isPositive ? 'text-green-600' : 'text-red-600'
                    )}>
                      <div className="text-2xl font-bold">
                        {isPositive ? '+' : ''}{movement.quantity}
                      </div>
                      <div className="text-xs">{t('inventory.units')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StockHistoryTimeline

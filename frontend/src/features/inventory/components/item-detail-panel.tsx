/**
 * Item Detail Panel Component
 * Phase 7: Inventory Module
 *
 * Slide-out panel with tabs for item details
 * Tabs: Info, Stock, History
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Package, DollarSign, History, AlertCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleItems } from '@/data/items.data'
import type { Item } from '../types/item.types'
import { UNIT_OF_MEASURE_KEYS, ITEM_STATUS_CONFIG } from '../types/item.types'

interface ItemDetailPanelProps {
  itemId: string | null
  isOpen: boolean
  onClose: () => void
  onEdit: (item: Item) => void
}

export function ItemDetailPanel({ itemId, isOpen, onClose, onEdit }: ItemDetailPanelProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [activeTab, setActiveTab] = useState('info')
  const items = sampleItems

  // Find the item from the list
  const selectedItem = (items as Item[])?.find((i: Item) => i.id === itemId)

  if (!selectedItem) {
    return null
  }

  const profitMargin = selectedItem.costPrice > 0
    ? ((selectedItem.sellingPrice - selectedItem.costPrice) / selectedItem.sellingPrice) * 100
    : 0

  const profitPerUnit = selectedItem.sellingPrice - selectedItem.costPrice

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl">{selectedItem.name}</SheetTitle>
              {selectedItem.sku && (
                <p className="text-sm text-muted-foreground mt-1">{t('inventory.sku')}: {selectedItem.sku}</p>
              )}
            </div>
            <StatusBadge variant={ITEM_STATUS_CONFIG[selectedItem.status]?.variant}>
              {t(ITEM_STATUS_CONFIG[selectedItem.status]?.key)}
            </StatusBadge>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">{t('common.info')}</TabsTrigger>
            <TabsTrigger value="stock">{t('inventory.stock')}</TabsTrigger>
            <TabsTrigger value="history">{t('common.history')}</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {t('inventory.basicInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('inventory.unitOfMeasure')}</p>
                    <p className="font-medium">
                      {t(UNIT_OF_MEASURE_KEYS[selectedItem.unitOfMeasure]) || selectedItem.unitOfMeasure}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('common.category')}</p>
                    <p className="font-medium">{selectedItem.category?.name}</p>
                  </div>
                </div>

                {selectedItem.barcode && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">{t('inventory.barcode')}</p>
                    <p className="font-medium font-mono">{selectedItem.barcode}</p>
                  </div>
                )}

                {selectedItem.serialNumber && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">{t('inventory.serialNumber')}</p>
                    <p className="font-medium font-mono">{selectedItem.serialNumber}</p>
                  </div>
                )}

                {selectedItem.description && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <p className="text-muted-foreground">{t('common.description')}</p>
                      <p className="mt-1">{selectedItem.description}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  {selectedItem.hasSerialNumbers && (
                    <Badge variant="secondary">{t('inventory.serialTracking')}</Badge>
                  )}
                  {selectedItem.hasExpiry && (
                    <Badge variant="secondary">{t('inventory.expiryTracking')}</Badge>
                  )}
                  {selectedItem.stockTracked && (
                    <Badge variant="secondary">{t('inventory.stockTracked')}</Badge>
                  )}
                  {selectedItem.isActive && (
                    <StatusBadge variant="success">{t('status.active')}</StatusBadge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('inventory.pricing')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('inventory.costPrice')}</p>
                    <p className="font-medium text-lg">{formatAmount(selectedItem.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('inventory.sellingPrice')}</p>
                    <p className="font-medium text-lg">{formatAmount(selectedItem.sellingPrice)}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('inventory.profitPerUnit')}</span>
                    <span className={cn('font-medium', profitPerUnit >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {formatAmount(profitPerUnit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('inventory.profitMargin')}</span>
                    <span className={cn('font-medium', profitMargin >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => onEdit(selectedItem)} className="w-full">
              {t('inventory.editItem')}
            </Button>
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('inventory.stockInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedItem.stockTracked ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('inventory.reorderPoint')}</p>
                        <p className="font-medium text-lg">{selectedItem.reorderPoint}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('inventory.reorderQuantity')}</p>
                        <p className="font-medium text-lg">{selectedItem.reorderQuantity}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-sm">
                      <p className="text-muted-foreground">{t('inventory.leadTime')}</p>
                      <p className="font-medium">{selectedItem.leadTimeDays} {t('common.days')}</p>
                    </div>

                    {/* Stock Level Indicator */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('inventory.currentStockLevel')}</span>
                        <StatusBadge
                          variant={selectedItem.reorderPoint <= 5 ? 'error' : selectedItem.reorderPoint <= 10 ? 'warning' : 'success'}
                        >
                          {selectedItem.reorderPoint <= 5 ? t('inventory.low') : selectedItem.reorderPoint <= 10 ? t('inventory.medium') : t('inventory.good')}
                        </StatusBadge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            selectedItem.reorderPoint <= 5
                              ? 'bg-red-500'
                              : selectedItem.reorderPoint <= 10
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          )}
                          style={{ width: `${Math.min((selectedItem.reorderPoint / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {selectedItem.hasExpiry && selectedItem.expiryDays && (
                      <>
                        <Separator />
                        <div className="text-sm">
                          <p className="text-muted-foreground">{t('inventory.expiryWarningPeriod')}</p>
                          <p className="font-medium">{selectedItem.expiryDays} {t('common.days')}</p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('inventory.stockTrackingNotEnabled')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                {t('inventory.stockIn')}
              </Button>
              <Button variant="outline" className="flex-1">
                {t('inventory.stockOut')}
              </Button>
              <Button variant="outline" className="flex-1">
                {t('inventory.transfer')}
              </Button>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  {t('inventory.movementHistory')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('inventory.noStockMovements')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

export default ItemDetailPanel

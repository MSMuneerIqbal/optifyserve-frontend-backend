/**
 * Line Items Table Component
 * Phase 6: Sales Module
 *
 * Reusable table for managing line items in quotations and invoices
 * Fully responsive with mobile card view
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { cn, generateId } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { calculateLineItemVat } from '../hooks/use-vat-calculator'
import type { VatStatus } from '../types/invoice.types'
import { VAT_STATUS_KEYS } from '../types/invoice.types'

/**
 * Line item interface for the table
 */
export interface LineItem {
  id: string
  itemCode?: string
  itemName: string
  description?: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  vatStatus: VatStatus
  // Calculated fields
  discountAmount?: number
  vatAmount?: number
  lineTotal?: number
  lineTotalWithVat?: number
}

interface LineItemsTableProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  readOnly?: boolean
  showVatColumn?: boolean
  className?: string
}

/**
 * Default units for selection (labels resolved via t() in component)
 */
const UNITS = [
  { value: 'pcs', labelKey: 'sales.pieces' },
  { value: 'units', labelKey: 'sales.units' },
  { value: 'hrs', labelKey: 'sales.hoursUnit' },
  { value: 'days', labelKey: 'sales.daysUnit' },
  { value: 'kg', labelKey: 'sales.kilograms' },
  { value: 'meters', labelKey: 'sales.meters' },
  { value: 'sqm', labelKey: 'sales.squareMeters' },
  { value: 'service', labelKey: 'sales.service' },
  { value: 'job', labelKey: 'sales.job' },
  { value: 'month', labelKey: 'sales.month' },
  { value: 'contract', labelKey: 'sales.contract' },
]

/**
 * Create empty line item
 */
function createEmptyItem(): LineItem {
  return {
    id: generateId(),
    itemName: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    discount: 0,
    vatStatus: 'standard',
  }
}

/**
 * Calculate line item totals
 */
function calculateTotals(item: LineItem): LineItem {
  const calc = calculateLineItemVat({
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discount: item.discount,
    vatStatus: item.vatStatus,
  })

  return {
    ...item,
    discountAmount: calc.discountAmount,
    vatAmount: calc.vatAmount,
    lineTotal: calc.netAmount,
    lineTotalWithVat: calc.totalWithVat,
  }
}

export function LineItemsTable({
  items,
  onChange,
  readOnly = false,
  showVatColumn = true,
  className,
}: LineItemsTableProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Add new item
  const handleAddItem = useCallback(() => {
    const newItem = calculateTotals(createEmptyItem())
    onChange([...items, newItem])
  }, [items, onChange])

  // Remove item
  const handleRemoveItem = useCallback(
    (id: string) => {
      onChange(items.filter((item) => item.id !== id))
    },
    [items, onChange]
  )

  // Update item field
  const handleUpdateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      onChange(
        items.map((item) => {
          if (item.id === id) {
            const updated = { ...item, [field]: value }
            return calculateTotals(updated)
          }
          return item
        })
      )
    },
    [items, onChange]
  )

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    onChange(newItems)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {!readOnly && <TableHead className="w-10"></TableHead>}
              <TableHead className="min-w-[200px]">{t('sales.itemDescription')}</TableHead>
              <TableHead className="w-20 text-center">{t('sales.quantity')}</TableHead>
              <TableHead className="w-24">{t('sales.unit')}</TableHead>
              <TableHead className="w-28 text-end">{t('sales.unitPrice')}</TableHead>
              <TableHead className="w-20 text-center">{t('sales.discountPercent')}</TableHead>
              {showVatColumn && <TableHead className="w-28">{t('sales.vat')}</TableHead>}
              <TableHead className="w-28 text-end">{t('sales.total')}</TableHead>
              {!readOnly && <TableHead className="w-10"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={readOnly ? 7 : 9}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('sales.noItemsYet')}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  draggable={!readOnly}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    draggedIndex === index && 'opacity-50 bg-muted',
                    !readOnly && 'cursor-move'
                  )}
                >
                  {!readOnly && (
                    <TableCell className="text-center">
                      <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                    </TableCell>
                  )}
                  <TableCell>
                    {readOnly ? (
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        {item.itemCode && (
                          <p className="text-xs text-muted-foreground">{t('sales.code')}: {item.itemCode}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          value={item.itemName}
                          onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)}
                          placeholder={t('sales.itemNamePlaceholder')}
                          className="h-9"
                        />
                        <Input
                          value={item.description || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder={t('sales.descriptionOptional')}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-center block">{item.quantity}</span>
                    ) : (
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)
                        }
                        className="h-9 text-center"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span>{UNITS.find((u) => u.value === item.unit)?.labelKey ? t(UNITS.find((u) => u.value === item.unit)!.labelKey) : item.unit}</span>
                    ) : (
                      <Select
                        value={item.unit}
                        onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {t(unit.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-end">
                    {readOnly ? (
                      <span>{formatAmount(item.unitPrice)}</span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'unitPrice', Number(e.target.value) || 0)
                        }
                        className="h-9 text-end"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-center block">{item.discount}%</span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            'discount',
                            Math.min(100, Math.max(0, Number(e.target.value) || 0))
                          )
                        }
                        className="h-9 text-center"
                      />
                    )}
                  </TableCell>
                  {showVatColumn && (
                    <TableCell>
                      {readOnly ? (
                        <span>{t(VAT_STATUS_KEYS[item.vatStatus])}</span>
                      ) : (
                        <Select
                          value={item.vatStatus}
                          onValueChange={(value) =>
                            handleUpdateItem(item.id, 'vatStatus', value as VatStatus)
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">{t('sales.standardVat')}</SelectItem>
                            <SelectItem value="zero-rated">{t('sales.zeroRated')}</SelectItem>
                            <SelectItem value="exempt">{t('sales.vatExempt')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-end font-medium">
                    {formatAmount(item.lineTotalWithVat || 0)}
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('sales.noItemsYet')}
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card key={item.id} className="relative">
              <CardContent className="pt-4 pb-4 space-y-4">
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-1 end-1 sm:top-2 sm:end-2 h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                {/* Item Number Badge */}
                <div className="absolute top-2 start-4 text-xs text-muted-foreground">
                  {t('sales.itemNumber', { number: index + 1 })}
                </div>

                {/* Item Name & Description */}
                <div className="pt-4">
                  {readOnly ? (
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">{t('sales.itemNameRequired')}</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)}
                          placeholder={t('sales.itemNamePlaceholder')}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{t('sales.description')}</Label>
                        <Input
                          value={item.description || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder={t('sales.descriptionOptional')}
                          className="h-10"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity, Unit, Price Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">{t('sales.quantity')}</Label>
                    {readOnly ? (
                      <p className="font-medium">{item.quantity}</p>
                    ) : (
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)
                        }
                        className="h-10"
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-xs">{t('sales.unit')}</Label>
                    {readOnly ? (
                      <p className="font-medium">
                        {UNITS.find((u) => u.value === item.unit)?.labelKey ? t(UNITS.find((u) => u.value === item.unit)!.labelKey) : item.unit}
                      </p>
                    ) : (
                      <Select
                        value={item.unit}
                        onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {t(unit.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs">{t('sales.unitPrice')}</Label>
                    {readOnly ? (
                      <p className="font-medium">{formatAmount(item.unitPrice)}</p>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'unitPrice', Number(e.target.value) || 0)
                        }
                        className="h-10"
                      />
                    )}
                  </div>
                </div>

                {/* Discount & VAT Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t('sales.discountPercent')}</Label>
                    {readOnly ? (
                      <p className="font-medium">{item.discount}%</p>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            'discount',
                            Math.min(100, Math.max(0, Number(e.target.value) || 0))
                          )
                        }
                        className="h-10"
                      />
                    )}
                  </div>
                  {showVatColumn && (
                    <div>
                      <Label className="text-xs">{t('sales.vatStatus')}</Label>
                      {readOnly ? (
                        <p className="font-medium">{t(VAT_STATUS_KEYS[item.vatStatus])}</p>
                      ) : (
                        <Select
                          value={item.vatStatus}
                          onValueChange={(value) =>
                            handleUpdateItem(item.id, 'vatStatus', value as VatStatus)
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">{t('sales.standardVat')}</SelectItem>
                            <SelectItem value="zero-rated">{t('sales.zeroRated')}</SelectItem>
                            <SelectItem value="exempt">{t('sales.vatExempt')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}
                </div>

                {/* Line Total */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">{t('sales.lineTotalInclVat')}</span>
                  <span className="text-lg font-semibold text-primary">
                    {formatAmount(item.lineTotalWithVat || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Item Button */}
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          className="w-full h-12 border-dashed"
        >
          <Plus className="h-4 w-4 me-2" />
          {t('sales.addItem')}
        </Button>
      )}
    </div>
  )
}

export default LineItemsTable

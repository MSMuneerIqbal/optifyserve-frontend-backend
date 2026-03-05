/**
 * Purchase Order Line Items Table
 * Phase 8: Purchase Module
 *
 * Editable line items for purchase orders
 * Responsive with mobile card view
 */

import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
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
import { calculatePOLineItem } from '../utils/po-calculator'

export interface POLineItemData {
  id: string
  itemCode?: string
  itemName: string
  description?: string
  quantity: number
  unit: string
  unitCost: number
  discount: number
  vatRate: number
  // Calculated
  subtotal?: number
  discountAmount?: number
  vatAmount?: number
  total?: number
}

interface POLineItemsTableProps {
  items: POLineItemData[]
  onChange: (items: POLineItemData[]) => void
  readOnly?: boolean
  className?: string
}

const UNIT_KEYS = [
  { value: 'pcs', labelKey: 'purchase.unitPieces' },
  { value: 'units', labelKey: 'purchase.unitUnits' },
  { value: 'kg', labelKey: 'purchase.unitKilograms' },
  { value: 'liters', labelKey: 'purchase.unitLiters' },
  { value: 'meters', labelKey: 'purchase.unitMeters' },
  { value: 'boxes', labelKey: 'purchase.unitBoxes' },
  { value: 'rolls', labelKey: 'purchase.unitRolls' },
  { value: 'sets', labelKey: 'purchase.unitSets' },
  { value: 'service', labelKey: 'purchase.unitService' },
]

function createEmptyItem(): POLineItemData {
  return {
    id: generateId(),
    itemName: '',
    quantity: 1,
    unit: 'pcs',
    unitCost: 0,
    discount: 0,
    vatRate: 5,
  }
}

function recalculate(item: POLineItemData): POLineItemData {
  const calc = calculatePOLineItem(
    item.quantity,
    item.unitCost,
    item.discount,
    item.vatRate,
  )
  return {
    ...item,
    subtotal: calc.total,
    discountAmount: calc.discountAmount,
    vatAmount: calc.vatAmount,
    total: calc.totalWithVat,
  }
}

export function POLineItemsTable({ items, onChange, readOnly = false, className }: POLineItemsTableProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  const UNITS = useMemo(() => UNIT_KEYS.map((u) => ({
    value: u.value,
    label: t(u.labelKey),
  })), [t])

  const handleAddItem = useCallback(() => {
    const newItem = recalculate(createEmptyItem())
    onChange([...items, newItem])
  }, [items, onChange])

  const handleRemoveItem = useCallback(
    (id: string) => { onChange(items.filter((item) => item.id !== id)) },
    [items, onChange]
  )

  const handleUpdateItem = useCallback(
    (id: string, field: keyof POLineItemData, value: string | number) => {
      onChange(
        items.map((item) => {
          if (item.id === id) {
            const updated = { ...item, [field]: value }
            return recalculate(updated)
          }
          return item
        })
      )
    },
    [items, onChange]
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[200px]">{t('purchase.itemDescription')}</TableHead>
              <TableHead className="w-20 text-center">{t('purchase.qty')}</TableHead>
              <TableHead className="w-24">{t('purchase.unit')}</TableHead>
              <TableHead className="w-28 text-end">{t('purchase.unitCost')}</TableHead>
              <TableHead className="w-20 text-center">{t('purchase.discPercent')}</TableHead>
              <TableHead className="w-20 text-center">{t('purchase.vatPercent')}</TableHead>
              <TableHead className="w-28 text-end">{t('common.total')}</TableHead>
              {!readOnly && <TableHead className="w-10"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 7 : 8} className="h-24 text-center text-muted-foreground">
                  {t('purchase.noItemsAddedYet')}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {readOnly ? (
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        {item.itemCode && <p className="text-xs text-muted-foreground">{t('purchase.codePrefix')}: {item.itemCode}</p>}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          value={item.itemName}
                          onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)}
                          placeholder={t('purchase.itemNamePlaceholder')}
                          className="h-9"
                        />
                        <Input
                          value={item.description || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder={t('purchase.descriptionOptionalPlaceholder')}
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
                        type="number" min="1" value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)}
                        className="h-9 text-center"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span>{UNITS.find((u) => u.value === item.unit)?.label || item.unit}</span>
                    ) : (
                      <Select value={item.unit} onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-end">
                    {readOnly ? (
                      <span>{formatAmount(item.unitCost)}</span>
                    ) : (
                      <Input
                        type="number" min="0" step="0.01" value={item.unitCost}
                        onChange={(e) => handleUpdateItem(item.id, 'unitCost', Number(e.target.value) || 0)}
                        className="h-9 text-end"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-center block">{item.discount}%</span>
                    ) : (
                      <Input
                        type="number" min="0" max="100" value={item.discount}
                        onChange={(e) => handleUpdateItem(item.id, 'discount', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                        className="h-9 text-center"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-center block">{item.vatRate}%</span>
                    ) : (
                      <Select
                        value={String(item.vatRate)}
                        onValueChange={(value) => handleUpdateItem(item.id, 'vatRate', Number(value))}
                      >
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="0">0%</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-end font-medium">
                    {formatAmount(item.total || 0)}
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <Button
                        variant="ghost" size="icon"
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('purchase.noItemsAddedYet')}
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card key={item.id} className="relative">
              <CardContent className="pt-4 pb-4 space-y-4">
                {!readOnly && (
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 end-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="text-xs text-muted-foreground">{t('purchase.itemNumber', { number: index + 1 })}</div>

                <div className="pt-2">
                  {readOnly ? (
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">{t('purchase.itemName')} *</Label>
                        <Input value={item.itemName} onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)} placeholder={t('purchase.itemNamePlaceholder')} className="h-10" />
                      </div>
                      <div>
                        <Label className="text-xs">{t('common.description')}</Label>
                        <Input value={item.description || ''} onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)} placeholder={t('purchase.descriptionOptionalPlaceholder')} className="h-10" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">{t('purchase.quantity')}</Label>
                    {readOnly ? <p className="font-medium">{item.quantity}</p> : (
                      <Input type="number" min="1" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)} className="h-10" />
                    )}
                  </div>
                  <div>
                    <Label className="text-xs">{t('purchase.unit')}</Label>
                    {readOnly ? <p className="font-medium">{item.unit}</p> : (
                      <Select value={item.unit} onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {UNITS.map((unit) => (<SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs">{t('purchase.unitCost')}</Label>
                    {readOnly ? <p className="font-medium">{formatAmount(item.unitCost)}</p> : (
                      <Input type="number" min="0" step="0.01" value={item.unitCost} onChange={(e) => handleUpdateItem(item.id, 'unitCost', Number(e.target.value) || 0)} className="h-10" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t('purchase.discPercent')}</Label>
                    {readOnly ? <p className="font-medium">{item.discount}%</p> : (
                      <Input type="number" min="0" max="100" value={item.discount} onChange={(e) => handleUpdateItem(item.id, 'discount', Math.min(100, Math.max(0, Number(e.target.value) || 0)))} className="h-10" />
                    )}
                  </div>
                  <div>
                    <Label className="text-xs">{t('purchase.vatPercent')}</Label>
                    {readOnly ? <p className="font-medium">{item.vatRate}%</p> : (
                      <Select value={String(item.vatRate)} onValueChange={(value) => handleUpdateItem(item.id, 'vatRate', Number(value))}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="0">0%</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">{t('purchase.lineTotalInclVAT')}</span>
                  <span className="text-lg font-semibold text-primary">{formatAmount(item.total || 0)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!readOnly && (
        <Button type="button" variant="outline" onClick={handleAddItem} className="w-full h-12 border-dashed">
          <Plus className="h-4 w-4 me-2" />
          {t('purchase.addItem')}
        </Button>
      )}
    </div>
  )
}

export default POLineItemsTable

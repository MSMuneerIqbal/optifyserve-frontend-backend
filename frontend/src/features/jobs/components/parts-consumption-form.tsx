/**
 * Parts Consumption Form Component
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useCurrency } from '@/contexts/currency-context'
import { Loader2, Plus, Trash2, Package } from 'lucide-react'
import type { InventoryPart, PartConsumptionFormData } from '../types/parts-consumption.types'

interface PartsConsumptionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PartConsumptionFormData) => void
  isLoading: boolean
  jobId: string
  jobNumber: string
  availableParts: InventoryPart[]
}

interface PartLine {
  partId: string
  partName: string
  quantity: number
  unitPrice: number
  warehouseId: string
}

export function PartsConsumptionForm({
  isOpen, onClose, onSubmit, isLoading, jobId, jobNumber, availableParts,
}: PartsConsumptionFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [lines, setLines] = useState<PartLine[]>([])
  const [notes, setNotes] = useState('')

  const addLine = () => {
    setLines(prev => [...prev, { partId: '', partName: '', quantity: 1, unitPrice: 0, warehouseId: '' }])
  }

  const removeLine = (index: number) => {
    setLines(prev => prev.filter((_, i) => i !== index))
  }

  const updateLine = (index: number, updates: Partial<PartLine>) => {
    setLines(prev => prev.map((line, i) => {
      if (i !== index) return line
      const updated = { ...line, ...updates }

      if (updates.partId) {
        const part = availableParts.find(p => p.id === updates.partId)
        if (part) {
          updated.partName = part.name
          updated.unitPrice = part.unitPrice
          updated.warehouseId = part.warehouseId
        }
      }
      return updated
    }))
  }

  const total = lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0)

  const handleSubmit = () => {
    const validLines = lines.filter(l => l.partId && l.quantity > 0)
    if (validLines.length === 0) return

    onSubmit({
      jobId,
      parts: validLines.map(l => ({
        partId: l.partId,
        partName: l.partName,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        warehouseId: l.warehouseId,
      })),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <DialogTitle>{t('jobs.recordPartsUsed')}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono">{jobNumber}</Badge>
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 pb-6">
            {lines.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('jobs.noPartsAdded')}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={addLine}>
                  <Plus className="h-4 w-4 me-1.5" />{t('jobs.addPart')}
                </Button>
              </div>
            ) : (
              lines.map((line, index) => (
                <Card key={index} className="p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5">
                      <Label className="text-xs">{t('jobs.part')}</Label>
                      <Select value={line.partId} onValueChange={(v) => updateLine(index, { partId: v })}>
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue placeholder={t('jobs.selectPart')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableParts.map(part => (
                            <SelectItem key={part.id} value={part.id}>
                              {part.name} ({part.availableStock} in stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">{t('common.qty')}</Label>
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                        min={1}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">{t('common.unitPrice')}</Label>
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })}
                        min={0}
                        step={0.01}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">{t('common.total')}</Label>
                      <p className="text-sm font-medium h-9 flex items-center mt-1">
                        {formatAmount(line.quantity * line.unitPrice)}
                      </p>
                    </div>
                    <div className="sm:col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500"
                        onClick={() => removeLine(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            {lines.length > 0 && (
              <Button variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4 me-1.5" />{t('jobs.addAnotherPart')}
              </Button>
            )}

            <div>
              <Label>{t('common.notes')}</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t('jobs.partsNotesPlaceholder')}
                className="mt-1"
              />
            </div>

            {lines.length > 0 && (
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{t('jobs.totalPartsCost')}</p>
                  <p className="text-lg font-bold">{formatAmount(total)}</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || lines.filter(l => l.partId).length === 0}
          >
            {isLoading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
            {t('jobs.recordParts')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PartsConsumptionForm

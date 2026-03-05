/**
 * Service Checklist Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CheckCircle, Circle, MinusCircle, HelpCircle } from 'lucide-react'
import type { ChecklistItem, ChecklistItemStatus } from '../types/service-report.types'

interface ServiceChecklistProps {
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
  readonly?: boolean
}

const STATUS_ICONS: Record<ChecklistItemStatus, React.ElementType> = {
  pending: Circle,
  completed: CheckCircle,
  skipped: MinusCircle,
  na: HelpCircle,
}

const STATUS_COLORS: Record<ChecklistItemStatus, string> = {
  pending: 'text-muted-foreground',
  completed: 'text-green-600',
  skipped: 'text-amber-500',
  na: 'text-slate-400',
}

export function ServiceChecklist({ items, onChange, readonly }: ServiceChecklistProps) {
  const { t } = useTranslation()
  const toggleItem = (index: number) => {
    if (readonly) return
    const updated = [...items]
    const current = updated[index].status
    updated[index] = {
      ...updated[index],
      status: current === 'completed' ? 'pending' : 'completed',
    }
    onChange(updated)
  }

  const cycleStatus = (index: number) => {
    if (readonly) return
    const updated = [...items]
    const statusOrder: ChecklistItemStatus[] = ['pending', 'completed', 'skipped', 'na']
    const currentIdx = statusOrder.indexOf(updated[index].status)
    updated[index] = {
      ...updated[index],
      status: statusOrder[(currentIdx + 1) % statusOrder.length],
    }
    onChange(updated)
  }

  const updateNotes = (index: number, notes: string) => {
    if (readonly) return
    const updated = [...items]
    updated[index] = { ...updated[index], notes }
    onChange(updated)
  }

  const completedCount = items.filter(i => i.status === 'completed').length
  const requiredCount = items.filter(i => i.isRequired).length
  const requiredDone = items.filter(i => i.isRequired && i.status === 'completed').length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t('jobs.checklist')}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {completedCount}/{items.length} {t('common.done')}
          </Badge>
          <Badge variant={requiredDone === requiredCount ? 'default' : 'secondary'} className="text-xs">
            {requiredDone}/{requiredCount} {t('common.required')}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const Icon = STATUS_ICONS[item.status]
          return (
            <Card key={item.id} className={cn('p-3', item.status === 'completed' && 'bg-green-50/50')}>
              <div className="flex items-start gap-3">
                {!readonly ? (
                  <Checkbox
                    checked={item.status === 'completed'}
                    onCheckedChange={() => toggleItem(index)}
                    className="mt-0.5"
                  />
                ) : (
                  <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', STATUS_COLORS[item.status])} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      'text-sm',
                      item.status === 'completed' && 'line-through text-muted-foreground',
                    )}>
                      {item.label}
                    </p>
                    {item.isRequired && (
                      <span className="text-xs text-red-500">*</span>
                    )}
                    {!readonly && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground ms-auto shrink-0"
                        onClick={() => cycleStatus(index)}
                      >
                        {item.status === 'skipped' ? t('status.skipped') : item.status === 'na' ? t('status.na') : ''}
                      </button>
                    )}
                  </div>
                  {!readonly ? (
                    <Input
                      placeholder={t('jobs.notesOptional')}
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(index, e.target.value)}
                      className="mt-1 h-7 text-xs"
                    />
                  ) : item.notes ? (
                    <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                  ) : null}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ServiceChecklist

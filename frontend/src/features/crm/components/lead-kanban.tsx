/**
 * Lead Kanban Board Component
 * Phase 5: CRM Module - Lead Management
 *
 * Drag and drop Kanban board for lead pipeline
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Inbox, Plus } from 'lucide-react'
import { LeadCard } from './lead-card'
import type { Lead, LeadStage, StageSummary } from '../types/lead.types'

interface LeadKanbanProps {
  leadsByStage: Record<LeadStage, Lead[]>
  stageSummaries: StageSummary[]
  onLeadClick: (lead: Lead) => void
  onStageChange: (leadId: string, newStage: LeadStage) => void
  onAddLead?: (stage: LeadStage) => void
  isUpdating?: boolean
}

// Stage style configuration (labels resolved via i18n)
const stageStyles: Record<
  LeadStage,
  { labelKey: string; color: string; bgColor: string; borderColor: string }
> = {
  new: {
    labelKey: 'crm.newLeads',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
  contacted: {
    labelKey: 'crm.contacted',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-300',
  },
  'follow-up': {
    labelKey: 'crm.followUp',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
  },
  qualified: {
    labelKey: 'crm.qualified',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  proposal: {
    labelKey: 'crm.proposal',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
  negotiation: {
    labelKey: 'crm.negotiation',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
  'closed-won': {
    labelKey: 'crm.closedWon',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  'closed-lost': {
    labelKey: 'crm.closedLost',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
}

// Active stages for main Kanban view (excluding closed stages)
const activeStages: LeadStage[] = [
  'new',
  'contacted',
  'follow-up',
  'qualified',
  'proposal',
  'negotiation',
]

// Closed stages shown separately
const closedStages: LeadStage[] = ['closed-won', 'closed-lost']

export function LeadKanban({
  leadsByStage,
  stageSummaries,
  onLeadClick,
  onStageChange,
  onAddLead,
  isUpdating,
}: LeadKanbanProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null)

  // Get summary for a stage
  const getSummary = useCallback(
    (stage: LeadStage): StageSummary | undefined => {
      return stageSummaries.find((s) => s.stage === stage)
    },
    [stageSummaries]
  )

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent, lead: Lead) => {
      setDraggedLead(lead)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', lead.id)
    },
    []
  )

  const handleDragEnd = useCallback(() => {
    setDraggedLead(null)
    setDragOverStage(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stage)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverStage(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStage: LeadStage) => {
      e.preventDefault()
      const leadId = e.dataTransfer.getData('text/plain')

      if (draggedLead && draggedLead.stage !== targetStage) {
        onStageChange(leadId, targetStage)
      }

      setDraggedLead(null)
      setDragOverStage(null)
    },
    [draggedLead, onStageChange]
  )

  // Render a single column
  const renderColumn = (stage: LeadStage) => {
    const config = stageStyles[stage]
    const leads = leadsByStage[stage] || []
    const summary = getSummary(stage)
    const isDropTarget = dragOverStage === stage && draggedLead?.stage !== stage

    return (
      <div
        key={stage}
        className={cn(
          'flex flex-col w-[85vw] min-w-[85vw] sm:w-[280px] sm:min-w-[280px] bg-muted/30 rounded-lg border',
          isDropTarget && 'border-2 border-dashed border-primary bg-primary/5',
          config.borderColor
        )}
        onDragOver={(e) => handleDragOver(e, stage)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, stage)}
      >
        {/* Column Header */}
        <div className={cn('p-3 rounded-t-lg', config.bgColor)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className={cn('font-semibold text-sm', config.color)}>
                {t(config.labelKey)}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {leads.length}
              </Badge>
            </div>
            {onAddLead && !closedStages.includes(stage) && (
              <button
                onClick={() => onAddLead(stage)}
                className={cn(
                  'p-1 rounded hover:bg-white/50 transition-colors',
                  config.color
                )}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          {summary && summary.totalValue > 0 && (
            <p className={cn('text-xs mt-1', config.color)}>
              {formatAmount(summary.totalValue)}
            </p>
          )}
        </div>

        {/* Cards Container */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2 min-h-[100px]">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => onLeadClick(lead)}
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedLead?.id === lead.id}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Inbox className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-xs">{t('crm.noLeadsInStage')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: '500px' }}>
      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* Main Kanban Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 min-h-[500px] overflow-x-auto snap-x snap-mandatory sm:snap-none">
          {activeStages.map((stage) => renderColumn(stage))}
        </div>
      </div>

      {/* Closed Stages (Collapsed) */}
      <div className="border-t bg-muted/20 p-4">
        <div className="flex items-center gap-4">
          <h4 className="text-sm font-medium text-muted-foreground">{t('crm.closed')}</h4>
          <div className="flex gap-4">
            {closedStages.map((stage) => {
              const config = stageStyles[stage]
              const leads = leadsByStage[stage] || []
              const summary = getSummary(stage)

              return (
                <div
                  key={stage}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border',
                    config.bgColor,
                    config.borderColor
                  )}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <span className={cn('font-medium text-sm', config.color)}>
                    {t(config.labelKey)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {leads.length}
                  </Badge>
                  {summary && summary.totalValue > 0 && (
                    <span className={cn('text-xs', config.color)}>
                      ({formatAmount(summary.totalValue)})
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadKanban

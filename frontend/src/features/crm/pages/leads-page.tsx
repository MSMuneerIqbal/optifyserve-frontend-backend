/**
 * Leads Page
 * Phase 5: CRM Module - Lead Management
 *
 * Main page for lead pipeline management with Kanban board
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { Plus, LayoutGrid, List, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { LeadKanban } from '../components/lead-kanban'
import { LeadDetailModal } from '../components/lead-detail-modal'
import { LeadForm } from '../components/lead-form'
import { sampleLeads } from '@/data/leads.data'
import type { Lead, LeadStage, LeadFormData, StageSummary } from '../types/lead.types'

type ViewMode = 'kanban' | 'list'

export function LeadsPage() {
  const { t } = useTranslation()
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null)
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null)
  // initialStage is set when adding leads from a specific column
  // Will be passed to LeadForm when that feature is implemented
  const [, setInitialStage] = useState<LeadStage>('new')

  // Static data
  const leads = sampleLeads
  const isLoading = false
  const isSubmitting = false
  const error = null

  const refetch = useCallback(() => {
    // No-op with static data
  }, [])

  // Derive leadsByStage from flat list
  const leadsByStage = useMemo(() => {
    const stages: Record<string, Lead[]> = {
      new: [],
      contacted: [],
      'follow-up': [],
      qualified: [],
      proposal: [],
      negotiation: [],
      'closed-won': [],
      'closed-lost': [],
    }
    for (const lead of leads) {
      if (stages[lead.stage]) {
        stages[lead.stage].push(lead)
      }
    }
    return stages
  }, [leads])

  // Derive stage summaries
  const stageSummaries: StageSummary[] = useMemo(() => {
    return Object.entries(leadsByStage).map(([stage, stageLeads]) => ({
      stage: stage as LeadStage,
      count: stageLeads.length,
      totalValue: stageLeads.reduce(
        (sum, l) => sum + ((l.estimatedValue?.max ?? 0) + (l.estimatedValue?.min ?? 0)) / 2,
        0
      ),
    }))
  }, [leadsByStage])

  const isFetching = isLoading

  // Handlers
  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLeadId(lead.id)
    setIsDetailModalOpen(true)
  }, [])

  const handleStageChange = useCallback(
    (_leadId: string, _newStage: LeadStage) => {
      toast.success(t('crm.leadStageUpdated'))
    },
    [t]
  )

  const handleAddLead = useCallback((stage?: LeadStage) => {
    setLeadToEdit(null)
    setInitialStage(stage || 'new')
    setIsFormOpen(true)
  }, [])

  const handleEditLead = useCallback((lead: Lead) => {
    setLeadToEdit(lead)
    setIsDetailModalOpen(false)
    setTimeout(() => {
      setIsFormOpen(true)
    }, 100)
  }, [])


  const handleFormSubmit = useCallback(
    (_data: LeadFormData) => {
      if (leadToEdit) {
        toast.success(t('crm.leadUpdated'))
        setIsFormOpen(false)
        setLeadToEdit(null)
      } else {
        toast.success(t('crm.leadCreated'))
        setIsFormOpen(false)
      }
    },
    [leadToEdit, t]
  )

  const handleConfirmDelete = useCallback(() => {
    if (leadToDelete) {
      toast.success(t('crm.leadDeleted'))
      setLeadToDelete(null)
      if (selectedLeadId === leadToDelete) {
        setIsDetailModalOpen(false)
        setSelectedLeadId(null)
      }
    }
  }, [leadToDelete, selectedLeadId, t])

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    setSelectedLeadId(null)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setLeadToEdit(null)
  }, [])

  // Calculate totals
  const totalLeads = Object.values(leadsByStage).flat().length
  const activeLeads = Object.entries(leadsByStage)
    .filter(([stage]) => !['closed-won', 'closed-lost'].includes(stage))
    .reduce((sum, [, leads]) => sum + leads.length, 0)
  const totalPipelineValue = stageSummaries
    .filter((s) => !['closed-won', 'closed-lost'].includes(s.stage))
    .reduce((sum, s) => sum + s.totalValue, 0)

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {/* Page Header */}
      <div className="p-4 sm:p-6 border-b bg-white">
        <PageHeader title={t('crm.leadsTitle')} description={t('crm.leadsDescription')}>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                className="px-3"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="px-3"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 me-2 ${isFetching ? 'animate-spin' : ''}`}
              />
              {t('common.refresh')}
            </Button>

            <Button onClick={() => handleAddLead()}>
              <Plus className="h-4 w-4 me-2" />
              {t('crm.addLead')}
            </Button>
          </div>
        </PageHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">{t('crm.totalLeads')}</p>
            <p className="text-2xl font-bold">{totalLeads}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">{t('crm.activePipeline')}</p>
            <p className="text-2xl font-bold text-blue-600">{activeLeads}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">{t('crm.pipelineValue')}</p>
            <p className="text-2xl font-bold text-emerald-600">
              {new Intl.NumberFormat('en-AE', {
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 1,
              }).format(totalPipelineValue)}{' '}
              {t('common.aed')}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">{t('crm.wonThisMonth')}</p>
            <p className="text-2xl font-bold text-green-600">
              {leadsByStage['closed-won']?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{t('crm.failedToLoadLeads')}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2"
          >
            {t('common.retry')}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="flex-1 overflow-hidden relative" style={{ minHeight: '500px' }}>
              <LeadKanban
                leadsByStage={leadsByStage}
                stageSummaries={stageSummaries}
                onLeadClick={handleLeadClick}
                onStageChange={handleStageChange}
                onAddLead={handleAddLead}
                isUpdating={isSubmitting}
              />
            </div>
          )}

          {/* List View (Placeholder) */}
          {viewMode === 'list' && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('crm.listViewComingSoon')}</p>
                <p className="text-sm">{t('crm.useKanbanForNow')}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lead Detail Modal */}
      <LeadDetailModal
        leadId={selectedLeadId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={handleEditLead}
      />

      {/* Lead Form Dialog */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        lead={leadToEdit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!leadToDelete}
        title={t('crm.deleteLead')}
        description={t('crm.deleteLeadConfirmation')}
        onConfirm={handleConfirmDelete}
        onClose={() => setLeadToDelete(null)}
        variant="destructive"
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default LeadsPage

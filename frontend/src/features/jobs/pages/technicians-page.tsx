/**
 * Technicians Page
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { TechnicianList } from '../components/technician-list'
import { TechnicianForm } from '../components/technician-form'
import { sampleTechnicianListItems } from '@/data/jobs.data'
import type { TechnicianListItem, TechnicianFormData, TechnicianFilters } from '../types/technician.types'

export function TechniciansPage() {
  const { t } = useTranslation()
  const [_filters, setFilters] = useState<TechnicianFilters>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<Partial<TechnicianFormData> | undefined>()
  const [editingTechId, setEditingTechId] = useState<string>()
  const [deleteTech, setDeleteTech] = useState<TechnicianListItem | null>(null)

  const isLoading = false
  const isSubmitting = false
  const technicians = sampleTechnicianListItems

  const handleAddTechnician = () => {
    setEditingTech(undefined)
    setEditingTechId(undefined)
    setIsFormOpen(true)
  }

  const handleEditTechnician = (tech: TechnicianListItem) => {
    setEditingTech({
      name: tech.name,
      employeeId: tech.employeeId,
      phone: tech.phone,
    })
    setEditingTechId(tech.id)
    setIsFormOpen(true)
  }

  const handleViewTechnician = (tech: TechnicianListItem) => {
    toast.info(t('jobs.viewingTechnician', { name: tech.name }))
  }

  const handleFormSubmit = (_data: TechnicianFormData) => {
    if (editingTechId) {
      toast.success(t('jobs.technicianUpdated'))
    } else {
      toast.success(t('jobs.technicianCreated'))
    }
    setIsFormOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTech) return
    toast.success(t('jobs.technicianDeleted'))
    setDeleteTech(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('jobs.techniciansTitle')}
        description={t('jobs.techniciansDescription')}
        actions={
          <Button onClick={handleAddTechnician}>
            <Plus className="h-4 w-4 me-1.5" />{t('jobs.addTechnician')}
          </Button>
        }
      />

      <TechnicianList
        technicians={technicians}
        isLoading={isLoading}
        onViewTechnician={handleViewTechnician}
        onEditTechnician={handleEditTechnician}
        onDeleteTechnician={setDeleteTech}
        onAddTechnician={handleAddTechnician}
        onFiltersChange={setFilters}
      />

      <TechnicianForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        technician={editingTech}
      />

      <ConfirmationDialog
        isOpen={!!deleteTech}
        onClose={() => setDeleteTech(null)}
        onConfirm={handleDeleteConfirm}
        title={t('jobs.deleteTechnician')}
        description={t('jobs.deleteTechnicianConfirmation', { name: deleteTech?.name })}
        variant="destructive"
      />
    </div>
  )
}

export default TechniciansPage

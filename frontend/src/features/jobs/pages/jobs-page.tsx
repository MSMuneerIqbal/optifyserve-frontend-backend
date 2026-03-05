/**
 * Jobs Page
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { toast } from 'sonner'
import { Plus, List, Map } from 'lucide-react'
import { JobList } from '../components/job-list'
import { JobForm } from '../components/job-form'
import { JobDetailPanel } from '../components/job-detail-panel'
import { JobMapView } from '../components/job-map-view'
import { TechnicianAssignmentModal } from '../components/technician-assignment-modal'
import { ServiceReportForm } from '../components/service-report-form'
import { sampleJobListItems, sampleTechnicianListItems } from '@/data/jobs.data'
import { sampleCustomers } from '@/data/customers.data'
import { sampleBranches } from '@/data/settings.data'
import type { Job, JobListItem, JobFormData, JobFilters } from '../types/job.types'
import type { TechnicianAssignmentSuggestion } from '../types/technician.types'

export function JobsPage() {
  const { t } = useTranslation()
  const [_filters, setFilters] = useState<JobFilters>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Partial<JobFormData> | undefined>()
  const [editingJobId, setEditingJobId] = useState<string>()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [deleteJob, setDeleteJob] = useState<JobListItem | null>(null)
  const [assignJob, setAssignJob] = useState<JobListItem | null>(null)
  const [reportJob, setReportJob] = useState<JobListItem | null>(null)
  const [view, setView] = useState<'list' | 'map'>('list')

  const isLoading = false
  const isSubmitting = false
  const jobs = sampleJobListItems

  const suggestions: TechnicianAssignmentSuggestion[] = sampleTechnicianListItems.slice(0, 3).map((tech, i) => ({
    technician: tech,
    score: 85 - i * 13,
    distanceKm: 3.2 + i * 5,
    estimatedTravelMinutes: 12 + i * 10,
    skillMatch: i < 2,
    skillLevel: i === 0 ? 'expert' as const : i === 1 ? 'intermediate' as const : 'beginner' as const,
    currentWorkload: tech.activeJobCount,
    isAvailable: tech.status === 'available',
    reasons: [
      `${i === 0 ? 'Expert' : i === 1 ? 'Intermediate' : 'Beginner'}-level skill match`,
      `${(3.2 + i * 5).toFixed(1)} km away`,
      tech.status === 'available' ? 'Currently available' : 'Currently busy',
    ],
  }))
  const isLoadingSuggestions = false

  const customers = sampleCustomers.map(c => ({ id: c.id, name: c.name }))
  const branches = sampleBranches.map(b => ({ id: b.id, name: b.name }))

  const handleAddJob = () => {
    setEditingJob(undefined)
    setEditingJobId(undefined)
    setIsFormOpen(true)
  }

  const handleEditJob = (job: JobListItem) => {
    setEditingJob({
      title: job.title,
      serviceType: job.serviceType,
      priority: job.priority,
      scheduledDate: job.scheduledDate,
      scheduledTime: job.scheduledTime,
      estimatedDuration: job.estimatedDuration,
      serviceAddress: job.serviceAddress,
    })
    setEditingJobId(job.id)
    setIsFormOpen(true)
  }

  const handleViewJob = (job: JobListItem) => {
    setSelectedJob(job as unknown as Job)
    setIsDetailOpen(true)
  }

  const handleFormSubmit = (_data: JobFormData) => {
    if (editingJobId) {
      toast.success(t('jobs.jobUpdated'))
    } else {
      toast.success(t('jobs.jobCreated'))
    }
    setIsFormOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!deleteJob) return
    toast.success(t('jobs.jobDeleted'))
    setDeleteJob(null)
  }

  const handleAssignTechnician = (_technicianId: string) => {
    if (!assignJob) return
    toast.success(t('jobs.technicianAssigned'))
    setAssignJob(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('jobs.jobsTitle')}
        description={t('jobs.jobsDescription')}
        actions={
          <Button onClick={handleAddJob}>
            <Plus className="h-4 w-4 me-1.5" />{t('jobs.newJob')}
          </Button>
        }
      />

      <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'map')}>
        <TabsList>
          <TabsTrigger value="list">
            <List className="h-4 w-4 me-1.5" />{t('common.list')}
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4 me-1.5" />{t('common.map')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <JobList
            jobs={jobs}
            isLoading={isLoading}
            onViewJob={handleViewJob}
            onEditJob={handleEditJob}
            onDeleteJob={setDeleteJob}
            onAssignTechnician={setAssignJob}
            onAddJob={handleAddJob}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <JobMapView
            jobs={jobs}
            isLoading={isLoading}
            onJobClick={handleViewJob}
          />
        </TabsContent>
      </Tabs>

      <JobForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        job={editingJob}
        customers={customers}
        branches={branches}
      />

      <JobDetailPanel
        job={selectedJob}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(j) => {
          setIsDetailOpen(false)
          handleEditJob(j as unknown as JobListItem)
        }}
        onDelete={(j) => {
          setIsDetailOpen(false)
          setDeleteJob(j as unknown as JobListItem)
        }}
        onAssignTechnician={(j) => {
          setIsDetailOpen(false)
          setAssignJob(j as unknown as JobListItem)
        }}
        onCreateServiceReport={(j) => {
          setIsDetailOpen(false)
          setReportJob(j as unknown as JobListItem)
        }}
      />

      {assignJob && (
        <TechnicianAssignmentModal
          isOpen={!!assignJob}
          onClose={() => setAssignJob(null)}
          jobTitle={assignJob.title}
          jobNumber={assignJob.jobNumber}
          suggestions={suggestions}
          isLoading={isLoadingSuggestions}
          isAssigning={false}
          onAssign={handleAssignTechnician}
        />
      )}

      {reportJob && (
        <ServiceReportForm
          isOpen={!!reportJob}
          onClose={() => setReportJob(null)}
          onSubmit={() => {
            toast.success(t('jobs.serviceReportSubmitted'))
            setReportJob(null)
          }}
          isLoading={false}
          jobId={reportJob.id}
          jobTitle={reportJob.title}
          jobNumber={reportJob.jobNumber}
          serviceType={reportJob.serviceType}
        />
      )}

      <ConfirmationDialog
        isOpen={!!deleteJob}
        onClose={() => setDeleteJob(null)}
        onConfirm={handleDeleteConfirm}
        title={t('jobs.deleteJob')}
        description={t('jobs.deleteJobConfirmation', { title: deleteJob?.title })}
        variant="destructive"
      />
    </div>
  )
}

export default JobsPage

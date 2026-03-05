/**
 * Job Detail Panel Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  MapPin, Clock, Calendar, User, Edit, Trash2,
  UserPlus, FileText, MessageSquare, AlertTriangle,
} from 'lucide-react'
import { JobStatusBadge, JobPriorityBadge } from './job-status-badge'
import { JobTimeline } from './job-timeline'
import { SERVICE_TYPE_CONFIG, EMIRATE_KEYS } from '../types/job.types'
import { formatDuration, formatTimeTo12Hr } from '../utils/schedule-calculator'
import { canEditJob, canAssignTechnician, canCreateServiceReport, getJobProgress } from '../utils/job-workflow'
import type { Job } from '../types/job.types'

interface JobDetailPanelProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
  onAssignTechnician: (job: Job) => void
  onCreateServiceReport: (job: Job) => void
}

export function JobDetailPanel({
  job, isOpen, onClose, onEdit, onDelete, onAssignTechnician, onCreateServiceReport,
}: JobDetailPanelProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  if (!job) return null

  const progress = getJobProgress(job.status)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-xs shrink-0">{job.jobNumber}</Badge>
                <JobPriorityBadge priority={job.priority} />
              </div>
              <SheetTitle className="text-lg text-start">{job.title}</SheetTitle>
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{t('common.progress')}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {canEditJob(job.status) && (
            <Button variant="outline" size="sm" onClick={() => onEdit(job)}>
              <Edit className="h-4 w-4 me-1.5" />{t('common.edit')}
            </Button>
          )}
          {canAssignTechnician(job.status) && (
            <Button variant="outline" size="sm" onClick={() => onAssignTechnician(job)}>
              <UserPlus className="h-4 w-4 me-1.5" />{t('jobs.assignTech')}
            </Button>
          )}
          {canCreateServiceReport(job.status) && (
            <Button variant="outline" size="sm" onClick={() => onCreateServiceReport(job)}>
              <FileText className="h-4 w-4 me-1.5" />{t('jobs.serviceReport')}
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-red-600" onClick={() => onDelete(job)}>
            <Trash2 className="h-4 w-4 me-1.5" />{t('common.delete')}
          </Button>
        </div>

        <Separator />

        <Tabs defaultValue="overview" className="px-6 pt-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('jobs.schedule')}</TabsTrigger>
            <TabsTrigger value="address">{t('common.address')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('jobs.timeline')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4 pb-6">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">{t('common.description')}</h4>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </Card>

            <Card className="p-4 space-y-3">
              <h4 className="text-sm font-medium">{t('common.details')}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.serviceType')}</p>
                  <Badge variant="outline" className="mt-0.5">
                    {t(SERVICE_TYPE_CONFIG[job.serviceType]?.key)}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.branch')}</p>
                  <p className="font-medium">{job.branchName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.customer')}</p>
                  <p className="font-medium">{job.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.recurring')}</p>
                  <p className="font-medium">{job.isRecurring ? `${t('common.yes')} (${job.recurringFrequency})` : t('common.no')}</p>
                </div>
              </div>
            </Card>

            {job.assignedTechnicianId && (
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />{t('jobs.assignedTechnician')}
                </h4>
                <p className="text-sm">{job.assignedTechnicianName || job.assignedTechnicianId}</p>
              </Card>
            )}

            {(job.internalNotes || job.customerNotes) && (
              <Card className="p-4 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />{t('common.notes')}
                </h4>
                {job.internalNotes && (
                  <div>
                    <p className="text-xs text-muted-foreground">{t('jobs.internalNotes')}</p>
                    <p className="text-sm mt-0.5">{job.internalNotes}</p>
                  </div>
                )}
                {job.customerNotes && (
                  <div>
                    <p className="text-xs text-muted-foreground">{t('jobs.customerNotes')}</p>
                    <p className="text-sm mt-0.5">{job.customerNotes}</p>
                  </div>
                )}
              </Card>
            )}

            {(job.estimatedCost !== undefined || job.totalCost !== undefined) && (
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">{t('jobs.costSummary')}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {job.estimatedCost !== undefined && (
                    <div>
                      <p className="text-muted-foreground text-xs">{t('jobs.estimated')}</p>
                      <p className="font-medium">{formatAmount(job.estimatedCost)}</p>
                    </div>
                  )}
                  {job.totalCost !== undefined && (
                    <div>
                      <p className="text-muted-foreground text-xs">{t('common.total')}</p>
                      <p className="font-medium">{formatAmount(job.totalCost)}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4 pb-6">
            <Card className="p-4 space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />{t('jobs.schedule')}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">{t('common.date')}</p>
                  <p className="font-medium">{formatDate(job.scheduledDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t('common.time')}</p>
                  <p className="font-medium">{formatTimeTo12Hr(job.scheduledTime)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.duration')}</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />{formatDuration(job.estimatedDuration)}
                  </p>
                </div>
              </div>
            </Card>

            {job.status === 'in_progress' && (
              <Card className="p-4 border-amber-200 bg-amber-50">
                <div className="flex items-center gap-2 text-amber-700 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="font-medium">{t('jobs.jobInProgress')}</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="address" className="space-y-4 mt-4 pb-6">
            <Card className="p-4 space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />{t('jobs.serviceAddress')}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.buildingVilla')}</p>
                  <p className="font-medium">{job.serviceAddress.building}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t('jobs.street')}</p>
                  <p className="font-medium">{job.serviceAddress.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.area')}</p>
                    <p className="font-medium">{job.serviceAddress.area}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.emirate')}</p>
                    <p className="font-medium">{t(EMIRATE_KEYS[job.serviceAddress.emirate])}</p>
                  </div>
                </div>
                {job.serviceAddress.poBox && (
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.poBox')}</p>
                    <p className="font-medium">{job.serviceAddress.poBox}</p>
                  </div>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.latitude')}</p>
                    <p className="font-mono text-xs">{job.serviceAddress.latitude}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.longitude')}</p>
                    <p className="font-mono text-xs">{job.serviceAddress.longitude}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 mt-4 pb-6">
            {job.statusHistory && job.statusHistory.length > 0 ? (
              <JobTimeline history={job.statusHistory} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">{t('jobs.noStatusHistory')}</p>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

export default JobDetailPanel

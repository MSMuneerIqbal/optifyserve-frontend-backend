/**
 * Unassigned Jobs List Component
 * Phase 12: Dispatcher Command Center
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { MapPin, Clock, UserPlus, AlertTriangle } from 'lucide-react'
import { JOB_PRIORITY_CONFIG, SERVICE_TYPE_CONFIG } from '@/features/jobs/types/job.types'
import type { JobLocation } from '../types/dispatcher.types'

interface UnassignedJobsListProps {
  jobs: JobLocation[]
  isLoading: boolean
  onAssignJob: (job: JobLocation) => void
  onSelectJob: (job: JobLocation) => void
  selectedJobId?: string
}

export function UnassignedJobsList({
  jobs,
  isLoading,
  onAssignJob,
  onSelectJob,
  selectedJobId,
}: UnassignedJobsListProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <p className="text-sm text-muted-foreground">{t('dispatcher.noUnassignedJobs')}</p>
        <p className="text-xs text-muted-foreground mt-1">{t('dispatcher.allJobsAssigned')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{t('dispatcher.unassignedJobs')}</h3>
        <Badge variant="secondary" className="text-xs">{jobs.length}</Badge>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pe-1">
        {jobs.map(job => {
          const priorityCfg = JOB_PRIORITY_CONFIG[job.priority]
          const serviceCfg = SERVICE_TYPE_CONFIG[job.serviceType]
          const isUrgent = job.priority === 'emergency'
          const isSelected = selectedJobId === job.id

          return (
            <Card
              key={job.id}
              className={cn(
                'p-3 cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary',
                isUrgent && 'border-s-4 border-s-red-500'
              )}
              onClick={() => onSelectJob(job)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-muted-foreground">{job.jobNumber}</span>
                      {isUrgent && <AlertTriangle className="h-3 w-3 text-red-500" />}
                    </div>
                    <p className="text-sm font-medium truncate mt-0.5">{job.title}</p>
                  </div>
                  <Badge className={cn('text-xs shrink-0', priorityCfg.color)}>
                    {t(priorityCfg.key)}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{job.customerName}</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {job.serviceAddress.area}, {job.serviceAddress.building}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{job.scheduledTime} - {job.estimatedDuration}min</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {t(serviceCfg.key)}
                    </Badge>
                  </div>
                  <p className="text-xs">{formatDate(job.scheduledDate)}</p>
                </div>

                <Button
                  size="sm"
                  className="w-full h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAssignJob(job)
                  }}
                >
                  <UserPlus className="h-3 w-3 me-1" />
                  {t('dispatcher.assignTechnician')}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

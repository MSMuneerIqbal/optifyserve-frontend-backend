/**
 * Assigned Jobs List Component
 * Phase 12: Dispatcher Command Center
 *
 * List of currently assigned/in-progress jobs with technician info.
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import { Clock, User } from 'lucide-react'
import {
  JOB_PRIORITY_CONFIG,
  SERVICE_TYPE_CONFIG,
  JOB_STATUS_CONFIG,
} from '@/features/jobs/types/job.types'
import type { JobLocation } from '../types/dispatcher.types'

interface AssignedJobsListProps {
  jobs: JobLocation[]
  isLoading: boolean
  onSelectJob: (job: JobLocation) => void
  selectedJobId?: string
}

export function AssignedJobsList({
  jobs,
  isLoading,
  onSelectJob,
  selectedJobId,
}: AssignedJobsListProps) {
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
        <p className="text-sm text-muted-foreground">{t('dispatcher.noAssignedJobs')}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('dispatcher.assignTechniciansToSee')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{t('dispatcher.assignedJobs')}</h3>
        <Badge variant="secondary" className="text-xs">{jobs.length}</Badge>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pe-1">
        {jobs.map(job => {
          const priorityCfg = JOB_PRIORITY_CONFIG[job.priority]
          const serviceCfg = SERVICE_TYPE_CONFIG[job.serviceType]
          const statusCfg = JOB_STATUS_CONFIG[job.status]
          const isSelected = selectedJobId === job.id

          return (
            <Card
              key={job.id}
              className={cn(
                'p-3 cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => onSelectJob(job)}
            >
              <div className="space-y-2">
                {/* Header: Job number + priority */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {job.jobNumber}
                    </span>
                    <p className="text-sm font-medium truncate mt-0.5">{job.title}</p>
                  </div>
                  <Badge className={cn('text-xs shrink-0', priorityCfg.color)}>
                    {t(priorityCfg.key)}
                  </Badge>
                </div>

                {/* Technician */}
                {job.assignedTechnicianName && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{job.assignedTechnicianName}</span>
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        job.status === 'in_progress'
                          ? 'bg-orange-500'
                          : job.status === 'assigned'
                            ? 'bg-amber-500'
                            : 'bg-primary'
                      )}
                    />
                  </div>
                )}

                {/* Service type + schedule */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {t(serviceCfg.key)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{job.scheduledTime}</span>
                  </div>
                </div>

                {/* Date + Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(job.scheduledDate)}
                  </span>
                  <Badge className={cn('text-xs', statusCfg.color)}>
                    {t(statusCfg.key)}
                  </Badge>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

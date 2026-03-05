/**
 * Job Status Badge Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { JobStatus, JobPriority } from '../types/job.types'
import { JOB_STATUS_CONFIG, JOB_PRIORITY_CONFIG } from '../types/job.types'

interface JobStatusBadgeProps {
  status: JobStatus
  className?: string
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const { t } = useTranslation()
  const config = JOB_STATUS_CONFIG[status]
  return (
    <Badge variant="secondary" className={cn('text-xs', config.color, className)}>
      {t(`status.${status}`)}
    </Badge>
  )
}

interface JobPriorityBadgeProps {
  priority: JobPriority
  className?: string
}

export function JobPriorityBadge({ priority, className }: JobPriorityBadgeProps) {
  const { t } = useTranslation()
  const config = JOB_PRIORITY_CONFIG[priority]
  return (
    <Badge variant="secondary" className={cn('text-xs', config.color, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full me-1.5', config.dotColor)} />
      {t(`common.${priority}`)}
    </Badge>
  )
}

export default JobStatusBadge

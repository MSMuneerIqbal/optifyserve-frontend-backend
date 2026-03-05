/**
 * Job Timeline Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { CheckCircle, Clock, User } from 'lucide-react'
import type { JobStatusHistory } from '../types/job.types'
import { JOB_STATUS_CONFIG } from '../types/job.types'

interface JobTimelineProps {
  history: JobStatusHistory[]
}

export function JobTimeline({ history }: JobTimelineProps) {
  const { t } = useTranslation()
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">{t('jobs.noStatusHistory')}</p>
  }

  return (
    <div className="space-y-0">
      {history.map((entry, index) => {
        const config = JOB_STATUS_CONFIG[entry.status]
        const isLast = index === history.length - 1
        return (
          <div key={entry.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                index === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                <CheckCircle className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px h-full bg-border min-h-[24px]" />}
            </div>

            {/* Content */}
            <div className="pb-4 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded', config.color)}>
                  {t(`status.${entry.status}`)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {entry.changedByName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(entry.changedAt)}
                </span>
              </div>
              {entry.notes && (
                <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default JobTimeline

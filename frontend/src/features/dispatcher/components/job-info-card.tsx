/**
 * Job Info Card Component
 * Phase 12: Dispatcher Command Center
 *
 * Standalone detail card shown when a job is selected on the map.
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn, formatDate } from '@/lib/utils'
import {
  X,
  Phone,
  MapPin,
  Clock,
  Calendar,
  UserPlus,
  ExternalLink,
  User,
} from 'lucide-react'
import {
  JOB_PRIORITY_CONFIG,
  SERVICE_TYPE_CONFIG,
  JOB_STATUS_CONFIG,
  EMIRATE_KEYS,
} from '@/features/jobs/types/job.types'
import type { JobLocation } from '../types/dispatcher.types'

interface JobInfoCardProps {
  job: JobLocation
  onAssignTechnician?: () => void
  onViewDetails?: () => void
  onClose: () => void
}

export function JobInfoCard({
  job,
  onAssignTechnician,
  onViewDetails,
  onClose,
}: JobInfoCardProps) {
  const { t } = useTranslation()
  const priorityCfg = JOB_PRIORITY_CONFIG[job.priority]
  const serviceCfg = SERVICE_TYPE_CONFIG[job.serviceType]
  const statusCfg = JOB_STATUS_CONFIG[job.status]
  const isUnassigned = !job.assignedTechnicianId

  return (
    <Card className="w-80 p-4 shadow-lg">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="font-mono text-xs text-muted-foreground">{job.jobNumber}</span>
            <p className="text-sm font-semibold truncate mt-0.5">{job.title}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className={cn('text-xs', priorityCfg.color)}>
            {t(priorityCfg.key)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {t(serviceCfg.key)}
          </Badge>
          <Badge className={cn('text-xs', statusCfg.color)}>
            {t(statusCfg.key)}
          </Badge>
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-2 text-sm">
          {/* Customer */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t('common.customer')}</p>
            <p className="text-sm font-medium">{job.customerName}</p>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <a
                href={`tel:${job.customerPhone}`}
                className="text-xs text-primary hover:underline"
              >
                {job.customerPhone}
              </a>
            </div>
          </div>

          {/* Service Address */}
          <div className="space-y-1">
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p>{job.serviceAddress.building}</p>
                <p>
                  {job.serviceAddress.area},{' '}
                  {t(EMIRATE_KEYS[job.serviceAddress.emirate])}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(job.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{job.scheduledTime}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('dispatcher.estDuration')}</span>
            <span className="font-medium">{job.estimatedDuration} {t('common.min')}</span>
          </div>

          {/* Assigned Technician */}
          {job.assignedTechnicianName ? (
            <div className="rounded-md bg-muted/50 p-2 text-xs">
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{t('dispatcher.assignedTo')}</span>
              </div>
              <p className="font-medium mt-0.5">{job.assignedTechnicianName}</p>
            </div>
          ) : (
            <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-700">
              <div className="flex items-center gap-1.5">
                <UserPlus className="h-3 w-3" />
                <span>{t('dispatcher.noTechnicianAssigned')}</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isUnassigned && onAssignTechnician ? (
            <Button
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={onAssignTechnician}
            >
              <UserPlus className="h-3 w-3 me-1" />
              {t('dispatcher.assignTechnician')}
            </Button>
          ) : (
            onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={onViewDetails}
              >
                <ExternalLink className="h-3 w-3 me-1" />
                {t('common.viewDetails')}
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  )
}

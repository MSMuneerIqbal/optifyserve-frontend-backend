/**
 * Technician Info Card Component
 * Phase 12: Dispatcher Command Center
 *
 * Standalone detail card shown when a technician is selected on the map.
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  X,
  Phone,
  Star,
  Briefcase,
  MapPin,
  Car,
  UserPlus,
  ExternalLink,
} from 'lucide-react'
import { SERVICE_TYPE_CONFIG } from '@/features/jobs/types/job.types'
import { TECHNICIAN_STATUS_CONFIG } from '@/features/jobs/types/technician.types'
import type { TechnicianLocation } from '../types/dispatcher.types'

interface TechnicianInfoCardProps {
  technician: TechnicianLocation
  onAssignJob?: () => void
  onViewProfile?: () => void
  onClose: () => void
}

export function TechnicianInfoCard({
  technician,
  onAssignJob,
  onViewProfile,
  onClose,
}: TechnicianInfoCardProps) {
  const { t } = useTranslation()
  const statusCfg = TECHNICIAN_STATUS_CONFIG[technician.status]
  const skillCfg = SERVICE_TYPE_CONFIG[technician.primarySkill]

  const formattedLat = technician.currentLocation.latitude.toFixed(6)
  const formattedLng = technician.currentLocation.longitude.toFixed(6)

  return (
    <Card className="w-80 p-4 shadow-lg">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {technician.photo ? (
              <img
                src={technician.photo}
                alt={technician.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                {technician.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{technician.name}</p>
              <Badge className={cn('text-xs mt-0.5', statusCfg.color)}>
                <span className={cn('h-1.5 w-1.5 rounded-full me-1', statusCfg.dotColor)} />
                {t(statusCfg.key)}
              </Badge>
            </div>
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

        {/* Primary Skill */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Briefcase className="h-3 w-3" />
          <span>{t('dispatcher.primarySkill')}:</span>
          <Badge variant="outline" className="text-xs">
            {t(skillCfg.key)}
          </Badge>
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-2 text-sm">
          {/* Phone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span className="text-xs">{technician.phone}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              asChild
            >
              <a href={`tel:${technician.phone}`}>
                <Phone className="h-3 w-3 text-green-600" />
              </a>
            </Button>
          </div>

          {/* Active Jobs */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('dispatcher.activeJobs')}</span>
            <span className="font-medium">{technician.activeJobCount}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('dispatcher.avgRating')}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="font-medium">{technician.avgRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Current Location */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{t('dispatcher.location')}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {formattedLat}, {formattedLng}
            </span>
          </div>

          {/* Vehicle */}
          {technician.vehiclePlateNumber && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Car className="h-3 w-3" />
                <span>{t('dispatcher.vehicle')}</span>
              </div>
              <span className="font-medium">{technician.vehiclePlateNumber}</span>
            </div>
          )}

          {/* Current Job */}
          {technician.currentJobTitle && (
            <div className="rounded-md bg-muted/50 p-2 text-xs">
              <p className="text-muted-foreground">{t('dispatcher.currentJob')}</p>
              <p className="font-medium mt-0.5 truncate">{technician.currentJobTitle}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={onViewProfile}
            >
              <ExternalLink className="h-3 w-3 me-1" />
              {t('dispatcher.viewProfile')}
            </Button>
          )}
          {onAssignJob && (
            <Button
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={onAssignJob}
              disabled={technician.status === 'offline' || technician.status === 'on-leave'}
            >
              <UserPlus className="h-3 w-3 me-1" />
              {t('dispatcher.assignJob')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

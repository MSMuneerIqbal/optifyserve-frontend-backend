/**
 * Technician Profile Card Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import { Star, MapPin, Briefcase, Phone } from 'lucide-react'
import type { TechnicianListItem } from '../types/technician.types'
import { TECHNICIAN_STATUS_CONFIG } from '../types/technician.types'
import { SERVICE_TYPE_CONFIG } from '../types/job.types'

interface TechnicianCardProps {
  technician: TechnicianListItem
  onClick?: () => void
  selected?: boolean
}

export function TechnicianCard({ technician, onClick, selected }: TechnicianCardProps) {
  const { t } = useTranslation()
  const statusConfig = TECHNICIAN_STATUS_CONFIG[technician.status]
  const skillConfig = SERVICE_TYPE_CONFIG[technician.primarySkill]

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary border-primary/30',
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(technician.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-medium text-sm truncate">{technician.name}</h4>
              <div className="flex items-center gap-1 shrink-0">
                <span className={cn('w-2 h-2 rounded-full', statusConfig.dotColor)} />
                <span className="text-xs text-muted-foreground hidden sm:inline">{t(`status.${technician.status}`)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{technician.branchName}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {t(skillConfig.key)}
              </Badge>
              {technician.avgRating > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-amber-600">
                  <Star className="h-3 w-3 fill-current" />
                  {technician.avgRating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {technician.activeJobCount} {t('jobs.active')}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">{technician.phone}</span>
                <span className="sm:hidden">{t('common.call')}</span>
              </span>
              {technician.currentLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  GPS
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TechnicianCard

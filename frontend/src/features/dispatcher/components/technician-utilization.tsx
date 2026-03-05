/**
 * Technician Utilization Panel
 * Phase 12: Dispatcher Command Center
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Star, Briefcase, CheckCircle } from 'lucide-react'
import { TECHNICIAN_STATUS_CONFIG } from '@/features/jobs/types/technician.types'
import { SERVICE_TYPE_CONFIG } from '@/features/jobs/types/job.types'
import type { TechnicianUtilization as TechUtilization } from '../types/dispatcher.types'

interface TechnicianUtilizationProps {
  utilization: TechUtilization[]
  isLoading: boolean
}

export function TechnicianUtilization({ utilization, isLoading }: TechnicianUtilizationProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t('dispatcher.technicianUtilization')}</h3>
        <Badge variant="secondary" className="text-xs">{utilization.length} {t('dispatcher.technicians')}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
        {utilization.map(tech => {
          const statusCfg = TECHNICIAN_STATUS_CONFIG[tech.status]
          const serviceCfg = SERVICE_TYPE_CONFIG[tech.primarySkill]
          const utilizationColor =
            tech.utilizationPercent >= 80 ? 'bg-red-500' :
            tech.utilizationPercent >= 50 ? 'bg-amber-500' :
            'bg-green-500'

          return (
            <Card key={tech.id} className="p-3">
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{t(serviceCfg.key)}</p>
                  </div>
                  <Badge className={cn('text-xs shrink-0', statusCfg.color)}>
                    {t(statusCfg.key)}
                  </Badge>
                </div>

                {/* Utilization Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t('dispatcher.utilization')}</span>
                    <span className="font-medium">{tech.utilizationPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', utilizationColor)}
                      style={{ width: `${Math.min(tech.utilizationPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>{tech.activeJobCount} {t('status.active')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>{tech.completedToday} {t('dispatcher.done')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span>{tech.avgRating.toFixed(1)}</span>
                  </div>
                </div>

                {tech.nextAvailableAt && tech.status === 'busy' && (
                  <p className="text-xs text-muted-foreground">
                    {t('dispatcher.availableAt')} {tech.nextAvailableAt}
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

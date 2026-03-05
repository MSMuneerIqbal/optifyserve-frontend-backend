/**
 * Dispatcher Stats Bar Component
 * Phase 12: Dispatcher Command Center
 */

import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Users, AlertTriangle, CheckCircle, Clock, Radio } from 'lucide-react'
import type { DispatcherStats } from '../types/dispatcher.types'

interface DispatcherStatsBarProps {
  stats: DispatcherStats
  isRefetching: boolean
}

export function DispatcherStatsBar({ stats, isRefetching }: DispatcherStatsBarProps) {
  const { t } = useTranslation()

  const items = [
    {
      label: t('dispatcher.available'),
      value: stats.availableTechnicians,
      total: stats.totalTechnicians,
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: t('dispatcher.busy'),
      value: stats.busyTechnicians,
      icon: Radio,
      color: 'text-amber-600',
    },
    {
      label: t('dispatcher.unassigned'),
      value: stats.totalUnassignedJobs,
      icon: AlertTriangle,
      color: stats.totalUnassignedJobs > 0 ? 'text-red-600' : 'text-green-600',
    },
    {
      label: t('dispatcher.urgent'),
      value: stats.urgentUnassignedJobs,
      icon: AlertTriangle,
      color: stats.urgentUnassignedJobs > 0 ? 'text-red-600' : 'text-slate-400',
    },
    {
      label: t('dispatcher.completedToday'),
      value: stats.jobsCompletedToday,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: t('dispatcher.avgResponse'),
      value: `${stats.avgResponseTime}m`,
      icon: Clock,
      color: 'text-blue-600',
    },
  ]

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {items.map(item => {
        const Icon = item.icon
        return (
          <div key={item.label} className="flex items-center gap-1.5 text-sm">
            <Icon className={`h-4 w-4 ${item.color}`} />
            <span className="font-semibold">{item.value}</span>
            {item.total !== undefined && (
              <span className="text-muted-foreground">/{item.total}</span>
            )}
            <span className="text-muted-foreground text-xs hidden sm:inline">{item.label}</span>
          </div>
        )
      })}
      {isRefetching && (
        <Badge variant="outline" className="text-xs animate-pulse">
          <Radio className="h-3 w-3 me-1" />
          {t('dispatcher.live')}
        </Badge>
      )}
    </div>
  )
}

/**
 * Technician Performance Card Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrency } from '@/contexts/currency-context'
import { Star, Clock, CheckCircle, TrendingUp, Briefcase, Target } from 'lucide-react'
import type { TechnicianPerformance } from '../types/technician.types'
import { formatDuration } from '../utils/schedule-calculator'

interface TechnicianPerformanceCardProps {
  performance: TechnicianPerformance
  technicianName: string
}

export function TechnicianPerformanceCard({ performance, technicianName }: TechnicianPerformanceCardProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {t('jobs.performance')} - {technicianName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatItem
            icon={Briefcase}
            label={t('jobs.jobsToday')}
            value={String(performance.jobsCompletedToday)}
            color="text-blue-600"
          />
          <StatItem
            icon={CheckCircle}
            label={t('jobs.thisMonth')}
            value={String(performance.jobsCompletedMonth)}
            color="text-green-600"
          />
          <StatItem
            icon={Clock}
            label={t('jobs.avgDuration')}
            value={formatDuration(performance.avgJobDuration)}
            color="text-amber-600"
          />
          <StatItem
            icon={Star}
            label={t('jobs.avgRating')}
            value={performance.avgCustomerRating.toFixed(1)}
            color="text-yellow-600"
          />
          <StatItem
            icon={Target}
            label={t('jobs.onTimeRate')}
            value={`${performance.onTimeCompletionRate}%`}
            color="text-primary"
          />
          <StatItem
            icon={TrendingUp}
            label={t('jobs.revenue')}
            value={formatAmount(performance.revenueGenerated)}
            color="text-emerald-600"
            small
          />
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({ icon: Icon, label, value, color, small }: {
  icon: React.ElementType
  label: string
  value: string
  color: string
  small?: boolean
}) {
  return (
    <div className="text-center p-2 rounded-lg bg-muted/30">
      <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
      <p className={`font-bold ${small ? 'text-sm' : 'text-lg'} ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export default TechnicianPerformanceCard

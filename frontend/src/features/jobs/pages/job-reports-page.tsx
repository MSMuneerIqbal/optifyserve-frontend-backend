/**
 * Job Reports & Analytics Page
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCurrency } from '@/contexts/currency-context'
import {
  Briefcase, Clock, CheckCircle, TrendingUp,
  Users, Star, Wrench, AlertTriangle,
} from 'lucide-react'
import { sampleJobSummary } from '@/data/jobs.data'

export function JobReportsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const isLoading = false
  const summary = sampleJobSummary

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('jobs.analyticsTitle')} description={t('jobs.analyticsDescription')} />
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  const activeJobs = summary.inProgressJobs + summary.assignedJobs
  const completionRate = summary.totalJobs > 0
    ? Math.round((summary.completedJobs / summary.totalJobs) * 100)
    : 0

  const kpis = [
    { label: t('jobs.totalJobs'), value: summary.totalJobs, icon: Briefcase, color: 'text-primary' },
    { label: t('jobs.activeJobs'), value: activeJobs, icon: Clock, color: 'text-blue-600' },
    { label: t('jobs.completedJobs'), value: summary.completedJobs, icon: CheckCircle, color: 'text-green-600' },
    { label: t('jobs.avgDuration'), value: `${summary.avgCompletionTime}m`, icon: Clock, color: 'text-amber-600' },
    { label: t('jobs.totalRevenue'), value: formatAmount(summary.totalRevenue), icon: TrendingUp, color: 'text-emerald-600' },
    { label: t('jobs.completionRate'), value: `${completionRate}%`, icon: Star, color: 'text-purple-600' },
  ]

  const statusData = [
    { status: t('status.new'), count: summary.newJobs },
    { status: t('status.assigned'), count: summary.assignedJobs },
    { status: t('status.inProgress'), count: summary.inProgressJobs },
    { status: t('status.completed'), count: summary.completedJobs },
    { status: t('status.cancelled'), count: summary.cancelledJobs },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('jobs.analyticsTitle')}
        description={t('jobs.analyticsDescription')}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
              <p className="text-lg font-bold">{kpi.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {t('jobs.jobsByStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusData.map(item => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/70" />
                    <span className="text-sm">{item.status}</span>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t('jobs.jobsByPriority')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.byPriority.map(item => {
                const colors: Record<string, string> = {
                  low: 'bg-slate-400',
                  medium: 'bg-blue-400',
                  high: 'bg-amber-400',
                  urgent: 'bg-orange-400',
                  emergency: 'bg-red-500',
                }
                return (
                  <div key={item.priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[item.priority] || 'bg-slate-400'}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {t('jobs.jobsByType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.byServiceType.map(item => (
                <div key={item.serviceType} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${summary.totalJobs > 0 ? Math.min((item.count / summary.totalJobs) * 100, 100) : 0}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">{item.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('jobs.performanceSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('jobs.averageRating')}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">{summary.avgRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('jobs.avgCompletionTime')}</span>
                <span className="text-sm font-medium">{summary.avgCompletionTime} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('jobs.totalRevenue')}</span>
                <span className="text-sm font-medium">{formatAmount(summary.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('jobs.completionRate')}</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default JobReportsPage

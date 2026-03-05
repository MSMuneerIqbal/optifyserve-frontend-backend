/**
 * Dashboard Page
 * Main dashboard with KPIs, charts, urgent jobs, and activities
 * Uses static sample data
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download } from 'lucide-react'
import { KPICards } from '../components/kpi-cards'
import { SalesChart } from '../components/sales-chart'
import { UrgentJobsList } from '../components/urgent-jobs-list'
import { RecentActivityFeed } from '../components/recent-activity'
import { sampleDashboardData } from '@/data/dashboard.data'

export function DashboardPage() {
  const { t } = useTranslation()
  const isLoading = false
  const data = sampleDashboardData

  const handleRefresh = () => {
    // No-op with static data
  }

  const summary = data.summary
  const kpis = data.kpis
  const salesTrend = data.salesTrend
  const urgentJobs = data.urgentJobs
  const recentActivities = data.recentActivities

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 me-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 me-2" />
            {t('common.export')}
          </Button>
        </div>
      </PageHeader>

      {/* Summary Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-primary">
            {summary?.todayJobs ?? 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('dashboard.jobsToday')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
            {summary?.completedToday ?? 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('dashboard.completed')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-amber-600">
            {summary?.pendingApprovals ?? 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('dashboard.pendingApprovals')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-red-600">
            {summary?.overdueInvoices ?? 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('dashboard.overdueInvoices')}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <section>
          <KPICards kpis={kpis} />
        </section>
      )}

      {/* Main Content - Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={salesTrend} />
        </div>
        <div className="lg:col-span-1">
          <UrgentJobsList jobs={urgentJobs} />
        </div>
      </div>

      {/* Recent Activity - Full width */}
      <section>
        <RecentActivityFeed activities={recentActivities} />
      </section>
    </div>
  )
}

export default DashboardPage

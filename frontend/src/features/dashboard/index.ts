/**
 * Dashboard Feature Module Index
 * Phase 3: Dashboard Module
 */

// Pages
export { DashboardPage } from './pages/dashboard-page'

// Components
export { KPICards } from './components/kpi-cards'
export { SalesChart } from './components/sales-chart'
export { UrgentJobsList } from './components/urgent-jobs-list'
export { RecentActivityFeed } from './components/recent-activity'

// Types
export type {
  DashboardData,
  DashboardKPIs,
  KPIMetric,
  SalesData,
  UrgentJob,
  RecentActivity,
  ActivityType,
  JobStatus,
  ChartPeriod,
  DashboardFilters,
} from './types/dashboard.types'

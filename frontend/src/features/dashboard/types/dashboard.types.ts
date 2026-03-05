/**
 * Dashboard Types
 * Phase 3: Dashboard Module
 */

/**
 * KPI Metric data structure
 */
export interface KPIMetric {
  label: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease'
  trend: number[]
  prefix?: string
  suffix?: string
  icon?: string
}

/**
 * Sales data point for charts
 */
export interface SalesData {
  month: string
  Dubai: number
  AbuDhabi: number
  Sharjah: number
  Ajman: number
  RAK: number
  UAQ: number
  Fujairah: number
}

/**
 * Job status types
 */
export type JobStatus = 'pending' | 'delayed' | 'on-site' | 'completed' | 'cancelled'

/**
 * Technician assigned to a job
 */
export interface AssignedTechnician {
  id: string
  name: string
  avatar?: string
  phone?: string
}

/**
 * Urgent job item
 */
export interface UrgentJob {
  id: string
  jobNumber: string
  customer: string
  address: string
  emirate: string
  status: JobStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTechnician?: AssignedTechnician
  scheduledDate: string
  scheduledTime?: string
  timeAgo: string
  serviceType: string
}

/**
 * Activity types for recent activity feed
 */
export type ActivityType =
  | 'invoice_created'
  | 'payment_received'
  | 'job_completed'
  | 'customer_added'
  | 'quotation_sent'
  | 'lead_converted'
  | 'stock_alert'

/**
 * Recent activity item
 */
export interface RecentActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  metadata?: {
    amount?: number
    reference?: string
    customerName?: string
    jobNumber?: string
  }
}

/**
 * KPIs structure
 */
export interface DashboardKPIs {
  totalRevenue: KPIMetric
  activeJobs: KPIMetric
  firstTimeFix: KPIMetric
  customerSatisfaction: KPIMetric
  pendingInvoices: KPIMetric
  lowStockAlerts: KPIMetric
  activeTechnicians: KPIMetric
  newCustomers: KPIMetric
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
  kpis: DashboardKPIs
  salesTrend: SalesData[]
  urgentJobs: UrgentJob[]
  recentActivities: RecentActivity[]
  summary: {
    todayJobs: number
    completedToday: number
    pendingApprovals: number
    overdueInvoices: number
  }
}

/**
 * Dashboard filters
 */
export interface DashboardFilters {
  dateRange?: {
    from: Date
    to: Date
  }
  emirate?: string
}

/**
 * Chart time period options
 */
export type ChartPeriod = '7d' | '30d' | '90d' | '12m' | 'ytd'

/**
 * Dashboard Sample Data
 * Extracted from dashboard mock API for standalone usage.
 * All data is UAE-specific with AED currency.
 */

import type {
  DashboardData,
  DashboardKPIs,
  SalesData,
  UrgentJob,
  RecentActivity,
} from '@/features/dashboard/types/dashboard.types'

/**
 * Dashboard KPI metrics
 */
export const sampleDashboardKPIs: DashboardKPIs = {
  totalRevenue: {
    label: 'Total Revenue',
    value: 1247500,
    change: 12.5,
    changeType: 'increase',
    trend: [85000, 92000, 88000, 95000, 102000, 98000, 115000],
    prefix: 'AED',
  },
  activeJobs: {
    label: 'Active Jobs',
    value: 47,
    change: 8,
    changeType: 'increase',
    trend: [32, 38, 35, 42, 40, 45, 47],
  },
  firstTimeFix: {
    label: 'First Time Fix Rate',
    value: 87.5,
    change: 2.3,
    changeType: 'increase',
    trend: [82, 84, 83, 85, 86, 85, 87.5],
    suffix: '%',
  },
  customerSatisfaction: {
    label: 'Customer Satisfaction',
    value: 4.6,
    change: 0.2,
    changeType: 'increase',
    trend: [4.2, 4.3, 4.4, 4.3, 4.5, 4.5, 4.6],
    suffix: '/5',
  },
  pendingInvoices: {
    label: 'Pending Invoices',
    value: 23,
    change: -5,
    changeType: 'decrease',
    trend: [35, 32, 30, 28, 26, 25, 23],
  },
  lowStockAlerts: {
    label: 'Low Stock Alerts',
    value: 8,
    change: 3,
    changeType: 'increase',
    trend: [4, 5, 4, 6, 5, 7, 8],
  },
  activeTechnicians: {
    label: 'Active Technicians',
    value: 18,
    change: 2,
    changeType: 'increase',
    trend: [14, 15, 15, 16, 16, 17, 18],
  },
  newCustomers: {
    label: 'New Customers',
    value: 34,
    change: 15,
    changeType: 'increase',
    trend: [22, 25, 28, 26, 30, 32, 34],
  },
}

/**
 * Monthly sales trend data by emirate (12 months, deterministic values)
 */
export const sampleSalesTrend: SalesData[] = [
  { month: 'Jan', Dubai: 210000, AbuDhabi: 175000, Sharjah: 158000, Ajman: 95000, RAK: 82000, UAQ: 62000, Fujairah: 72000 },
  { month: 'Feb', Dubai: 225000, AbuDhabi: 182000, Sharjah: 165000, Ajman: 102000, RAK: 88000, UAQ: 68000, Fujairah: 78000 },
  { month: 'Mar', Dubai: 218000, AbuDhabi: 190000, Sharjah: 172000, Ajman: 98000, RAK: 92000, UAQ: 65000, Fujairah: 74000 },
  { month: 'Apr', Dubai: 240000, AbuDhabi: 195000, Sharjah: 180000, Ajman: 110000, RAK: 95000, UAQ: 72000, Fujairah: 82000 },
  { month: 'May', Dubai: 255000, AbuDhabi: 205000, Sharjah: 188000, Ajman: 115000, RAK: 98000, UAQ: 75000, Fujairah: 85000 },
  { month: 'Jun', Dubai: 248000, AbuDhabi: 198000, Sharjah: 175000, Ajman: 108000, RAK: 90000, UAQ: 70000, Fujairah: 80000 },
  { month: 'Jul', Dubai: 262000, AbuDhabi: 212000, Sharjah: 192000, Ajman: 118000, RAK: 102000, UAQ: 78000, Fujairah: 88000 },
  { month: 'Aug', Dubai: 270000, AbuDhabi: 220000, Sharjah: 198000, Ajman: 122000, RAK: 105000, UAQ: 80000, Fujairah: 92000 },
  { month: 'Sep', Dubai: 258000, AbuDhabi: 215000, Sharjah: 195000, Ajman: 120000, RAK: 100000, UAQ: 76000, Fujairah: 86000 },
  { month: 'Oct', Dubai: 275000, AbuDhabi: 225000, Sharjah: 205000, Ajman: 128000, RAK: 108000, UAQ: 82000, Fujairah: 95000 },
  { month: 'Nov', Dubai: 280000, AbuDhabi: 230000, Sharjah: 210000, Ajman: 132000, RAK: 112000, UAQ: 85000, Fujairah: 98000 },
  { month: 'Dec', Dubai: 295000, AbuDhabi: 240000, Sharjah: 218000, Ajman: 138000, RAK: 118000, UAQ: 88000, Fujairah: 102000 },
]

/**
 * Urgent jobs requiring immediate attention
 */
export const sampleUrgentJobs: UrgentJob[] = [
  {
    id: 'job_001',
    jobNumber: 'JOB-2025-0147',
    customer: 'Al Futtaim Motors',
    address: 'Sheikh Zayed Road, Near Mall of Emirates',
    emirate: 'Dubai',
    status: 'delayed',
    priority: 'urgent',
    assignedTechnician: {
      id: 'tech_001',
      name: 'Mohammed Ali',
      avatar: undefined,
    },
    scheduledDate: '2025-02-07',
    scheduledTime: '09:00',
    timeAgo: '2 hours overdue',
    serviceType: 'AC Maintenance',
  },
  {
    id: 'job_002',
    jobNumber: 'JOB-2025-0148',
    customer: 'Emirates NBD HQ',
    address: 'Baniyas Road, Deira',
    emirate: 'Dubai',
    status: 'pending',
    priority: 'high',
    assignedTechnician: {
      id: 'tech_002',
      name: 'Ahmed Hassan',
      avatar: undefined,
    },
    scheduledDate: '2025-02-07',
    scheduledTime: '11:00',
    timeAgo: 'Starts in 1 hour',
    serviceType: 'Electrical Repair',
  },
  {
    id: 'job_003',
    jobNumber: 'JOB-2025-0149',
    customer: 'Jumeirah Beach Hotel',
    address: 'Jumeirah Beach Road',
    emirate: 'Dubai',
    status: 'on-site',
    priority: 'medium',
    assignedTechnician: {
      id: 'tech_003',
      name: 'Khalid Omar',
      avatar: undefined,
    },
    scheduledDate: '2025-02-07',
    scheduledTime: '08:00',
    timeAgo: 'Started 3 hours ago',
    serviceType: 'Plumbing Service',
  },
  {
    id: 'job_004',
    jobNumber: 'JOB-2025-0150',
    customer: 'ADNOC Headquarters',
    address: 'Corniche Road',
    emirate: 'Abu Dhabi',
    status: 'pending',
    priority: 'high',
    assignedTechnician: undefined,
    scheduledDate: '2025-02-07',
    scheduledTime: '14:00',
    timeAgo: 'Unassigned - 4 hours left',
    serviceType: 'HVAC Installation',
  },
  {
    id: 'job_005',
    jobNumber: 'JOB-2025-0151',
    customer: 'Sharjah City Centre',
    address: 'Al Wahda Street',
    emirate: 'Sharjah',
    status: 'delayed',
    priority: 'urgent',
    assignedTechnician: {
      id: 'tech_004',
      name: 'Faisal Rahman',
      avatar: undefined,
    },
    scheduledDate: '2025-02-06',
    scheduledTime: '16:00',
    timeAgo: '1 day overdue',
    serviceType: 'Fire Safety Inspection',
  },
  {
    id: 'job_006',
    jobNumber: 'JOB-2025-0152',
    customer: 'RAK Mall',
    address: 'Khuzam Road',
    emirate: 'Ras Al Khaimah',
    status: 'pending',
    priority: 'medium',
    assignedTechnician: {
      id: 'tech_005',
      name: 'Youssef Ibrahim',
      avatar: undefined,
    },
    scheduledDate: '2025-02-07',
    scheduledTime: '15:00',
    timeAgo: 'Starts in 5 hours',
    serviceType: 'Generator Maintenance',
  },
]

/**
 * Recent activity feed items
 */
export const sampleRecentActivities: RecentActivity[] = [
  {
    id: 'act_001',
    type: 'payment_received',
    title: 'Payment Received',
    description: 'Payment of AED 15,750 received from Al Futtaim Motors',
    user: {
      id: 'usr_001',
      name: 'Sara Ahmed',
      avatar: undefined,
    },
    timestamp: '2025-02-07T09:30:00Z',
    metadata: {
      amount: 15750,
      reference: 'PAY-2025-0089',
      customerName: 'Al Futtaim Motors',
    },
  },
  {
    id: 'act_002',
    type: 'job_completed',
    title: 'Job Completed',
    description: 'AC maintenance completed at Emirates NBD Tower',
    user: {
      id: 'tech_002',
      name: 'Ahmed Hassan',
      avatar: undefined,
    },
    timestamp: '2025-02-07T09:15:00Z',
    metadata: {
      jobNumber: 'JOB-2025-0145',
      customerName: 'Emirates NBD',
    },
  },
  {
    id: 'act_003',
    type: 'invoice_created',
    title: 'Invoice Created',
    description: 'Invoice INV-2025-0234 created for AED 8,500',
    user: {
      id: 'usr_002',
      name: 'Mohammed Ali',
      avatar: undefined,
    },
    timestamp: '2025-02-07T09:00:00Z',
    metadata: {
      amount: 8500,
      reference: 'INV-2025-0234',
      customerName: 'Jumeirah Hotels',
    },
  },
  {
    id: 'act_004',
    type: 'customer_added',
    title: 'New Customer Added',
    description: 'New corporate customer: Dubai Properties LLC',
    user: {
      id: 'usr_003',
      name: 'Fatima Khan',
      avatar: undefined,
    },
    timestamp: '2025-02-07T08:30:00Z',
    metadata: {
      customerName: 'Dubai Properties LLC',
    },
  },
  {
    id: 'act_005',
    type: 'quotation_sent',
    title: 'Quotation Sent',
    description: 'Quotation QT-2025-0178 sent to Emaar Properties',
    user: {
      id: 'usr_001',
      name: 'Sara Ahmed',
      avatar: undefined,
    },
    timestamp: '2025-02-07T08:00:00Z',
    metadata: {
      amount: 45000,
      reference: 'QT-2025-0178',
      customerName: 'Emaar Properties',
    },
  },
  {
    id: 'act_006',
    type: 'lead_converted',
    title: 'Lead Converted',
    description: 'Lead converted to customer: Nakheel Mall Management',
    user: {
      id: 'usr_004',
      name: 'Omar Khalil',
      avatar: undefined,
    },
    timestamp: '2025-02-07T07:30:00Z',
    metadata: {
      customerName: 'Nakheel Mall Management',
    },
  },
  {
    id: 'act_007',
    type: 'stock_alert',
    title: 'Low Stock Alert',
    description: 'AC Filters (Model AC-F500) below reorder level',
    user: {
      id: 'system',
      name: 'System',
      avatar: undefined,
    },
    timestamp: '2025-02-07T07:00:00Z',
    metadata: {
      reference: 'SKU-AC-F500',
    },
  },
  {
    id: 'act_008',
    type: 'payment_received',
    title: 'Payment Received',
    description: 'Payment of AED 32,000 received from ADNOC',
    user: {
      id: 'usr_001',
      name: 'Sara Ahmed',
      avatar: undefined,
    },
    timestamp: '2025-02-07T06:00:00Z',
    metadata: {
      amount: 32000,
      reference: 'PAY-2025-0088',
      customerName: 'ADNOC',
    },
  },
]

/**
 * Complete dashboard data bundle
 */
export const sampleDashboardData: DashboardData = {
  kpis: sampleDashboardKPIs,
  salesTrend: sampleSalesTrend,
  urgentJobs: sampleUrgentJobs,
  recentActivities: sampleRecentActivities,
  summary: {
    todayJobs: 12,
    completedToday: 7,
    pendingApprovals: 5,
    overdueInvoices: 3,
  },
}

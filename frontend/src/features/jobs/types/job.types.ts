/**
 * Job/Service Order Type Definitions
 * Phase 11: Jobs/Service Management Module
 */

import type { StatusBadgeVariant } from '@/types/common.types'

/** Job status workflow: Pending → Scheduled → In Progress → On Hold → Completed → Invoiced / Cancelled */
export type JobStatus =
  | 'pending'
  | 'scheduled'
  | 'in-progress'
  | 'on-hold'
  | 'completed'
  | 'invoiced'
  | 'cancelled'

/** Job priority levels */
export type JobPriority = 'low' | 'medium' | 'high' | 'emergency'

/** Service type categories */
export type ServiceType =
  | 'ac-repair'
  | 'ac-maintenance'
  | 'plumbing'
  | 'electrical'
  | 'painting'
  | 'cleaning'
  | 'pest-control'
  | 'carpentry'
  | 'masonry'
  | 'general-maintenance'
  | 'other'

/** Recurring job frequency */
export type RecurringFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual'

/** UAE Emirates */
export type Emirate = 'dubai' | 'abu-dhabi' | 'sharjah' | 'ajman' | 'rak' | 'uaq' | 'fujairah'

/** Service address with GPS coordinates */
export interface ServiceAddress {
  building: string
  street: string
  area: string
  emirate: Emirate
  poBox?: string
  latitude: number
  longitude: number
  landmark?: string
}

/** Job status display configuration */
export const JOB_STATUS_CONFIG: Record<JobStatus, { key: string; variant: StatusBadgeVariant; color: string }> = {
  pending: { key: 'status.pending', variant: 'info', color: 'bg-blue-100 text-blue-800' },
  scheduled: { key: 'status.scheduled', variant: 'info', color: 'bg-primary/10 text-primary' },
  'in-progress': { key: 'status.inProgress', variant: 'warning', color: 'bg-orange-100 text-orange-800' },
  'on-hold': { key: 'status.onHold', variant: 'neutral', color: 'bg-slate-100 text-slate-800' },
  completed: { key: 'status.completed', variant: 'success', color: 'bg-green-100 text-green-800' },
  invoiced: { key: 'status.invoiced', variant: 'success', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { key: 'status.cancelled', variant: 'error', color: 'bg-red-100 text-red-800' },
}

/** Job priority display configuration */
export const JOB_PRIORITY_CONFIG: Record<JobPriority, { key: string; color: string; dotColor: string }> = {
  low: { key: 'status.low', color: 'bg-slate-100 text-slate-700', dotColor: 'bg-slate-400' },
  medium: { key: 'status.medium', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-400' },
  high: { key: 'status.high', color: 'bg-amber-100 text-amber-700', dotColor: 'bg-amber-400' },
  emergency: { key: 'status.emergency', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
}

/** Service type display configuration */
export const SERVICE_TYPE_CONFIG: Record<ServiceType, { key: string; icon: string }> = {
  'ac-repair': { key: 'status.acRepair', icon: 'Snowflake' },
  'ac-maintenance': { key: 'status.acMaintenance', icon: 'Snowflake' },
  plumbing: { key: 'status.plumbing', icon: 'Wrench' },
  electrical: { key: 'status.electrical', icon: 'Zap' },
  painting: { key: 'status.painting', icon: 'Paintbrush' },
  cleaning: { key: 'status.cleaning', icon: 'Sparkles' },
  'pest-control': { key: 'status.pestControl', icon: 'Bug' },
  carpentry: { key: 'status.carpentry', icon: 'Hammer' },
  masonry: { key: 'status.masonry', icon: 'Brick' },
  'general-maintenance': { key: 'status.generalMaintenance', icon: 'Settings' },
  other: { key: 'status.other', icon: 'HelpCircle' },
}

/** Emirate display labels */
export const EMIRATE_KEYS: Record<Emirate, string> = {
  dubai: 'emirates.dubai',
  'abu-dhabi': 'emirates.abuDhabi',
  sharjah: 'emirates.sharjah',
  ajman: 'emirates.ajman',
  rak: 'emirates.rasAlKhaimah',
  uaq: 'emirates.ummAlQuwain',
  fujairah: 'emirates.fujairah',
}

/** Job status history entry */
export interface JobStatusHistory {
  id: string
  status: JobStatus
  changedBy: string
  changedByName: string
  changedAt: string
  notes?: string
}

/** Job attachment */
export interface JobAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  uploadedAt: string
  uploadedBy: string
  category: 'before' | 'after' | 'document' | 'other'
}

/** Service order / Job */
export interface Job {
  id: string
  jobNumber: string
  title: string
  description: string

  // Customer
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  contactPerson?: string

  // Service details
  serviceType: ServiceType
  priority: JobPriority
  status: JobStatus

  // Location
  serviceAddress: ServiceAddress

  // Scheduling
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number // minutes
  actualStartTime?: string
  actualEndTime?: string
  actualDuration?: number

  // Assignment
  branchId: string
  branchName: string
  assignedTechnicianId?: string
  assignedTechnicianName?: string
  assignedTechnicianPhone?: string
  additionalTechnicians?: { id: string; name: string }[]

  // Financial
  estimatedCost?: number
  laborCharges?: number
  partsCost?: number
  totalCost?: number
  invoiceId?: string
  invoiceNumber?: string

  // Recurring
  isRecurring: boolean
  recurringFrequency?: RecurringFrequency
  parentJobId?: string

  // Notes
  internalNotes?: string
  customerNotes?: string

  // Attachments
  attachments: JobAttachment[]

  // History
  statusHistory: JobStatusHistory[]

  // Service report
  serviceReportId?: string
  hasServiceReport: boolean

  // Feedback
  customerRating?: number
  hasFeedback: boolean

  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt: string
}

/** Job list item (lightweight) */
export interface JobListItem {
  id: string
  jobNumber: string
  title: string
  customerName: string
  customerPhone: string
  serviceType: ServiceType
  priority: JobPriority
  status: JobStatus
  serviceAddress: ServiceAddress
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number
  branchName: string
  assignedTechnicianName?: string
  totalCost?: number
  hasServiceReport: boolean
  hasFeedback: boolean
  customerRating?: number
  createdAt: string
}

/** Job form data for create/edit */
export interface JobFormData {
  title: string
  description: string
  customerId: string
  serviceType: ServiceType
  priority: JobPriority
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number
  branchId: string
  serviceAddress: ServiceAddress
  isRecurring: boolean
  recurringFrequency?: RecurringFrequency
  internalNotes?: string
  customerNotes?: string
}

/** Job filters */
export interface JobFilters {
  search?: string
  status?: JobStatus
  priority?: JobPriority
  serviceType?: ServiceType
  branchId?: string
  emirate?: Emirate
  technicianId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

/** Job summary / KPIs */
export interface JobSummary {
  totalJobs: number
  pendingJobs: number
  inProgressJobs: number
  completedJobs: number
  cancelledJobs: number
  avgCompletionTime: number
  totalRevenue: number
  avgRating: number
  byServiceType: { serviceType: ServiceType; label: string; count: number }[]
  byPriority: { priority: JobPriority; label: string; count: number }[]
  byBranch: { branchId: string; branchName: string; count: number }[]
  byEmirate: { emirate: Emirate; label: string; count: number }[]
}

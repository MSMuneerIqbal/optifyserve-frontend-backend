import type { UAEEmirate } from '@/lib/constants'

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// API Error
export interface ApiError {
  message: string
  code?: string
  field?: string
  errors?: Record<string, string[]>
}

// Select Option
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
}

// Address
export interface Address {
  street: string
  city: string
  emirate: UAEEmirate
  country: string
  postalCode?: string
}

// Date Range
export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

// Sort Direction
export type SortDirection = 'asc' | 'desc'

// Sort Config
export interface SortConfig {
  column: string
  direction: SortDirection
}

// Filter Config
export interface FilterConfig {
  search?: string
  status?: string
  dateRange?: DateRange
  [key: string]: unknown
}

// Status Badge Variant
export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

// Status Config
export interface StatusConfig {
  label: string
  variant: StatusBadgeVariant
}

// Person (basic)
export interface Person {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
}

// Company Reference
export interface CompanyReference {
  id: string
  name: string
  logo?: string
}

// User Reference (for assignments, etc.)
export interface UserReference {
  id: string
  name: string
  avatar?: string
  role?: string
}

// Audit Fields
export interface AuditFields {
  createdAt: string
  createdBy?: string
  updatedAt: string
  updatedBy?: string
}

// Money/Currency
export interface Money {
  amount: number
  currency: string
}

// Coordinates (for maps)
export interface Coordinates {
  latitude: number
  longitude: number
}

// Time Range
export interface TimeRange {
  start: string // HH:mm format
  end: string // HH:mm format
}

// File/Attachment
export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
  uploadedBy?: string
}

// Note/Comment
export interface Note {
  id: string
  content: string
  createdAt: string
  createdBy: UserReference
}

// Activity Log Entry
export interface ActivityLogEntry {
  id: string
  action: string
  description: string
  entityType: string
  entityId: string
  user: UserReference
  timestamp: string
  metadata?: Record<string, unknown>
}

// Dashboard Metric
export interface DashboardMetric {
  label: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  trend?: number[]
  unit?: string
}

// Navigation Item
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  badge?: number | string
  children?: NavigationItem[]
  permissions?: string[]
}

// Breadcrumb Item
export interface BreadcrumbItem {
  label: string
  href?: string
}

// Table Column Definition
export interface TableColumn<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => unknown)
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T) => React.ReactNode
}

// Modal/Dialog State
export interface ModalState {
  isOpen: boolean
  data?: unknown
  mode?: 'create' | 'edit' | 'view'
}

// Form Field Error
export interface FieldError {
  field: string
  message: string
}

// Bulk Action
export interface BulkAction {
  id: string
  label: string
  icon?: string
  variant?: 'default' | 'destructive'
  requiresConfirmation?: boolean
}

// Export Format
export type ExportFormat = 'csv' | 'xlsx' | 'pdf'

// Import Result
export interface ImportResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    message: string
  }>
}

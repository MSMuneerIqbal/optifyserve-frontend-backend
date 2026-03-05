// UAE Emirates
export const UAE_EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Umm Al Quwain',
  'Fujairah',
] as const

export type UAEEmirate = (typeof UAE_EMIRATES)[number]

// Short codes for emirates
export const EMIRATE_CODES: Record<UAEEmirate, string> = {
  Dubai: 'DXB',
  'Abu Dhabi': 'AUH',
  Sharjah: 'SHJ',
  Ajman: 'AJM',
  'Ras Al Khaimah': 'RAK',
  'Umm Al Quwain': 'UAQ',
  Fujairah: 'FUJ',
}

// Customer Types
export const CUSTOMER_TYPES = ['individual', 'corporate', 'government'] as const
export type CustomerType = (typeof CUSTOMER_TYPES)[number]

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  individual: 'Individual',
  corporate: 'Corporate',
  government: 'Government',
}

// Status Options
export const STATUS_OPTIONS = ['active', 'inactive', 'blocked'] as const
export type Status = (typeof STATUS_OPTIONS)[number]

export const STATUS_LABELS: Record<Status, string> = {
  active: 'Active',
  inactive: 'Inactive',
  blocked: 'Blocked',
}

// Lead Sources
export const LEAD_SOURCES = ['website', 'referral', 'cold-call', 'exhibition', 'whatsapp'] as const
export type LeadSource = (typeof LEAD_SOURCES)[number]

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  'cold-call': 'Cold Call',
  exhibition: 'Exhibition',
  whatsapp: 'WhatsApp',
}

// Lead Stages
export const LEAD_STAGES = ['new', 'follow-up', 'qualified', 'closed-won', 'closed-lost'] as const
export type LeadStage = (typeof LEAD_STAGES)[number]

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New Leads',
  'follow-up': 'Follow-up',
  qualified: 'Qualified',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
}

// Invoice Status
export const INVOICE_STATUSES = [
  'draft',
  'sent',
  'partially-paid',
  'paid',
  'overdue',
  'cancelled',
] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  'partially-paid': 'Partially Paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

// Quotation Status
export const QUOTATION_STATUSES = ['draft', 'sent', 'approved', 'rejected', 'expired'] as const
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number]

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
}

// Payment Terms
export const PAYMENT_TERMS = ['net-30', 'net-60', 'due-on-receipt', 'advance'] as const
export type PaymentTerm = (typeof PAYMENT_TERMS)[number]

export const PAYMENT_TERM_LABELS: Record<PaymentTerm, string> = {
  'net-30': 'Net 30 Days',
  'net-60': 'Net 60 Days',
  'due-on-receipt': 'Due on Receipt',
  advance: 'Advance Payment',
}

// VAT Status
export const VAT_STATUSES = ['standard', 'zero-rated', 'exempt'] as const
export type VATStatus = (typeof VAT_STATUSES)[number]

export const VAT_STATUS_LABELS: Record<VATStatus, string> = {
  standard: 'Standard Rate (5%)',
  'zero-rated': 'Zero Rated (0%)',
  exempt: 'VAT Exempt',
}

// VAT Rate (UAE)
export const UAE_VAT_RATE = 0.05 // 5%

// User Roles
export const USER_ROLES = ['admin', 'manager', 'staff', 'technician'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  staff: 'Staff',
  technician: 'Technician',
}

// Pagination
export const PAGINATION_SIZES = [25, 50, 100] as const
export const DEFAULT_PAGE_SIZE = 25

// Date Formats
export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  displayWithTime: 'dd/MM/yyyy hh:mm a',
  api: 'yyyy-MM-dd',
  apiWithTime: "yyyy-MM-dd'T'HH:mm:ss",
} as const

// Stock Movement Types
export const STOCK_MOVEMENT_TYPES = ['in', 'out', 'transfer', 'adjustment'] as const
export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number]

export const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  in: 'Stock In',
  out: 'Stock Out',
  transfer: 'Transfer',
  adjustment: 'Adjustment',
}

// Job Status
export const JOB_STATUSES = [
  'pending',
  'scheduled',
  'in-progress',
  'on-hold',
  'completed',
  'cancelled',
] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  'in-progress': 'In Progress',
  'on-hold': 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// Follow-up Types
export const FOLLOW_UP_TYPES = ['call', 'email', 'meeting'] as const
export type FollowUpType = (typeof FOLLOW_UP_TYPES)[number]

export const FOLLOW_UP_TYPE_LABELS: Record<FollowUpType, string> = {
  call: 'Phone Call',
  email: 'Email',
  meeting: 'Meeting',
}

// Unit Types
export const UNIT_TYPES = ['pcs', 'kg', 'liters', 'meters', 'sets', 'boxes'] as const
export type UnitType = (typeof UNIT_TYPES)[number]

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  pcs: 'Pieces',
  kg: 'Kilograms',
  liters: 'Liters',
  meters: 'Meters',
  sets: 'Sets',
  boxes: 'Boxes',
}

// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'UAE Service ERP',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  timezone: 'Asia/Dubai',
  currency: 'AED',
  locale: 'en-AE',
}

// Sidebar width
export const SIDEBAR_WIDTH = {
  expanded: 280,
  collapsed: 64,
}

// Chart Colors (for Emirates)
export const EMIRATE_COLORS: Record<UAEEmirate, string> = {
  Dubai: '#3B82F6', // Blue
  'Abu Dhabi': '#22C55E', // Green
  Sharjah: '#F97316', // Orange
  Ajman: '#A855F7', // Purple
  'Ras Al Khaimah': '#06B6D4', // Cyan
  'Umm Al Quwain': '#EC4899', // Pink
  Fujairah: '#EAB308', // Yellow
}

// Status Colors
export const STATUS_COLORS = {
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  neutral: '#6B7280',
}

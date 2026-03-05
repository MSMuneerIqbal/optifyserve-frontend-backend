/**
 * Accounts Receivable Types
 * Phase 9: Accounts/Finance Module
 *
 * Track customer outstanding payments and aging
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * AR Invoice status
 */
export type ARInvoiceStatus = 'unpaid' | 'partially-paid' | 'paid' | 'overdue' | 'written-off'

/**
 * AR Invoice status config
 */
export const AR_STATUS_CONFIG: Record<ARInvoiceStatus, { key: string; variant: StatusBadgeVariant }> = {
  unpaid: { key: 'status.unpaid', variant: 'warning' },
  'partially-paid': { key: 'status.partiallyPaid', variant: 'info' },
  paid: { key: 'status.paid', variant: 'success' },
  overdue: { key: 'status.overdue', variant: 'error' },
  'written-off': { key: 'status.writtenOff', variant: 'neutral' },
}

/**
 * Aging bucket type
 */
export type AgingBucket = 'current' | '31-60' | '61-90' | '90-plus'

/**
 * Aging bucket labels
 */
export const AGING_BUCKET_KEYS: Record<AgingBucket, string> = {
  current: 'status.aging0to30',
  '31-60': 'status.aging31to60',
  '61-90': 'status.aging61to90',
  '90-plus': 'status.aging90plus',
}

/**
 * AR Invoice (linked to sales invoice)
 */
export interface ARInvoice {
  id: string
  invoiceId: string
  invoiceNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  status: ARInvoiceStatus
  agingDays: number
  agingBucket: AgingBucket
  lastPaymentDate?: string
  lastReminderDate?: string
  reminderCount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Customer payment record
 */
export interface CustomerPayment {
  id: string
  arInvoiceId: string
  invoiceNumber: string
  customerId: string
  customerName: string
  date: string
  amount: number
  paymentMethod: 'cash' | 'card' | 'bank-transfer' | 'cheque'
  referenceNumber?: string
  chequeNumber?: string
  bankName?: string
  notes?: string
  recordedBy: { id: string; name: string }
  createdAt: string
}

/**
 * Customer aging summary
 */
export interface CustomerAgingSummary {
  customerId: string
  customerName: string
  totalOutstanding: number
  current: number // 0-30 days
  days31to60: number
  days61to90: number
  days90plus: number
  invoiceCount: number
  oldestInvoiceDate: string
}

/**
 * AR Aging Report
 */
export interface ARAgingReport {
  asOfDate: string
  totalOutstanding: number
  currentTotal: number
  days31to60Total: number
  days61to90Total: number
  days90plusTotal: number
  customers: CustomerAgingSummary[]
}

/**
 * Customer statement entry
 */
export interface CustomerStatementEntry {
  date: string
  description: string
  reference: string
  debit: number
  credit: number
  balance: number
}

/**
 * Customer statement
 */
export interface CustomerStatement {
  customerId: string
  customerName: string
  customerAddress: string
  fromDate: string
  toDate: string
  openingBalance: number
  closingBalance: number
  totalDebits: number
  totalCredits: number
  entries: CustomerStatementEntry[]
}

/**
 * AR filters
 */
export interface ARFilters {
  search?: string
  status?: ARInvoiceStatus
  customerId?: string
  agingBucket?: AgingBucket
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * AR summary
 */
export interface ARSummary {
  totalOutstanding: number
  totalOverdue: number
  currentAmount: number
  days31to60Amount: number
  days61to90Amount: number
  days90plusAmount: number
  totalCustomers: number
  overdueCustomers: number
  averageDaysSales: number
}

/**
 * Write-off form data
 */
export interface WriteOffFormData {
  arInvoiceId: string
  amount: number
  reason: string
  date: string
}

/**
 * AR list response
 */
export type ARListResponse = PaginatedResponse<ARInvoice>

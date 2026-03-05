/**
 * Accounts Payable Types
 * Phase 9: Accounts/Finance Module
 *
 * Track vendor outstanding bills and payments
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'
import type { AgingBucket } from './accounts-receivable.types'

/**
 * AP Bill status
 */
export type APBillStatus = 'unpaid' | 'partially-paid' | 'paid' | 'overdue'

/**
 * AP Bill status config
 */
export const AP_STATUS_CONFIG: Record<APBillStatus, { key: string; variant: StatusBadgeVariant }> = {
  unpaid: { key: 'status.unpaid', variant: 'warning' },
  'partially-paid': { key: 'status.partiallyPaid', variant: 'info' },
  paid: { key: 'status.paid', variant: 'success' },
  overdue: { key: 'status.overdue', variant: 'error' },
}

/**
 * AP Bill (linked to purchase order/GRN)
 */
export interface APBill {
  id: string
  billNumber: string
  vendorBillNumber?: string
  purchaseOrderId?: string
  purchaseOrderNumber?: string
  vendorId: string
  vendorName: string
  vendorEmail: string
  vendorTRN?: string
  billDate: string
  dueDate: string
  totalAmount: number
  vatAmount: number
  paidAmount: number
  balanceAmount: number
  status: APBillStatus
  agingDays: number
  agingBucket: AgingBucket
  earlyPaymentDiscount?: {
    discountPercent: number
    discountDays: number
    discountAmount: number
  }
  lastPaymentDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Vendor payment record
 */
export interface VendorPayment {
  id: string
  apBillId: string
  billNumber: string
  vendorId: string
  vendorName: string
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
 * Vendor aging summary
 */
export interface VendorAgingSummary {
  vendorId: string
  vendorName: string
  totalOutstanding: number
  current: number
  days31to60: number
  days61to90: number
  days90plus: number
  billCount: number
  oldestBillDate: string
}

/**
 * AP Aging Report
 */
export interface APAgingReport {
  asOfDate: string
  totalOutstanding: number
  currentTotal: number
  days31to60Total: number
  days61to90Total: number
  days90plusTotal: number
  vendors: VendorAgingSummary[]
}

/**
 * Vendor statement entry
 */
export interface VendorStatementEntry {
  date: string
  description: string
  reference: string
  debit: number
  credit: number
  balance: number
}

/**
 * Vendor statement
 */
export interface VendorStatement {
  vendorId: string
  vendorName: string
  vendorAddress: string
  fromDate: string
  toDate: string
  openingBalance: number
  closingBalance: number
  totalDebits: number
  totalCredits: number
  entries: VendorStatementEntry[]
}

/**
 * AP filters
 */
export interface APFilters {
  search?: string
  status?: APBillStatus
  vendorId?: string
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
 * AP summary
 */
export interface APSummary {
  totalOutstanding: number
  totalOverdue: number
  currentAmount: number
  days31to60Amount: number
  days61to90Amount: number
  days90plusAmount: number
  totalVendors: number
  overdueVendors: number
  averageDaysPayable: number
}

/**
 * Vendor payment form data
 */
export interface VendorPaymentFormData {
  apBillId: string
  date: string
  amount: number
  paymentMethod: VendorPayment['paymentMethod']
  referenceNumber?: string
  chequeNumber?: string
  bankName?: string
  notes?: string
}

/**
 * AP Bill form data
 */
export interface APBillFormData {
  vendorId: string
  vendorBillNumber?: string
  purchaseOrderId?: string
  billDate: string
  dueDate: string
  totalAmount: number
  vatAmount: number
  notes?: string
}

/**
 * AP list response
 */
export type APListResponse = PaginatedResponse<APBill>

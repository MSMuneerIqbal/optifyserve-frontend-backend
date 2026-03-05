/**
 * Vendor Payment Types
 * Phase 8: Purchase Module - Payments
 *
 * Types for vendor payment tracking and recording
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * Payment method
 */
export type VendorPaymentMethod = 'cash' | 'bank-transfer' | 'cheque' | 'card' | 'online'

/**
 * Payment method labels
 */
export const VENDOR_PAYMENT_METHOD_KEYS: Record<VendorPaymentMethod, string> = {
  cash: 'status.cash',
  'bank-transfer': 'status.bankTransfer',
  cheque: 'status.cheque',
  card: 'status.creditDebitCard',
  online: 'status.onlinePayment',
}

/**
 * Payment status
 */
export type VendorPaymentStatus = 'pending' | 'completed' | 'bounced' | 'cancelled'

/**
 * Payment status configuration
 */
export const VENDOR_PAYMENT_STATUS_CONFIG: Record<VendorPaymentStatus, { key: string; variant: StatusBadgeVariant }> = {
  pending: { key: 'status.pending', variant: 'warning' },
  completed: { key: 'status.completed', variant: 'success' },
  bounced: { key: 'status.bounced', variant: 'error' },
  cancelled: { key: 'status.cancelled', variant: 'neutral' },
}

/**
 * Vendor Payment entity
 */
export interface VendorPayment {
  id: string
  paymentNumber: string
  vendorId: string
  vendorName: string
  purchaseOrderId?: string
  poNumber?: string
  paymentDate: string
  amount: number
  paymentMethod: VendorPaymentMethod
  status: VendorPaymentStatus

  // Bank/Cheque details
  referenceNumber?: string
  chequeNumber?: string
  chequeDate?: string
  bankName?: string
  accountNumber?: string

  notes?: string
  recordedBy: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Vendor payment filters
 */
export interface VendorPaymentFilters {
  search?: string
  vendorId?: string
  purchaseOrderId?: string
  status?: VendorPaymentStatus
  paymentMethod?: VendorPaymentMethod
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Vendor payment form data
 */
export interface VendorPaymentFormData {
  vendorId: string
  purchaseOrderId?: string
  paymentDate: string
  amount: number
  paymentMethod: VendorPaymentMethod
  referenceNumber?: string
  chequeNumber?: string
  chequeDate?: string
  bankName?: string
  accountNumber?: string
  notes?: string
}

/**
 * Vendor statement entry
 */
export interface VendorStatementEntry {
  id: string
  date: string
  type: 'purchase-order' | 'payment' | 'credit-note' | 'debit-note'
  referenceNumber: string
  description: string
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
  periodFrom: string
  periodTo: string
  openingBalance: number
  closingBalance: number
  totalDebits: number
  totalCredits: number
  entries: VendorStatementEntry[]
}

/**
 * Payment summary
 */
export interface PaymentSummary {
  totalPayments: number
  totalAmount: number
  pendingCount: number
  completedCount: number
  bouncedCount: number
  thisMonthTotal: number
  lastMonthTotal: number
}

/**
 * Vendor payment list response
 */
export type VendorPaymentListResponse = PaginatedResponse<VendorPayment>

/**
 * Invoice Types
 * Phase 6: Sales Module - Invoices
 *
 * UAE VAT-Compliant Invoice types
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'
import type { PaymentTerms } from './quotation.types'

/**
 * Invoice type (tax invoice vs proforma)
 */
export type InvoiceType = 'tax-invoice' | 'proforma'

/**
 * Invoice type labels
 */
export const INVOICE_TYPE_KEYS: Record<InvoiceType, string> = {
  'tax-invoice': 'sales.taxInvoice',
  proforma: 'sales.proformaInvoice',
}

/**
 * Invoice status
 */
export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'partially-paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void'

/**
 * Invoice status configuration for UI display
 */
export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  sent: { key: 'status.sent', variant: 'info' },
  'partially-paid': { key: 'status.partiallyPaid', variant: 'warning' },
  paid: { key: 'status.paid', variant: 'success' },
  overdue: { key: 'status.overdue', variant: 'error' },
  cancelled: { key: 'status.cancelled', variant: 'neutral' },
  void: { key: 'status.void', variant: 'neutral' },
}

/**
 * VAT status for line items
 */
export type VatStatus = 'standard' | 'zero-rated' | 'exempt'

/**
 * VAT status labels
 */
export const VAT_STATUS_KEYS: Record<VatStatus, string> = {
  standard: 'status.standardRate',
  'zero-rated': 'status.zeroRated',
  exempt: 'status.vatExempt',
}

/**
 * VAT rates by status
 */
export const VAT_RATES: Record<VatStatus, number> = {
  standard: 0.05,
  'zero-rated': 0,
  exempt: 0,
}

/**
 * Payment method
 */
export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'cheque'

/**
 * Payment method labels
 */
export const PAYMENT_METHOD_KEYS: Record<PaymentMethod, string> = {
  cash: 'status.cash',
  card: 'status.creditDebitCard',
  'bank-transfer': 'status.bankTransfer',
  cheque: 'status.cheque',
}

/**
 * UAE Emirates for VAT reporting
 */
export type VatEmirate =
  | 'Dubai'
  | 'Abu Dhabi'
  | 'Sharjah'
  | 'Ajman'
  | 'Ras Al Khaimah'
  | 'Umm Al Quwain'
  | 'Fujairah'

/**
 * Customer reference for invoice
 */
export interface InvoiceCustomer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  taxRegistrationNumber?: string
  address: {
    street: string
    city: string
    emirate: string
    country: string
  }
}

/**
 * Invoice line item
 */
export interface InvoiceItem {
  id: string
  itemId?: string
  itemCode?: string
  itemName: string
  description?: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number // Percentage
  discountAmount: number // Calculated
  vatStatus: VatStatus
  vatRate: number // 5% for standard, 0% for zero-rated/exempt
  vatAmount: number // Calculated
  total: number // Calculated after discount and before VAT
  totalWithVat: number // Calculated with VAT
}

/**
 * Payment record for invoice
 */
export interface InvoicePayment {
  id: string
  invoiceId: string
  date: string
  amount: number
  paymentMethod: PaymentMethod
  referenceNumber?: string
  chequeNumber?: string
  bankName?: string
  notes?: string
  recordedBy: {
    id: string
    name: string
  }
  createdAt: string
}

/**
 * Invoice entity (UAE VAT-Compliant)
 */
export interface Invoice {
  id: string
  invoiceNumber: string
  invoiceType?: InvoiceType
  customerId: string
  customer: InvoiceCustomer
  quotationId?: string
  quotationNumber?: string
  date: string
  dueDate: string
  vatEmirate: VatEmirate
  items: InvoiceItem[]

  // Amounts
  subtotal: number // Sum of all line totals (before VAT)
  totalDiscount: number // Sum of all discounts
  taxableAmount: number // Standard rated amount
  zeroRatedAmount: number // Zero-rated amount
  exemptAmount: number // Exempt amount
  vatAmount: number // Total VAT (5% of taxable amount)
  total: number // Grand total
  paidAmount: number
  balanceAmount: number

  status: InvoiceStatus
  paymentTerms: PaymentTerms
  payments: InvoicePayment[]

  // Company tax information (for invoice header)
  companyTRN: string
  companyName: string
  companyAddress: string

  // Additional fields
  notes?: string
  termsAndConditions?: string
  internalNotes?: string

  // Audit trail
  createdBy: {
    id: string
    name: string
  }
  sentDate?: string
  sentTo?: string

  // Metadata
  createdAt: string
  updatedAt: string
}

/**
 * Invoice filters for list view
 */
export interface InvoiceFilters {
  search?: string
  status?: InvoiceStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
  dueDateFrom?: string
  dueDateTo?: string
  minAmount?: number
  maxAmount?: number
  paymentStatus?: 'pending' | 'partial' | 'complete'
  overdue?: boolean
  vatEmirate?: VatEmirate
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Invoice form data for create/update
 */
export interface InvoiceFormData {
  customerId: string
  invoiceType?: InvoiceType
  quotationId?: string
  date: string
  dueDate: string
  vatEmirate: VatEmirate
  items: Omit<InvoiceItem, 'id' | 'discountAmount' | 'vatAmount' | 'total' | 'totalWithVat'>[]
  paymentTerms: PaymentTerms
  notes?: string
  termsAndConditions?: string
  internalNotes?: string
}

/**
 * Invoice item form data
 */
export interface InvoiceItemFormData {
  itemId?: string
  itemCode?: string
  itemName: string
  description?: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  vatStatus: VatStatus
  vatRate: number
}

/**
 * Payment form data
 */
export interface PaymentFormData {
  invoiceId: string
  date: string
  amount: number
  paymentMethod: InvoicePayment['paymentMethod']
  referenceNumber?: string
  chequeNumber?: string
  bankName?: string
  notes?: string
}

/**
 * Invoice summary for dashboard/reports
 */
export interface InvoiceSummary {
  totalInvoices: number
  draftCount: number
  sentCount: number
  paidCount: number
  partiallyPaidCount: number
  overdueCount: number
  cancelledCount: number
  totalValue: number
  totalReceived: number
  totalOutstanding: number
  averageValue: number
  averagePaymentDays: number
}

/**
 * VAT Summary for reporting
 */
export interface VatSummary {
  period: string
  standardRatedSales: number
  zeroRatedSales: number
  exemptSales: number
  totalSales: number
  outputVat: number // VAT collected (5% of standard rated)
}

/**
 * Invoice list response type
 */
export type InvoiceListResponse = PaginatedResponse<Invoice>

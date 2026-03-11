/**
 * Quotation Types
 * Phase 6: Sales Module - Quotations
 *
 * UAE VAT-Compliant Quotation types
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * Quotation status
 */
export type QuotationStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted'

/**
 * Quotation status configuration for UI display
 */
export const QUOTATION_STATUS_CONFIG: Record<QuotationStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  sent: { key: 'status.sent', variant: 'info' },
  viewed: { key: 'status.viewed', variant: 'info' },
  accepted: { key: 'status.accepted', variant: 'success' },
  rejected: { key: 'status.rejected', variant: 'error' },
  expired: { key: 'status.expired', variant: 'warning' },
  converted: { key: 'status.convertedToInvoice', variant: 'success' },
}

/**
 * Payment terms
 */
export type PaymentTerms = 'net-15' | 'net-30' | 'net-60' | 'due-on-receipt' | 'advance'

/**
 * Payment terms labels
 */
export const PAYMENT_TERMS_KEYS: Record<PaymentTerms, string> = {
  'net-15': 'status.net15',
  'net-30': 'status.net30',
  'net-60': 'status.net60',
  'due-on-receipt': 'status.dueOnReceipt',
  advance: 'status.advancePayment',
}

/**
 * Customer reference for quotation
 */
export interface QuotationCustomer {
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
 * Quotation line item
 */
export interface QuotationItem {
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
  vatRate: number // 5% for UAE standard
  vatAmount: number // Calculated
  total: number // Calculated after discount and before VAT
  totalWithVat: number // Calculated with VAT
}

/**
 * Quotation entity
 */
export interface Quotation {
  id: string
  quotationNumber: string
  customerId: string
  customer: QuotationCustomer
  date: string
  expiryDate: string
  validityDays: number
  items: QuotationItem[]
  subtotal: number // Sum of all line totals
  totalDiscount: number // Sum of all discounts
  taxableAmount: number // Subtotal - Total Discount
  vatAmount: number // 5% of taxable amount
  total: number // Taxable + VAT
  status: QuotationStatus
  paymentTerms: PaymentTerms
  notes?: string
  termsAndConditions?: string
  internalNotes?: string
  createdBy: {
    id: string
    name: string
  }
  approvedBy?: {
    id: string
    name: string
  }
  approvalDate?: string
  sentDate?: string
  convertedToInvoice?: {
    invoiceId: string
    invoiceNumber: string
    convertedDate: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Quotation filters for list view
 */
export interface QuotationFilters {
  search?: string
  status?: QuotationStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
  createdBy?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Quotation form data for create/update
 */
export interface QuotationFormData {
  customerId: string
  date: string
  expiryDate: string
  validityDays: number
  items: Omit<QuotationItem, 'id' | 'discountAmount' | 'vatAmount' | 'total' | 'totalWithVat'>[]
  paymentTerms: PaymentTerms
  notes?: string
  termsAndConditions?: string
  internalNotes?: string
}

/**
 * Quotation item form data (for adding/editing items)
 */
export interface QuotationItemFormData {
  itemId?: string
  itemCode?: string
  itemName: string
  description?: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  vatRate: number
}

/**
 * Quotation summary for dashboard/reports
 */
export interface QuotationSummary {
  totalQuotations: number
  draftCount: number
  sentCount: number
  acceptedCount: number
  rejectedCount: number
  expiredCount: number
  convertedCount: number
  totalValue: number
  averageValue: number
  conversionRate: number // Percentage
}

/**
 * Quotation list response type
 */
export type QuotationListResponse = PaginatedResponse<Quotation>

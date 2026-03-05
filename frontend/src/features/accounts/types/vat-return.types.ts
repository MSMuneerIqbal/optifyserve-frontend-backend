/**
 * VAT Return Types
 * Phase 9: Accounts/Finance Module
 *
 * UAE FTA VAT Return compliance types
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * VAT return period type
 */
export type VATReturnPeriod = 'monthly' | 'quarterly'

/**
 * VAT return status
 */
export type VATReturnStatus = 'draft' | 'calculated' | 'submitted' | 'filed' | 'paid'

/**
 * VAT return status config
 */
export const VAT_RETURN_STATUS_CONFIG: Record<VATReturnStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  calculated: { key: 'status.calculated', variant: 'info' },
  submitted: { key: 'status.submitted', variant: 'warning' },
  filed: { key: 'status.filed', variant: 'success' },
  paid: { key: 'status.paid', variant: 'success' },
}

/**
 * UAE FTA VAT Return boxes
 */
export interface VATReturnBoxes {
  // Sales (Output VAT)
  box1StandardRatedSales: number       // Standard Rated Sales (5%)
  box2VATOnStandardRatedSales: number  // VAT on Standard Rated Sales
  box3ZeroRatedSales: number           // Zero-Rated Sales (0%)
  box4ExemptSales: number              // Exempt Sales
  box5TotalSales: number               // Total Sales (Box1 + Box3 + Box4)

  // Purchases (Input VAT)
  box6StandardRatedPurchases: number   // Standard Rated Purchases (5%)
  box7VATOnStandardRatedPurchases: number // VAT on Standard Rated Purchases
  box8ZeroRatedPurchases: number       // Zero-Rated Purchases
  box9ExemptPurchases: number          // Exempt Purchases
  box10TotalPurchases: number          // Total Purchases (Box6 + Box8 + Box9)

  // VAT Due
  box11VATDue: number                  // VAT Due (Box2 - Box7)
  box12Adjustments: number             // Adjustments
  box13NetVATDue: number               // Net VAT Due (Box11 + Box12)
}

/**
 * VAT Return entity
 */
export interface VATReturn {
  id: string
  returnNumber: string
  periodType: VATReturnPeriod
  periodFrom: string
  periodTo: string
  companyTRN: string
  companyName: string
  boxes: VATReturnBoxes
  status: VATReturnStatus
  filingDeadline: string
  filedDate?: string
  paymentDate?: string
  paymentReference?: string
  notes?: string
  preparedBy: { id: string; name: string }
  approvedBy?: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

/**
 * VAT transaction line (for detail breakdown)
 */
export interface VATTransactionLine {
  id: string
  date: string
  documentType: 'sales-invoice' | 'purchase-bill' | 'expense' | 'journal-entry'
  documentNumber: string
  partyName: string
  partyTRN?: string
  taxableAmount: number
  vatRate: number
  vatAmount: number
  vatStatus: 'standard' | 'zero-rated' | 'exempt'
}

/**
 * VAT Return form data
 */
export interface VATReturnFormData {
  periodType: VATReturnPeriod
  periodFrom: string
  periodTo: string
  adjustments: number
  adjustmentNotes?: string
  notes?: string
}

/**
 * VAT Return filters
 */
export interface VATReturnFilters {
  status?: VATReturnStatus
  periodType?: VATReturnPeriod
  year?: number
  page?: number
  pageSize?: number
}

/**
 * VAT Summary (quick overview)
 */
export interface VATSummary {
  currentPeriod: string
  outputVAT: number
  inputVAT: number
  netVATDue: number
  nextFilingDeadline: string
  pendingReturns: number
  filedReturns: number
}

/**
 * VAT Return list response
 */
export type VATReturnListResponse = PaginatedResponse<VATReturn>

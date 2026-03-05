/**
 * Purchase Return Types
 * Phase 8: Purchase Module - Purchase Returns
 *
 * Types for returning damaged/defective items to vendors
 */

import type { PaginatedResponse, StatusBadgeVariant, Attachment } from '@/types/common.types'

/**
 * Return status
 */
export type PurchaseReturnStatus = 'draft' | 'pending' | 'approved' | 'sent' | 'completed' | 'cancelled'

/**
 * Return status configuration
 */
export const PURCHASE_RETURN_STATUS_CONFIG: Record<PurchaseReturnStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  pending: { key: 'status.pending', variant: 'warning' },
  approved: { key: 'status.approved', variant: 'info' },
  sent: { key: 'status.sentToVendor', variant: 'info' },
  completed: { key: 'status.completed', variant: 'success' },
  cancelled: { key: 'status.cancelled', variant: 'neutral' },
}

/**
 * Return reason
 */
export type ReturnReason = 'damaged' | 'wrong-item' | 'defective' | 'excess-quantity' | 'expired' | 'quality-issue' | 'other'

/**
 * Return reason labels
 */
export const RETURN_REASON_KEYS: Record<ReturnReason, string> = {
  damaged: 'status.damagedInTransit',
  'wrong-item': 'status.wrongItemDelivered',
  defective: 'status.defectiveNotWorking',
  'excess-quantity': 'status.excessQuantity',
  expired: 'status.expiredNearExpiry',
  'quality-issue': 'status.qualityIssue',
  other: 'status.other',
}

/**
 * Return type
 */
export type ReturnType = 'replace' | 'refund' | 'credit-note'

/**
 * Return type labels
 */
export const RETURN_TYPE_KEYS: Record<ReturnType, string> = {
  replace: 'status.replacement',
  refund: 'status.refund',
  'credit-note': 'status.creditNote',
}

/**
 * Return line item
 */
export interface ReturnLineItem {
  id: string
  grnLineItemId: string
  itemId?: string
  itemCode?: string
  itemName: string
  returnQuantity: number
  unit: string
  unitCost: number
  totalCost: number
  reason: ReturnReason
  notes?: string
}

/**
 * Purchase Return entity
 */
export interface PurchaseReturn {
  id: string
  returnNumber: string
  grnId: string
  grnNumber: string
  purchaseOrderId: string
  poNumber: string
  vendorId: string
  vendorName: string
  returnDate: string
  returnType: ReturnType
  items: ReturnLineItem[]

  // Totals
  totalItems: number
  totalQuantity: number
  totalAmount: number

  status: PurchaseReturnStatus
  creditNoteNumber?: string
  creditNoteAmount?: number

  attachments?: Attachment[]
  notes?: string
  createdBy: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Purchase return filters
 */
export interface PurchaseReturnFilters {
  search?: string
  status?: PurchaseReturnStatus
  vendorId?: string
  returnType?: ReturnType
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Purchase return form data
 */
export interface PurchaseReturnFormData {
  grnId: string
  purchaseOrderId: string
  vendorId: string
  returnDate: string
  returnType: ReturnType
  items: Array<{
    grnLineItemId: string
    itemId?: string
    itemName: string
    returnQuantity: number
    unit: string
    unitCost: number
    reason: ReturnReason
    notes?: string
  }>
  attachments?: Attachment[]
  notes?: string
}

/**
 * Purchase return list response
 */
export type PurchaseReturnListResponse = PaginatedResponse<PurchaseReturn>

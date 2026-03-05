/**
 * Goods Receipt Note (GRN) Types
 * Phase 8: Purchase Module - GRN
 *
 * Types for tracking received goods against purchase orders
 */

import type { PaginatedResponse, StatusBadgeVariant, Attachment } from '@/types/common.types'

/**
 * GRN status
 */
export type GRNStatus = 'draft' | 'inspecting' | 'accepted' | 'partially-accepted' | 'rejected'

/**
 * GRN status configuration
 */
export const GRN_STATUS_CONFIG: Record<GRNStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  inspecting: { key: 'status.underInspection', variant: 'warning' },
  accepted: { key: 'status.accepted', variant: 'success' },
  'partially-accepted': { key: 'status.partiallyAccepted', variant: 'warning' },
  rejected: { key: 'status.rejected', variant: 'error' },
}

/**
 * GRN line item
 */
export interface GRNLineItem {
  id: string
  poLineItemId: string
  itemId?: string
  itemCode?: string
  itemName: string
  orderedQuantity: number
  previouslyReceived: number
  receivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number
  unit: string
  unitCost: number
  totalCost: number
  rejectionReason?: string
  batchNumber?: string
  serialNumbers?: string[]
  warehouseLocationId?: string
  notes?: string
}

/**
 * GRN entity
 */
export interface GoodsReceiptNote {
  id: string
  grnNumber: string
  purchaseOrderId: string
  poNumber: string
  vendorId: string
  vendorName: string
  receiptDate: string
  deliveryNoteNumber?: string
  items: GRNLineItem[]

  // Totals
  totalReceived: number
  totalAccepted: number
  totalRejected: number
  totalCost: number

  status: GRNStatus
  warehouseId: string
  warehouseName: string
  receivedBy: {
    id: string
    name: string
  }
  inspectedBy?: {
    id: string
    name: string
  }
  attachments?: Attachment[]
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * GRN filters
 */
export interface GRNFilters {
  search?: string
  status?: GRNStatus
  vendorId?: string
  purchaseOrderId?: string
  warehouseId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * GRN form data
 */
export interface GRNFormData {
  purchaseOrderId: string
  receiptDate: string
  deliveryNoteNumber?: string
  warehouseId: string
  items: Array<{
    poLineItemId: string
    itemId?: string
    itemName: string
    orderedQuantity: number
    previouslyReceived: number
    receivedQuantity: number
    acceptedQuantity: number
    rejectedQuantity: number
    unit: string
    unitCost: number
    rejectionReason?: string
    batchNumber?: string
    notes?: string
  }>
  attachments?: Attachment[]
  notes?: string
}

/**
 * GRN list response
 */
export type GRNListResponse = PaginatedResponse<GoodsReceiptNote>

/**
 * Purchase Order Types
 * Phase 8: Purchase Module - Purchase Orders
 *
 * UAE VAT-compliant Purchase Order types with approval workflow
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'
import type { VendorPaymentTerms } from './vendor.types'

/**
 * Purchase order status
 */
export type POStatus =
  | 'draft'
  | 'pending-approval'
  | 'approved'
  | 'rejected'
  | 'sent'
  | 'confirmed'
  | 'partially-received'
  | 'fully-received'
  | 'closed'
  | 'cancelled'

/**
 * PO status configuration for UI display
 */
export const PO_STATUS_CONFIG: Record<POStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  'pending-approval': { key: 'status.pendingApproval', variant: 'warning' },
  approved: { key: 'status.approved', variant: 'success' },
  rejected: { key: 'status.rejected', variant: 'error' },
  sent: { key: 'status.sentToVendor', variant: 'info' },
  confirmed: { key: 'status.confirmed', variant: 'info' },
  'partially-received': { key: 'status.partiallyReceived', variant: 'warning' },
  'fully-received': { key: 'status.fullyReceived', variant: 'success' },
  closed: { key: 'status.closed', variant: 'neutral' },
  cancelled: { key: 'status.cancelled', variant: 'neutral' },
}

/**
 * Approval status
 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

/**
 * Approval level
 */
export type ApprovalLevel = 'level-1' | 'level-2' | 'level-3'

/**
 * Approval record
 */
export interface ApprovalRecord {
  id: string
  level: ApprovalLevel
  approverId: string
  approverName: string
  status: ApprovalStatus
  comments?: string
  date: string
}

/**
 * PO line item
 */
export interface POLineItem {
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
  vatRate: number // 5% UAE standard
  vatAmount: number // Calculated
  total: number // After discount, before VAT
  totalWithVat: number // With VAT
  receivedQuantity: number
  pendingQuantity: number
}

/**
 * Vendor reference in PO
 */
export interface POVendor {
  id: string
  vendorCode: string
  name: string
  email: string
  phone: string
  contactPerson: string
  taxRegistrationNumber?: string
  address: {
    street: string
    city: string
    emirate: string
    country: string
  }
}

/**
 * Purchase Order entity
 */
export interface PurchaseOrder {
  id: string
  poNumber: string
  vendorId: string
  vendor: POVendor
  date: string
  expectedDeliveryDate: string
  deliveryWarehouseId: string
  deliveryWarehouseName: string
  items: POLineItem[]

  // Amounts
  subtotal: number
  totalDiscount: number
  taxableAmount: number
  vatAmount: number
  total: number

  // Received amounts
  receivedAmount: number
  pendingAmount: number

  status: POStatus
  paymentTerms: VendorPaymentTerms

  // Approval
  approvalLevel: ApprovalLevel
  approvals: ApprovalRecord[]

  // Company info
  companyTRN: string
  companyName: string
  companyAddress: string

  // Additional
  notes?: string
  termsAndConditions?: string
  internalNotes?: string
  reference?: string

  // Audit
  createdBy: {
    id: string
    name: string
  }
  sentDate?: string
  sentTo?: string
  createdAt: string
  updatedAt: string
}

/**
 * PO filters
 */
export interface POFilters {
  search?: string
  status?: POStatus
  vendorId?: string
  dateFrom?: string
  dateTo?: string
  deliveryDateFrom?: string
  deliveryDateTo?: string
  minAmount?: number
  maxAmount?: number
  approvalStatus?: ApprovalStatus
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * PO form data
 */
export interface POFormData {
  vendorId: string
  date: string
  expectedDeliveryDate: string
  deliveryWarehouseId: string
  items: Array<{
    itemId?: string
    itemCode?: string
    itemName: string
    description?: string
    quantity: number
    unit: string
    unitPrice: number
    discount: number
    vatRate: number
  }>
  paymentTerms: VendorPaymentTerms
  notes?: string
  termsAndConditions?: string
  internalNotes?: string
  reference?: string
}

/**
 * PO summary for reports
 */
export interface POSummary {
  totalOrders: number
  draftCount: number
  pendingApprovalCount: number
  approvedCount: number
  sentCount: number
  partiallyReceivedCount: number
  fullyReceivedCount: number
  closedCount: number
  cancelledCount: number
  totalValue: number
  totalReceivedValue: number
  totalPendingValue: number
  averageOrderValue: number
}

/**
 * PO list response
 */
export type POListResponse = PaginatedResponse<PurchaseOrder>

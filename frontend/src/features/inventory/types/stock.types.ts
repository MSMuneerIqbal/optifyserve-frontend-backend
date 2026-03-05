/**
 * Stock Types
 * Phase 7: Inventory Module
 *
 * Stock movements, levels, and adjustments
 */

import type { PaginatedResponse, UserReference, StatusBadgeVariant } from '@/types/common.types'
import type { Warehouse, WarehouseLocation } from './warehouse.types'
import type { Item } from './item.types'

/**
 * Stock movement types
 */
export type StockMovementType = 'in' | 'out' | 'transfer' | 'adjustment'

/**
 * Stock movement type configuration
 */
export const STOCK_MOVEMENT_TYPE_CONFIG: Record<StockMovementType, { key: string; variant: StatusBadgeVariant; icon: string }> = {
  in: { key: 'status.stockIn', variant: 'success', icon: 'ArrowDownToLine' },
  out: { key: 'status.stockOut', variant: 'error', icon: 'ArrowUpToLine' },
  transfer: { key: 'status.transfer', variant: 'info', icon: 'ArrowLeftRight' },
  adjustment: { key: 'status.adjustmentType', variant: 'warning', icon: 'RefreshCw' },
}

/**
 * Adjustment reasons
 */
export type AdjustmentReason =
  | 'damage'         // Damaged goods
  | 'expired'         // Expired goods
  | 'lost'           // Lost/stolen goods
  | 'return'          // Customer return
  | 'correction'       // Counting correction
  | 'production'       // Manufactured output
  | 'other'           // Other reasons

/**
 * Adjustment reason labels
 */
export const ADJUSTMENT_REASON_KEYS: Record<AdjustmentReason, string> = {
  damage: 'status.damaged',
  expired: 'status.expired',
  lost: 'status.lostStolen',
  return: 'status.customerReturn',
  correction: 'status.countingCorrection',
  production: 'status.manufacturedOutput',
  other: 'status.other',
}

/**
 * Stock movement entity
 */
export interface StockMovement {
  id: string
  movementNumber: string // Auto-generated number
  type: StockMovementType
  itemId: string
  item?: Item // Reference to item details
  warehouseId: string
  fromWarehouseId?: string | null // For transfers
  toWarehouseId?: string | null // For transfers
  quantity: number // Movement quantity (always positive)
  unitCost?: number // Cost per unit at time of movement
  adjustmentReason?: AdjustmentReason // For adjustments
  referenceNumber?: string // PO number, SO number, etc.
  referenceType?: 'purchase-order' | 'sales-order' | 'transfer' | 'adjustment' | 'manual'
  notes?: string
  performedBy?: UserReference
  performedAt: string
  createdAt: string
}

/**
 * Stock movement form data
 */
export interface StockMovementFormData {
  type: StockMovementType
  itemId: string
  warehouseId: string
  fromWarehouseId?: string
  toWarehouseId?: string
  quantity: number
  adjustmentReason?: AdjustmentReason
  referenceNumber?: string
  referenceType?: 'purchase-order' | 'sales-order' | 'transfer' | 'adjustment' | 'manual'
  notes?: string
  performedAt?: string // Date string
}

/**
 * Stock level (real-time inventory)
 */
export interface StockLevel {
  itemId: string
  item?: Item
  warehouseId: string
  warehouse?: Warehouse
  locationId?: string | null
  availableQty: number
  reservedQty: number
  totalStock: number
  lastMovementDate?: string
  binLocation?: string
  shelfLocation?: string
  rackLocation?: string
}

/**
 * Stock adjustment form
 */
export interface StockAdjustmentFormData {
  itemId: string
  warehouseId: string
  locationId?: string
  adjustmentType: 'add' | 'remove' | 'correct'
  quantity: number
  reason: AdjustmentReason
  notes?: string
}

/**
 * Stock transfer form data
 */
export interface StockTransferFormData {
  itemId: string
  fromWarehouseId: string
  toWarehouseId: string
  fromLocationId?: string
  toLocationId?: string
  quantity: number
  notes?: string
}

/**
 * Stock movement filters
 */
export interface StockMovementFilters {
  search?: string
  type?: StockMovementType
  itemId?: string
  warehouseId?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}

/**
 * Stock movement list response
 */
export type StockMovementListResponse = PaginatedResponse<StockMovement>

/**
 * Current stock view data
 */
export interface CurrentStockView {
  item: Item
  warehouse: Warehouse
  location?: WarehouseLocation
  availableQty: number
  reservedQty: number
  totalStock: number
  unitCost: number
  stockValue: number // totalStock * unitCost
  lastMovementDate?: string
}

/**
 * Low stock alert item
 */
export interface LowStockAlert {
  id: string
  itemId: string
  item?: Item
  warehouseId: string
  currentStock: number
  reorderPoint: number
  suggestedOrderQty: number
  priority: 'critical' | 'warning' | 'info'
  isAcknowledged: boolean
  acknowledgedBy?: string
  createdAt: string
}

/**
 * Low stock alert priority
 */
export type LowStockPriority = 'critical' | 'warning' | 'info'

/**
 * Stock summary
 */
export interface StockSummary {
  totalItems: number
  totalValue: number // Using cost price
  totalStock: number // Sum of all stock
  lowStockCount: number
  outOfStockCount: number
  warehouseCount: number
}

export interface VatSummary {
  standardRated: number
  zeroRated: number
  exempt: number
  totalVat: number
}

export interface StockBatch {
  id: string
  itemId: string
  warehouseId: string
  quantity: number
  unitCost: number
  batchNumber?: string
  expiryDate?: string
  receivedDate: string
}

export interface StockValuation {
  itemId: string
  warehouseId: string
  totalQuantity: number
  totalValue: number
  averageCost: number
  method: 'fifo' | 'weighted-average'
}

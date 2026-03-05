/**
 * Parts Consumption Type Definitions
 * Phase 11: Jobs/Service Management Module
 */

/** Part consumption status */
export type ConsumptionStatus = 'used' | 'returned' | 'defective'

/** Inventory part (from Phase 7) */
export interface InventoryPart {
  id: string
  sku: string
  name: string
  category: string
  unitPrice: number
  availableStock: number
  unit: string
  warehouseId: string
  warehouseName: string
}

/** Part consumed in a job */
export interface PartConsumption {
  id: string
  jobId: string
  jobNumber: string
  partId: string
  partName: string
  partSku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: ConsumptionStatus
  warehouseId: string
  warehouseName: string
  issuedBy: string
  issuedAt: string
  returnedQuantity?: number
  returnedAt?: string
  notes?: string
}

/** Parts consumption form data */
export interface PartConsumptionFormData {
  jobId: string
  parts: {
    partId: string
    partName: string
    quantity: number
    unitPrice: number
    warehouseId: string
  }[]
}

/** Parts consumption summary */
export interface PartsConsumptionSummary {
  totalPartsUsed: number
  totalCost: number
  topParts: { partName: string; quantity: number; cost: number }[]
  byJob: { jobNumber: string; partsCount: number; totalCost: number }[]
}

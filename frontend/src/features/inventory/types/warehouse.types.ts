/**
 * Warehouse Types
 * Phase 7: Inventory Module
 *
 * Multi-warehouse, multi-branch support
 */

import type { PaginatedResponse, UserReference, StatusBadgeVariant } from '@/types/common.types'

/**
 * Warehouse status
 */
export type WarehouseStatus = 'active' | 'inactive' | 'blocked'

/**
 * Warehouse type
 */
export type WarehouseType = 'main' | 'branch' | 'store' | 'warehouse' | 'van'

/**
 * Warehouse status configuration
 */
export const WAREHOUSE_STATUS_CONFIG: Record<WarehouseStatus, { key: string; variant: StatusBadgeVariant }> = {
  active: { key: 'status.active', variant: 'success' },
  inactive: { key: 'status.inactive', variant: 'neutral' },
  blocked: { key: 'status.blocked', variant: 'error' },
}

/**
 * Warehouse type labels
 */
export const WAREHOUSE_TYPE_KEYS: Record<WarehouseType, string> = {
  main: 'status.mainWarehouse',
  branch: 'status.branchWarehouse',
  store: 'status.retailStore',
  warehouse: 'status.storageWarehouse',
  van: 'status.mobileVan',
}

/**
 * Warehouse location (for bin/shelf management)
 */
export interface WarehouseLocation {
  id: string
  warehouseId: string
  name: string // e.g., "Zone A", "Shelf B1", "Rack 2"
  locationType: 'zone' | 'shelf' | 'rack' | 'bin'
  parentLocationId?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Warehouse entity
 */
export interface Warehouse {
  id: string
  name: string
  code?: string // Short code for easy reference
  type: WarehouseType
  status: WarehouseStatus
  isDefault?: boolean // Default warehouse for company
  branchId?: string // Associated branch (null for main company)
  address?: {
    street: string
    city: string
    emirate: string
    country: string
  }
  phone?: string
  email?: string
  managerId?: string | null
  notes?: string
  isActive: boolean
  createdBy?: UserReference
  createdAt: string
  updatedAt: string
}

/**
 * Warehouse form data
 */
export interface WarehouseFormData {
  name: string
  code?: string
  type: WarehouseType
  status: WarehouseStatus
  branchId?: string
  address: {
    street: string
    city: string
    emirate: string
    country: string
  }
  phone?: string
  email?: string
  managerId?: string
  notes?: string
  isActive: boolean
}

/**
 * Warehouse filters
 */
export interface WarehouseFilters {
  search?: string
  type?: WarehouseType
  status?: WarehouseStatus
  branch?: string
  page?: number
  pageSize?: number
}

/**
 * Warehouse list response
 */
export type WarehouseListResponse = PaginatedResponse<Warehouse>

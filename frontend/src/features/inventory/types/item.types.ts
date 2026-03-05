/**
 * Item Types
 * Phase 7: Inventory Module
 *
 * Item and product management types for UAE ERP
 * Multi-company, multi-warehouse support
 */

import type { PaginatedResponse, UserReference, StatusBadgeVariant } from '@/types/common.types'

/**
 * Unit of measure for items
 * UAE common units for trade and service
 */
export type UnitOfMeasure =
  | 'pcs'           // Pieces
  | 'box'           // Box
  | 'carton'        // Carton
  | 'kg'            // Kilogram
  | 'grams'          // Gram
  | 'liters'        // Liter
  | 'ml'            // Milliliter
  | 'meters'        // Meters
  | 'm2'            // Square meters
  | 'feet'           // Linear feet
  | 'hours'          // Hours (service)
  | 'days'           // Days (rental/service)
  | 'sets'           // Sets
  | 'services'       // Services (intangible)

/**
 * Unit of measure labels
 */
export const UNIT_OF_MEASURE_KEYS: Record<UnitOfMeasure, string> = {
  pcs: 'status.pieces',
  box: 'status.box',
  carton: 'status.carton',
  kg: 'status.kilograms',
  grams: 'status.grams',
  liters: 'status.liters',
  ml: 'status.milliliters',
  meters: 'status.meters',
  m2: 'status.squareMeters',
  feet: 'status.linearFeet',
  hours: 'status.hours',
  days: 'status.days',
  sets: 'status.sets',
  services: 'status.services',
}

export const UNIT_OF_MEASURE_OPTIONS: { value: UnitOfMeasure; key: string }[] = Object.entries(UNIT_OF_MEASURE_KEYS).map(([value, key]) => ({ value: value as UnitOfMeasure, key }))

/**
 * Item categories
 */
export type ItemCategory = {
  id: string
  name: string
  nameAr?: string // Arabic name for RTL
  description?: string
  parentId?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Item status
 */
export type ItemStatus = 'active' | 'inactive' | 'discontinued'

/**
 * Item status configuration
 */
export const ITEM_STATUS_CONFIG: Record<ItemStatus, { key: string; variant: StatusBadgeVariant }> = {
  active: { key: 'status.active', variant: 'success' },
  inactive: { key: 'status.inactive', variant: 'neutral' },
  discontinued: { key: 'status.discontinued', variant: 'warning' },
}

/**
 * Item entity
 */
export interface Item {
  id: string
  sku: string // Unique per company
  name: string
  nameAr?: string // Arabic name
  description?: string
  categoryId: string
  category?: ItemCategory
  unitOfMeasure: UnitOfMeasure
  costPrice: number // Purchase cost in AED
  sellingPrice: number // Selling price in AED
  currency: string // Always 'AED' for UAE
  reorderPoint: number // Stock level to trigger reorder
  reorderQuantity: number // Suggested order quantity
  leadTimeDays: number // Days to restock
  image?: string
  barcode?: string
  serialNumber?: string
  hasSerialNumbers: boolean
  hasExpiry: boolean
  expiryDays?: number // Days before expiry
  status: ItemStatus
  stockTracked: boolean // Enable stock tracking for this item
  isActive: boolean
  createdBy?: UserReference
  createdAt: string
  updatedAt: string
}

/**
 * Item stock level per warehouse
 */
export interface ItemStockLevel {
  itemId: string
  warehouseId: string
  availableQty: number // Available for sale/use
  reservedQty: number // Reserved for orders/jobs
  onOrderQty: number // On purchase orders
  totalStock: number // Total physical stock
  lastStockCheck?: string
  lastMovementDate?: string
}

/**
 * Item form data for create/update
 */
export interface ItemFormData {
  sku: string
  name: string
  nameAr?: string
  description?: string
  categoryId: string
  unitOfMeasure: UnitOfMeasure
  costPrice: number
  sellingPrice: number
  reorderPoint: number
  reorderQuantity: number
  leadTimeDays: number
  image?: string
  barcode?: string
  serialNumber?: string
  hasSerialNumbers: boolean
  hasExpiry: boolean
  expiryDays?: number
  status: ItemStatus
  stockTracked: boolean
  isActive: boolean
}

/**
 * Item filters
 */
export interface ItemFilters {
  search?: string
  category?: string
  status?: ItemStatus
  lowStock?: boolean
  outOfStock?: boolean
  warehouse?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Item list response
 */
export type ItemListResponse = PaginatedResponse<Item>

/**
 * Item summary
 */
export interface ItemSummary {
  totalItems: number
  activeItems: number
  inactiveItems: number
  lowStockItems: number
  outOfStockItems: number
  totalStockValue: number // Using cost price
  totalStockValueAED: string
}

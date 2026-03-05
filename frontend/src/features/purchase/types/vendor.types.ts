/**
 * Vendor Types
 * Phase 8: Purchase Module - Vendor Management
 *
 * UAE-compliant vendor/supplier types with TRN, payment terms, and rating
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * Vendor status
 */
export type VendorStatus = 'active' | 'inactive' | 'blocked'

/**
 * Vendor status configuration for UI display
 */
export const VENDOR_STATUS_CONFIG: Record<VendorStatus, { key: string; variant: StatusBadgeVariant }> = {
  active: { key: 'status.active', variant: 'success' },
  inactive: { key: 'status.inactive', variant: 'neutral' },
  blocked: { key: 'status.blocked', variant: 'error' },
}

/**
 * Vendor category
 */
export type VendorCategory =
  | 'equipment-supplier'
  | 'spare-parts'
  | 'consumables'
  | 'raw-materials'
  | 'services'
  | 'tools'
  | 'safety-equipment'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'other'

/**
 * Vendor category labels
 */
export const VENDOR_CATEGORY_KEYS: Record<VendorCategory, string> = {
  'equipment-supplier': 'status.equipmentSupplier',
  'spare-parts': 'status.spareParts',
  consumables: 'status.consumables',
  'raw-materials': 'status.rawMaterials',
  services: 'status.services',
  tools: 'status.toolsEquipment',
  'safety-equipment': 'status.safetyEquipment',
  electrical: 'status.electricalSupplies',
  plumbing: 'status.plumbingSupplies',
  hvac: 'status.hvacParts',
  other: 'status.other',
}

/**
 * Payment terms for vendor
 */
export type VendorPaymentTerms = 'net-15' | 'net-30' | 'net-60' | 'cod' | 'advance'

/**
 * Payment terms labels
 */
export const VENDOR_PAYMENT_TERMS_KEYS: Record<VendorPaymentTerms, string> = {
  'net-15': 'status.net15',
  'net-30': 'status.net30',
  'net-60': 'status.net60',
  cod: 'status.cashOnDelivery',
  advance: 'status.advancePayment',
}

/**
 * Vendor contact person
 */
export interface VendorContact {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  isPrimary: boolean
}

/**
 * Vendor entity
 */
export interface Vendor {
  id: string
  vendorCode: string
  name: string
  email: string
  phone: string
  contactPerson: string
  taxRegistrationNumber?: string
  categories: VendorCategory[]
  paymentTerms: VendorPaymentTerms
  creditLimit: number
  outstandingAmount: number
  status: VendorStatus
  rating: number // 1-5
  address: {
    street: string
    city: string
    emirate: string
    country: string
  }
  contacts: VendorContact[]
  bankDetails?: {
    bankName: string
    accountNumber: string
    iban: string
    swiftCode?: string
  }
  totalPurchaseOrders: number
  totalPurchaseValue: number
  lastOrderDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Vendor filters
 */
export interface VendorFilters {
  search?: string
  status?: VendorStatus
  category?: VendorCategory
  paymentTerms?: VendorPaymentTerms
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Vendor form data
 */
export interface VendorFormData {
  name: string
  email: string
  phone: string
  contactPerson: string
  taxRegistrationNumber?: string
  categories: VendorCategory[]
  paymentTerms: VendorPaymentTerms
  creditLimit: number
  address: {
    street: string
    city: string
    emirate: string
    country: string
  }
  contacts: Omit<VendorContact, 'id'>[]
  bankDetails?: {
    bankName: string
    accountNumber: string
    iban: string
    swiftCode?: string
  }
  notes?: string
}

/**
 * Vendor summary for reports
 */
export interface VendorSummary {
  totalVendors: number
  activeCount: number
  inactiveCount: number
  blockedCount: number
  totalOutstanding: number
  totalPurchaseValue: number
  topVendorsByValue: Array<{
    vendorId: string
    vendorName: string
    totalValue: number
  }>
}

/**
 * Vendor list response
 */
export type VendorListResponse = PaginatedResponse<Vendor>

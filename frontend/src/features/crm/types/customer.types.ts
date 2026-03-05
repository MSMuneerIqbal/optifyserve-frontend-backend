/**
 * Customer Types
 * Phase 4: CRM Module - Customer Management
 */

import type { PaginatedResponse } from '@/types/common.types'

/**
 * Address structure
 */
export interface Address {
  street: string
  city: string
  emirate: string
  country: string
  postalCode?: string
}

/**
 * Customer type categories
 */
export type CustomerType = 'individual' | 'corporate' | 'government'

/**
 * Customer status
 */
export type CustomerStatus = 'active' | 'inactive' | 'blocked'

/**
 * Assigned sales representative
 */
export interface AssignedSalesRep {
  id: string
  name: string
  email?: string
  avatar?: string
}

/**
 * Customer contact person
 */
export interface ContactPerson {
  id: string
  name: string
  position?: string
  email: string
  phone: string
  isPrimary: boolean
}

/**
 * Customer entity
 */
export interface Customer {
  id: string
  customerNumber: string
  name: string
  email: string
  phone: string
  alternatePhone?: string
  company?: string
  customerType: CustomerType
  taxRegistrationNumber?: string
  address: Address
  billingAddress?: Address
  status: CustomerStatus
  lifetimeValue: number
  totalJobs: number
  totalInvoices: number
  outstandingBalance: number
  creditLimit?: number
  paymentTerms?: 'net-15' | 'net-30' | 'net-60' | 'due-on-receipt' | 'advance'
  lastContact?: string
  lastJobDate?: string
  assignedSalesRep?: AssignedSalesRep
  contactPersons?: ContactPerson[]
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Customer statistics for detail view
 */
export interface CustomerStats {
  totalJobs: number
  completedJobs: number
  activeJobs: number
  totalRevenue: number
  averageJobValue: number
  paymentReliability: number // 0-100 percentage
  firstJobDate?: string
  lastJobDate?: string
}

/**
 * Customer filters for list view
 */
export interface CustomerFilters {
  search?: string
  status?: CustomerStatus
  customerType?: CustomerType
  emirate?: string
  assignedTo?: string
  hasOutstanding?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Customer form data for create/update
 */
export interface CustomerFormData {
  name: string
  email: string
  phone: string
  alternatePhone?: string
  company?: string
  customerType: CustomerType
  taxRegistrationNumber?: string
  address: {
    street: string
    city: string
    emirate: string
  }
  billingAddress?: {
    street: string
    city: string
    emirate: string
  }
  creditLimit?: number
  paymentTerms?: string
  notes?: string
  tags?: string[]
}

/**
 * Customer job history item
 */
export interface CustomerJob {
  id: string
  jobNumber: string
  title: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  scheduledDate: string
  completedDate?: string
  amount: number
  technician?: {
    id: string
    name: string
  }
}

/**
 * Customer invoice history item
 */
export interface CustomerInvoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  amount: number
  paidAmount: number
  status: 'draft' | 'sent' | 'partially-paid' | 'paid' | 'overdue' | 'cancelled'
}

/**
 * Customer activity log item
 */
export interface CustomerActivity {
  id: string
  type: 'job_created' | 'job_completed' | 'invoice_sent' | 'payment_received' | 'note_added' | 'status_changed' | 'contact_updated'
  title: string
  description: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  metadata?: Record<string, unknown>
}

/**
 * Customer list response type
 */
export type CustomerListResponse = PaginatedResponse<Customer>

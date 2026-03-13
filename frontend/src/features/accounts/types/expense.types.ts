/**
 * Expense Types
 * Phase 9: Accounts/Finance Module
 *
 * Expense management with categories, approvals, and recurring expenses
 */

import type { PaginatedResponse, StatusBadgeVariant, Attachment } from '@/types/common.types'

/**
 * Expense category
 */
export type ExpenseCategory =
  | 'salaries-wages'
  | 'rent-utilities'
  | 'marketing-advertising'
  | 'transportation-fuel'
  | 'office-supplies'
  | 'insurance'
  | 'professional-fees'
  | 'repairs-maintenance'
  | 'travel-entertainment'
  | 'communications'
  | 'bank-charges'
  | 'government-fees'
  | 'depreciation'
  | 'other'

/**
 * Expense category labels
 */
export const EXPENSE_CATEGORY_KEYS: Record<ExpenseCategory, string> = {
  'salaries-wages': 'status.salariesWages',
  'rent-utilities': 'status.rentUtilities',
  'marketing-advertising': 'status.marketingAdvertising',
  'transportation-fuel': 'status.transportationFuel',
  'office-supplies': 'status.officeSupplies',
  insurance: 'status.insurance',
  'professional-fees': 'status.professionalFees',
  'repairs-maintenance': 'status.repairsMaintenance',
  'travel-entertainment': 'status.travelEntertainment',
  communications: 'status.communications',
  'bank-charges': 'status.bankCharges',
  'government-fees': 'status.governmentFees',
  depreciation: 'status.depreciation',
  other: 'status.other',
}

/**
 * Expense status
 */
export type ExpenseStatus = 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'paid'

/**
 * Expense status config
 */
export const EXPENSE_STATUS_CONFIG: Record<ExpenseStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  'pending-approval': { key: 'status.pendingApproval', variant: 'warning' },
  approved: { key: 'status.approved', variant: 'success' },
  rejected: { key: 'status.rejected', variant: 'error' },
  paid: { key: 'status.paid', variant: 'info' },
}

/**
 * Payment method for expenses
 */
export type ExpensePaymentMethod = 'cash' | 'credit-card' | 'bank-transfer' | 'petty-cash'

/**
 * Expense entity
 */
export interface Expense {
  id: string
  expenseNumber: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  vatAmount: number
  totalAmount: number
  vatStatus: 'standard' | 'zero-rated' | 'exempt'
  paymentMethod: ExpensePaymentMethod
  paidTo: string // Vendor/person name
  referenceNumber?: string
  accountCode: string // Chart of accounts code
  accountName: string
  department?: string
  project?: string
  isTaxDeductible: boolean
  isRecurring: boolean
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually'
  status: ExpenseStatus
  attachments: Attachment[]
  approvalHistory: ExpenseApproval[]
  submittedBy: { id: string; name: string }
  approvedBy?: { id: string; name: string }
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Expense approval record
 */
export interface ExpenseApproval {
  id: string
  expenseId: string
  action: 'submitted' | 'approved' | 'rejected'
  performedBy: { id: string; name: string }
  comments?: string
  date: string
}

/**
 * Expense form data
 */
export interface ExpenseFormData {
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  vatStatus: 'standard' | 'zero-rated' | 'exempt'
  paymentMethod: ExpensePaymentMethod
  paidTo: string
  referenceNumber?: string
  accountCode: string
  department?: string
  project?: string
  isTaxDeductible: boolean
  isRecurring: boolean
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually'
  notes?: string
}

/**
 * Expense filters
 */
export interface ExpenseFilters {
  search?: string
  status?: ExpenseStatus
  category?: ExpenseCategory
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
  department?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Expense summary
 */
export interface ExpenseSummary {
  totalExpenses: number
  totalAmount: number
  pendingApproval: number
  pendingAmount: number
  approvedAmount: number
  rejectedAmount: number
  byCategory: Array<{ category: ExpenseCategory; label: string; amount: number; count: number }>
  monthlyTrend: Array<{ month: string; amount: number }>
}

/**
 * Budget vs Actual data
 */
export interface BudgetActual {
  category: ExpenseCategory
  label: string
  budget: number
  actual: number
  variance: number
  variancePercent: number
}

/**
 * Expense list response
 */
export type ExpenseListResponse = PaginatedResponse<Expense>

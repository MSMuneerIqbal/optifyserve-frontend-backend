/**
 * Chart of Accounts Types
 * Phase 9: Accounts/Finance Module
 *
 * UAE-standard Chart of Accounts with hierarchical account structure
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * Account type categories
 */
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'

/**
 * Account type labels & config
 */
export const ACCOUNT_TYPE_CONFIG: Record<AccountType, { key: string; variant: StatusBadgeVariant; range: string }> = {
  asset: { key: 'status.asset', variant: 'info', range: '1000-1999' },
  liability: { key: 'status.liability', variant: 'warning', range: '2000-2999' },
  equity: { key: 'status.equity', variant: 'success', range: '3000-3999' },
  revenue: { key: 'status.revenue', variant: 'success', range: '4000-4999' },
  expense: { key: 'status.expense', variant: 'error', range: '5000-5999' },
}

/**
 * Account sub-categories
 */
export type AccountCategory =
  // Assets
  | 'cash-and-bank'
  | 'accounts-receivable'
  | 'inventory'
  | 'fixed-assets'
  | 'other-assets'
  // Liabilities
  | 'accounts-payable'
  | 'vat-payable'
  | 'loans'
  | 'other-liabilities'
  // Equity
  | 'capital'
  | 'retained-earnings'
  | 'reserves'
  // Revenue
  | 'sales-revenue'
  | 'service-revenue'
  | 'other-income'
  // Expenses
  | 'cost-of-goods-sold'
  | 'salaries-wages'
  | 'rent-utilities'
  | 'marketing'
  | 'transportation'
  | 'office-supplies'
  | 'insurance'
  | 'professional-fees'
  | 'repairs-maintenance'
  | 'depreciation'
  | 'other-expenses'

/**
 * Account category labels
 */
export const ACCOUNT_CATEGORY_KEYS: Record<AccountCategory, string> = {
  'cash-and-bank': 'status.cashAndBank',
  'accounts-receivable': 'status.accountsReceivable',
  inventory: 'status.inventory',
  'fixed-assets': 'status.fixedAssets',
  'other-assets': 'status.otherAssets',
  'accounts-payable': 'status.accountsPayable',
  'vat-payable': 'status.vatPayable',
  loans: 'status.loans',
  'other-liabilities': 'status.otherLiabilities',
  capital: 'status.capital',
  'retained-earnings': 'status.retainedEarnings',
  reserves: 'status.reserves',
  'sales-revenue': 'status.salesRevenue',
  'service-revenue': 'status.serviceRevenue',
  'other-income': 'status.otherIncome',
  'cost-of-goods-sold': 'status.costOfGoodsSold',
  'salaries-wages': 'status.salariesWages',
  'rent-utilities': 'status.rentUtilities',
  marketing: 'status.marketingAdvertising',
  transportation: 'status.transportationFuel',
  'office-supplies': 'status.officeSupplies',
  insurance: 'status.insurance',
  'professional-fees': 'status.professionalFees',
  'repairs-maintenance': 'status.repairsMaintenance',
  depreciation: 'status.depreciation',
  'other-expenses': 'status.otherExpenses',
}

/**
 * Account status
 */
export type AccountStatus = 'active' | 'inactive'

/**
 * Account entity
 */
export interface Account {
  id: string
  code: string // e.g., "1001"
  name: string
  type: AccountType
  category: AccountCategory
  parentId: string | null
  parentCode?: string
  description?: string
  status: AccountStatus
  isSystemAccount: boolean // Cannot be deleted
  balance: number
  debitBalance: number
  creditBalance: number
  transactionCount: number
  children?: Account[]
  createdAt: string
  updatedAt: string
}

/**
 * Account tree node (for tree view rendering)
 */
export interface AccountTreeNode extends Account {
  children: AccountTreeNode[]
  level: number
  isExpanded: boolean
}

/**
 * Account form data
 */
export interface AccountFormData {
  code: string
  name: string
  type: AccountType
  category: AccountCategory
  parentId: string | null
  description?: string
  status: AccountStatus
}

/**
 * Account filters
 */
export interface AccountFilters {
  search?: string
  type?: AccountType
  category?: AccountCategory
  status?: AccountStatus
  parentId?: string
}

/**
 * Account summary
 */
export interface AccountSummary {
  totalAccounts: number
  activeAccounts: number
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  totalRevenue: number
  totalExpenses: number
}

/**
 * Account list response
 */
export type AccountListResponse = PaginatedResponse<Account>

/**
 * Map account type to categories
 */
export const ACCOUNT_TYPE_CATEGORIES: Record<AccountType, AccountCategory[]> = {
  asset: ['cash-and-bank', 'accounts-receivable', 'inventory', 'fixed-assets', 'other-assets'],
  liability: ['accounts-payable', 'vat-payable', 'loans', 'other-liabilities'],
  equity: ['capital', 'retained-earnings', 'reserves'],
  revenue: ['sales-revenue', 'service-revenue', 'other-income'],
  expense: [
    'cost-of-goods-sold', 'salaries-wages', 'rent-utilities', 'marketing',
    'transportation', 'office-supplies', 'insurance', 'professional-fees',
    'repairs-maintenance', 'depreciation', 'other-expenses',
  ],
}

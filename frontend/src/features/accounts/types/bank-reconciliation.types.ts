/**
 * Bank Reconciliation Types
 * Phase 9: Accounts/Finance Module
 *
 * Match bank transactions with accounting records
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * Bank transaction type
 */
export type BankTransactionType = 'credit' | 'debit'

/**
 * Match status
 */
export type MatchStatus = 'matched' | 'unmatched' | 'partially-matched'

/**
 * Match status config
 */
export const MATCH_STATUS_CONFIG: Record<MatchStatus, { key: string; variant: StatusBadgeVariant }> = {
  matched: { key: 'status.matched', variant: 'success' },
  unmatched: { key: 'status.unmatched', variant: 'warning' },
  'partially-matched': { key: 'status.partialMatch', variant: 'info' },
}

/**
 * Bank transaction (from bank statement)
 */
export interface BankTransaction {
  id: string
  date: string
  description: string
  reference?: string
  type: BankTransactionType
  amount: number
  balance: number
  matchStatus: MatchStatus
  matchedEntryId?: string
  matchedEntryNumber?: string
  category?: string
  notes?: string
}

/**
 * Reconciliation entity
 */
export interface Reconciliation {
  id: string
  reconciliationNumber: string
  bankAccountId: string
  bankAccountName: string
  bankAccountCode: string
  statementDate: string
  statementOpeningBalance: number
  statementClosingBalance: number
  bookOpeningBalance: number
  bookClosingBalance: number
  totalMatched: number
  totalUnmatched: number
  totalBankCharges: number
  totalInterest: number
  status: 'in-progress' | 'completed'
  transactions: BankTransaction[]
  adjustments: ReconciliationAdjustment[]
  reconciliationDifference: number
  isReconciled: boolean
  completedBy?: { id: string; name: string }
  completedDate?: string
  createdBy: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

/**
 * Reconciliation adjustment
 */
export interface ReconciliationAdjustment {
  id: string
  date: string
  description: string
  type: 'bank-charge' | 'interest' | 'correction' | 'other'
  amount: number
  accountCode: string
  accountName: string
  journalEntryId?: string
}

/**
 * Reconciliation form data
 */
export interface ReconciliationFormData {
  bankAccountId: string
  statementDate: string
  statementOpeningBalance: number
  statementClosingBalance: number
}

/**
 * Bank transaction import data
 */
export interface BankTransactionImport {
  date: string
  description: string
  reference?: string
  debit?: number
  credit?: number
  balance?: number
}

/**
 * Reconciliation summary
 */
export interface ReconciliationSummary {
  lastReconciliationDate: string
  bookBalance: number
  bankBalance: number
  unreconciledItems: number
  totalDifference: number
}

/**
 * Reconciliation list response
 */
export type ReconciliationListResponse = PaginatedResponse<Reconciliation>

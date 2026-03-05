/**
 * Journal Entry Types
 * Phase 9: Accounts/Finance Module
 *
 * Manual accounting entries with debit/credit lines
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/**
 * Journal entry status
 */
export type JournalEntryStatus = 'draft' | 'posted' | 'reversed'

/**
 * Journal entry status config
 */
export const JOURNAL_STATUS_CONFIG: Record<JournalEntryStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  posted: { key: 'status.posted', variant: 'success' },
  reversed: { key: 'status.reversed', variant: 'warning' },
}

/**
 * Journal entry type
 */
export type JournalEntryType = 'manual' | 'adjustment' | 'closing' | 'opening' | 'recurring' | 'reversal'

/**
 * Journal entry type labels
 */
export const JOURNAL_TYPE_KEYS: Record<JournalEntryType, string> = {
  manual: 'status.manualEntry',
  adjustment: 'status.adjustmentType',
  closing: 'status.closingEntry',
  opening: 'status.openingEntry',
  recurring: 'status.recurringEntry',
  reversal: 'status.reversal',
}

/**
 * Journal line (debit or credit entry)
 */
export interface JournalLine {
  id: string
  accountId: string
  accountCode: string
  accountName: string
  description?: string
  debit: number
  credit: number
  reference?: string
}

/**
 * Journal entry entity
 */
export interface JournalEntry {
  id: string
  entryNumber: string
  date: string
  type: JournalEntryType
  narration: string
  lines: JournalLine[]
  totalDebit: number
  totalCredit: number
  isBalanced: boolean
  status: JournalEntryStatus
  referenceType?: string // 'invoice' | 'expense' | 'payment' etc.
  referenceId?: string
  referenceNumber?: string
  reversalOf?: string // ID of reversed journal entry
  reversedBy?: string // ID of reversal journal entry
  isRecurring: boolean
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually'
  nextRecurringDate?: string
  postedBy?: { id: string; name: string }
  postedDate?: string
  createdBy: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

/**
 * Journal line form data
 */
export interface JournalLineFormData {
  accountId: string
  accountCode: string
  accountName: string
  description?: string
  debit: number
  credit: number
}

/**
 * Journal entry form data
 */
export interface JournalEntryFormData {
  date: string
  type: JournalEntryType
  narration: string
  lines: JournalLineFormData[]
  referenceType?: string
  referenceId?: string
  referenceNumber?: string
  isRecurring: boolean
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually'
}

/**
 * Journal entry filters
 */
export interface JournalEntryFilters {
  search?: string
  type?: JournalEntryType
  status?: JournalEntryStatus
  dateFrom?: string
  dateTo?: string
  accountId?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * General Ledger entry
 */
export interface GeneralLedgerEntry {
  date: string
  entryNumber: string
  narration: string
  accountCode: string
  accountName: string
  debit: number
  credit: number
  balance: number
  referenceType?: string
  referenceNumber?: string
}

/**
 * General Ledger report
 */
export interface GeneralLedgerReport {
  accountId: string
  accountCode: string
  accountName: string
  accountType: string
  fromDate: string
  toDate: string
  openingBalance: number
  closingBalance: number
  totalDebits: number
  totalCredits: number
  entries: GeneralLedgerEntry[]
}

/**
 * Journal entry list response
 */
export type JournalEntryListResponse = PaginatedResponse<JournalEntry>

/**
 * Accounting Calculator
 * Phase 9: Accounts/Finance Module
 *
 * Core accounting calculations for balance computations
 */

import type { JournalLine } from '../types/journal-entry.types'
import type { ReportLineItem } from '../types/financial-report.types'

/**
 * Calculate total debits from journal lines
 */
export function calculateTotalDebits(lines: JournalLine[]): number {
  return Math.round(lines.reduce((sum, line) => sum + line.debit, 0) * 100) / 100
}

/**
 * Calculate total credits from journal lines
 */
export function calculateTotalCredits(lines: JournalLine[]): number {
  return Math.round(lines.reduce((sum, line) => sum + line.credit, 0) * 100) / 100
}

/**
 * Check if journal entry is balanced (debits = credits)
 */
export function isJournalBalanced(lines: JournalLine[]): boolean {
  const totalDebits = calculateTotalDebits(lines)
  const totalCredits = calculateTotalCredits(lines)
  return Math.abs(totalDebits - totalCredits) < 0.01
}

/**
 * Calculate net balance for an account
 * Assets & Expenses: Debit - Credit (normal debit balance)
 * Liabilities, Equity & Revenue: Credit - Debit (normal credit balance)
 */
export function calculateAccountBalance(
  debits: number,
  credits: number,
  accountType: string
): number {
  const isDebitNormal = accountType === 'asset' || accountType === 'expense'
  return isDebitNormal ? debits - credits : credits - debits
}

/**
 * Calculate gross profit
 */
export function calculateGrossProfit(revenue: number, cogs: number): number {
  return Math.round((revenue - cogs) * 100) / 100
}

/**
 * Calculate gross profit margin percentage
 */
export function calculateGrossProfitMargin(revenue: number, cogs: number): number {
  if (revenue === 0) return 0
  return Math.round(((revenue - cogs) / revenue) * 10000) / 100
}

/**
 * Calculate operating profit
 */
export function calculateOperatingProfit(
  grossProfit: number,
  operatingExpenses: number
): number {
  return Math.round((grossProfit - operatingExpenses) * 100) / 100
}

/**
 * Calculate net profit
 */
export function calculateNetProfit(
  operatingProfit: number,
  otherIncome: number,
  otherExpenses: number
): number {
  return Math.round((operatingProfit + otherIncome - otherExpenses) * 100) / 100
}

/**
 * Calculate net profit margin percentage
 */
export function calculateNetProfitMargin(netProfit: number, revenue: number): number {
  if (revenue === 0) return 0
  return Math.round((netProfit / revenue) * 10000) / 100
}

/**
 * Calculate current ratio
 */
export function calculateCurrentRatio(
  currentAssets: number,
  currentLiabilities: number
): number {
  if (currentLiabilities === 0) return 0
  return Math.round((currentAssets / currentLiabilities) * 100) / 100
}

/**
 * Verify balance sheet equation: Assets = Liabilities + Equity
 */
export function isBalanceSheetBalanced(
  totalAssets: number,
  totalLiabilities: number,
  totalEquity: number
): boolean {
  return Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
}

/**
 * Sum amounts from report line items
 */
export function sumReportLineItems(items: ReportLineItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100
}

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): { change: number; changePercent: number } {
  const change = current - previous
  const changePercent = previous === 0 ? (current > 0 ? 100 : 0) : (change / Math.abs(previous)) * 100
  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  }
}

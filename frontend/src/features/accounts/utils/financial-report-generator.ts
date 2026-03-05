/**
 * Financial Report Generator
 * Phase 9: Accounts/Finance Module
 *
 * Generate financial reports from account data
 */

import type { Account } from '../types/chart-of-accounts.types'
import type { ReportLineItem } from '../types/financial-report.types'
import { calculateChange } from './accounting-calculator'

/**
 * Convert accounts to report line items
 */
export function accountsToReportItems(
  accounts: Account[],
  previousAmounts?: Record<string, number>
): ReportLineItem[] {
  return accounts.map(account => {
    const previous = previousAmounts?.[account.id]
    const change = previous !== undefined ? calculateChange(account.balance, previous) : undefined

    return {
      accountCode: account.code,
      accountName: account.name,
      amount: account.balance,
      previousAmount: previous,
      change: change?.change,
      changePercent: change?.changePercent,
    }
  })
}

/**
 * Group accounts by category for reports
 */
export function groupAccountsByCategory(
  accounts: Account[]
): Record<string, Account[]> {
  return accounts.reduce((groups, account) => {
    const key = account.category
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(account)
    return groups
  }, {} as Record<string, Account[]>)
}

/**
 * Calculate subtotal line item
 */
export function createSubtotalItem(label: string, items: ReportLineItem[]): ReportLineItem {
  const amount = items.reduce((sum, item) => sum + item.amount, 0)
  const previousAmount = items.every(i => i.previousAmount !== undefined)
    ? items.reduce((sum, item) => sum + (item.previousAmount ?? 0), 0)
    : undefined

  const change = previousAmount !== undefined
    ? calculateChange(amount, previousAmount)
    : undefined

  return {
    accountCode: '',
    accountName: label,
    amount: Math.round(amount * 100) / 100,
    previousAmount: previousAmount !== undefined ? Math.round(previousAmount * 100) / 100 : undefined,
    change: change?.change,
    changePercent: change?.changePercent,
    isSubtotal: true,
  }
}

/**
 * Create total line item
 */
export function createTotalItem(label: string, amount: number, previousAmount?: number): ReportLineItem {
  const change = previousAmount !== undefined
    ? calculateChange(amount, previousAmount)
    : undefined

  return {
    accountCode: '',
    accountName: label,
    amount: Math.round(amount * 100) / 100,
    previousAmount: previousAmount !== undefined ? Math.round(previousAmount * 100) / 100 : undefined,
    change: change?.change,
    changePercent: change?.changePercent,
    isTotal: true,
  }
}

/**
 * Format report for export (CSV)
 */
export function formatReportForCSV(
  title: string,
  items: ReportLineItem[],
  includeComparison: boolean = false
): string {
  const headers = includeComparison
    ? ['Account Code', 'Account Name', 'Current Period', 'Previous Period', 'Change', 'Change %']
    : ['Account Code', 'Account Name', 'Amount']

  const rows = items.map(item => {
    const row = [item.accountCode, item.accountName, item.amount.toFixed(2)]
    if (includeComparison) {
      row.push(
        (item.previousAmount ?? 0).toFixed(2),
        (item.change ?? 0).toFixed(2),
        (item.changePercent ?? 0).toFixed(2) + '%'
      )
    }
    return row.join(',')
  })

  return [title, '', headers.join(','), ...rows].join('\n')
}

/**
 * Get month labels for the last N months
 */
export function getLastNMonthLabels(n: number): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const labels: string[] = []
  const today = new Date()

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    labels.push(`${months[date.getMonth()]} ${date.getFullYear()}`)
  }

  return labels
}

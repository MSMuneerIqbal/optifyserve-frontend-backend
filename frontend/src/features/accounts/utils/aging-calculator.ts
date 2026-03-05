/**
 * Aging Calculator
 * Phase 9: Accounts/Finance Module
 *
 * AR/AP aging calculations for overdue tracking
 */

import type { AgingBucket } from '../types/accounts-receivable.types'

/**
 * Calculate aging days from invoice date
 */
export function calculateAgingDays(dueDate: string, asOfDate?: string): number {
  const due = new Date(dueDate)
  const today = asOfDate ? new Date(asOfDate) : new Date()
  const diffTime = today.getTime() - due.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Determine aging bucket based on days
 */
export function getAgingBucket(agingDays: number): AgingBucket {
  if (agingDays <= 30) return 'current'
  if (agingDays <= 60) return '31-60'
  if (agingDays <= 90) return '61-90'
  return '90-plus'
}

/**
 * Get aging bucket label
 */
export function getAgingBucketLabel(bucket: AgingBucket): string {
  const labels: Record<AgingBucket, string> = {
    current: '0-30 Days',
    '31-60': '31-60 Days',
    '61-90': '61-90 Days',
    '90-plus': '90+ Days',
  }
  return labels[bucket]
}

/**
 * Get aging bucket color
 */
export function getAgingBucketColor(bucket: AgingBucket): string {
  const colors: Record<AgingBucket, string> = {
    current: 'text-green-600 bg-green-50',
    '31-60': 'text-amber-600 bg-amber-50',
    '61-90': 'text-orange-600 bg-orange-50',
    '90-plus': 'text-red-600 bg-red-50',
  }
  return colors[bucket]
}

/**
 * Calculate aging bucket amounts from a list of items with amounts and due dates
 */
export function calculateAgingBuckets(
  items: Array<{ dueDate: string; balanceAmount: number }>,
  asOfDate?: string
): { current: number; days31to60: number; days61to90: number; days90plus: number; total: number } {
  const result = { current: 0, days31to60: 0, days61to90: 0, days90plus: 0, total: 0 }

  for (const item of items) {
    const days = calculateAgingDays(item.dueDate, asOfDate)
    const bucket = getAgingBucket(days)
    result.total += item.balanceAmount

    switch (bucket) {
      case 'current':
        result.current += item.balanceAmount
        break
      case '31-60':
        result.days31to60 += item.balanceAmount
        break
      case '61-90':
        result.days61to90 += item.balanceAmount
        break
      case '90-plus':
        result.days90plus += item.balanceAmount
        break
    }
  }

  // Round all values
  result.current = Math.round(result.current * 100) / 100
  result.days31to60 = Math.round(result.days31to60 * 100) / 100
  result.days61to90 = Math.round(result.days61to90 * 100) / 100
  result.days90plus = Math.round(result.days90plus * 100) / 100
  result.total = Math.round(result.total * 100) / 100

  return result
}

/**
 * Calculate average days outstanding
 */
export function calculateAverageDaysOutstanding(
  items: Array<{ invoiceDate: string; paidDate?: string }>
): number {
  const paidItems = items.filter(item => item.paidDate)
  if (paidItems.length === 0) return 0

  const totalDays = paidItems.reduce((sum, item) => {
    const invoiceDate = new Date(item.invoiceDate)
    const paidDate = new Date(item.paidDate!)
    return sum + Math.floor((paidDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24))
  }, 0)

  return Math.round(totalDays / paidItems.length)
}

/**
 * Check if item is overdue
 */
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

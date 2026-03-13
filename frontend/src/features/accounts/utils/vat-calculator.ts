/**
 * DISPLAY-ONLY — Uses JS floating-point math. Do NOT use for authoritative
 * financial totals. Backend must recompute all monetary values with decimal.js.
 *
 * VAT Calculator
 * Phase 9: Accounts/Finance Module
 *
 * UAE FTA VAT calculations (5% standard rate)
 */

import type { VATReturnBoxes } from '../types/vat-return.types'
import { UAE_VAT_RATE } from '@/lib/constants'

/**
 * Calculate VAT amount from a taxable amount
 */
export function calculateVAT(taxableAmount: number, rate: number = UAE_VAT_RATE): number {
  return Math.round(taxableAmount * rate * 100) / 100
}

/**
 * Calculate amount inclusive of VAT
 */
export function calculateAmountWithVAT(amount: number, rate: number = UAE_VAT_RATE): number {
  return Math.round(amount * (1 + rate) * 100) / 100
}

/**
 * Extract VAT from a VAT-inclusive amount
 */
export function extractVATFromInclusive(inclusiveAmount: number, rate: number = UAE_VAT_RATE): {
  taxableAmount: number
  vatAmount: number
} {
  const taxableAmount = Math.round((inclusiveAmount / (1 + rate)) * 100) / 100
  const vatAmount = Math.round((inclusiveAmount - taxableAmount) * 100) / 100
  return { taxableAmount, vatAmount }
}

/**
 * Calculate VAT Return boxes from sales and purchase data
 */
export function calculateVATReturnBoxes(
  standardRatedSales: number,
  zeroRatedSales: number,
  exemptSales: number,
  standardRatedPurchases: number,
  zeroRatedPurchases: number,
  exemptPurchases: number,
  adjustments: number = 0
): VATReturnBoxes {
  const box2 = calculateVAT(standardRatedSales)
  const box7 = calculateVAT(standardRatedPurchases)
  const box5 = standardRatedSales + zeroRatedSales + exemptSales
  const box10 = standardRatedPurchases + zeroRatedPurchases + exemptPurchases
  const box11 = Math.round((box2 - box7) * 100) / 100
  const box13 = Math.round((box11 + adjustments) * 100) / 100

  return {
    box1StandardRatedSales: standardRatedSales,
    box2VATOnStandardRatedSales: box2,
    box3ZeroRatedSales: zeroRatedSales,
    box4ExemptSales: exemptSales,
    box5TotalSales: box5,
    box6StandardRatedPurchases: standardRatedPurchases,
    box7VATOnStandardRatedPurchases: box7,
    box8ZeroRatedPurchases: zeroRatedPurchases,
    box9ExemptPurchases: exemptPurchases,
    box10TotalPurchases: box10,
    box11VATDue: box11,
    box12Adjustments: adjustments,
    box13NetVATDue: box13,
  }
}

/**
 * Determine VAT filing deadline
 * UAE FTA: VAT returns due within 28 days after the end of the tax period
 */
export function getVATFilingDeadline(periodEndDate: string): string {
  const date = new Date(periodEndDate)
  date.setDate(date.getDate() + 28)
  return date.toISOString().split('T')[0]
}

/**
 * Check if VAT return is overdue
 */
export function isVATReturnOverdue(filingDeadline: string): boolean {
  return new Date(filingDeadline) < new Date()
}

/**
 * Get VAT period label
 */
export function getVATPeriodLabel(from: string, to: string): string {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (fromDate.getMonth() === toDate.getMonth()) {
    return `${months[fromDate.getMonth()]} ${fromDate.getFullYear()}`
  }

  return `${months[fromDate.getMonth()]} - ${months[toDate.getMonth()]} ${toDate.getFullYear()}`
}

/**
 * Format VAT box label
 */
export function formatVATBoxLabel(boxNumber: number): string {
  const labels: Record<number, string> = {
    1: 'Standard Rated Sales',
    2: 'VAT on Standard Rated Sales',
    3: 'Zero-Rated Sales',
    4: 'Exempt Sales',
    5: 'Total Sales',
    6: 'Standard Rated Purchases',
    7: 'VAT on Standard Rated Purchases',
    8: 'Zero-Rated Purchases',
    9: 'Exempt Purchases',
    10: 'Total Purchases',
    11: 'VAT Due',
    12: 'Adjustments',
    13: 'Net VAT Due',
  }
  return labels[boxNumber] || `Box ${boxNumber}`
}

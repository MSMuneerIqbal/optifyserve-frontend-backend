/**
 * VAT Calculator Hook
 * Phase 6: Sales Module
 *
 * Utility hook for UAE VAT calculations
 */

import { useMemo, useCallback } from 'react'
import type { VatStatus, InvoiceItem, QuotationItem } from '../types'

// UAE VAT Rate
export const UAE_VAT_RATE = 0.05 // 5%

/**
 * VAT calculation result
 */
export interface VATCalculationResult {
  subtotal: number
  totalDiscount: number
  standardRatedAmount: number
  standardRatedVat: number
  zeroRatedAmount: number
  exemptAmount: number
  totalVat: number
  grandTotal: number
}

/**
 * Line item for VAT calculation
 */
export interface VATLineItem {
  quantity: number
  unitPrice: number
  discount: number // percentage
  vatStatus: VatStatus
}

/**
 * Calculate VAT for a single line item
 */
export function calculateLineItemVat(item: VATLineItem): {
  lineTotal: number
  discountAmount: number
  netAmount: number
  vatRate: number
  vatAmount: number
  totalWithVat: number
} {
  const lineTotal = item.quantity * item.unitPrice
  const discountAmount = (lineTotal * item.discount) / 100
  const netAmount = lineTotal - discountAmount
  const vatRate = item.vatStatus === 'standard' ? UAE_VAT_RATE : 0
  const vatAmount = netAmount * vatRate
  const totalWithVat = netAmount + vatAmount

  return {
    lineTotal: Math.round(lineTotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
    vatRate: vatRate * 100, // Return as percentage
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalWithVat: Math.round(totalWithVat * 100) / 100,
  }
}

/**
 * Calculate VAT totals for multiple line items
 */
export function calculateVatTotals(items: VATLineItem[]): VATCalculationResult {
  let subtotal = 0
  let totalDiscount = 0
  let standardRatedAmount = 0
  let zeroRatedAmount = 0
  let exemptAmount = 0
  let totalVat = 0

  items.forEach((item) => {
    const calc = calculateLineItemVat(item)

    subtotal += calc.lineTotal
    totalDiscount += calc.discountAmount
    totalVat += calc.vatAmount

    switch (item.vatStatus) {
      case 'standard':
        standardRatedAmount += calc.netAmount
        break
      case 'zero-rated':
        zeroRatedAmount += calc.netAmount
        break
      case 'exempt':
        exemptAmount += calc.netAmount
        break
    }
  })

  const standardRatedVat = standardRatedAmount * UAE_VAT_RATE
  const grandTotal = subtotal - totalDiscount + totalVat

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    standardRatedAmount: Math.round(standardRatedAmount * 100) / 100,
    standardRatedVat: Math.round(standardRatedVat * 100) / 100,
    zeroRatedAmount: Math.round(zeroRatedAmount * 100) / 100,
    exemptAmount: Math.round(exemptAmount * 100) / 100,
    totalVat: Math.round(totalVat * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  }
}

/**
 * Hook for VAT calculations
 */
export function useVatCalculator(items: VATLineItem[]) {
  // Memoized calculation
  const calculation = useMemo(() => calculateVatTotals(items), [items])

  // Calculate single line item
  const calculateLineItem = useCallback((item: VATLineItem) => {
    return calculateLineItemVat(item)
  }, [])

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }, [])

  // Get VAT rate display
  const getVatRateDisplay = useCallback((vatStatus: VatStatus) => {
    switch (vatStatus) {
      case 'standard':
        return '5%'
      case 'zero-rated':
        return '0%'
      case 'exempt':
        return 'Exempt'
    }
  }, [])

  return {
    ...calculation,
    calculateLineItem,
    formatCurrency,
    getVatRateDisplay,
    vatRate: UAE_VAT_RATE,
    vatRatePercent: UAE_VAT_RATE * 100,
  }
}

/**
 * Hook to convert invoice/quotation items to VAT line items
 */
export function useItemsToVatItems(
  items: Array<Partial<InvoiceItem> | Partial<QuotationItem>>
): VATLineItem[] {
  return useMemo(() => {
    return items.map((item) => ({
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      discount: item.discount || 0,
      vatStatus: (item as InvoiceItem).vatStatus || 'standard',
    }))
  }, [items])
}

export default useVatCalculator

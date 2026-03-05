/**
 * Purchase Order Calculator
 * Phase 8: Purchase Module
 *
 * Calculate PO line item totals, VAT, and grand totals
 */

const UAE_VAT_RATE = 5 // 5%

/**
 * Calculate line item totals
 */
export function calculatePOLineItem(
  quantity: number,
  unitPrice: number,
  discount: number,
  vatRate: number = UAE_VAT_RATE
): {
  discountAmount: number
  total: number
  vatAmount: number
  totalWithVat: number
} {
  const lineTotal = quantity * unitPrice
  const discountAmount = (lineTotal * discount) / 100
  const total = lineTotal - discountAmount
  const vatAmount = (total * vatRate) / 100
  const totalWithVat = total + vatAmount

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalWithVat: Math.round(totalWithVat * 100) / 100,
  }
}

/**
 * Calculate PO totals from line items
 */
export function calculatePOTotals(
  items: Array<{
    quantity: number
    unitPrice: number
    discount: number
    vatRate?: number
  }>
): {
  subtotal: number
  totalDiscount: number
  taxableAmount: number
  vatAmount: number
  total: number
} {
  let subtotal = 0
  let totalDiscount = 0
  let taxableAmount = 0
  let vatAmount = 0

  for (const item of items) {
    const lineTotal = item.quantity * item.unitPrice
    const calc = calculatePOLineItem(
      item.quantity,
      item.unitPrice,
      item.discount,
      item.vatRate ?? UAE_VAT_RATE
    )

    subtotal += lineTotal
    totalDiscount += calc.discountAmount
    taxableAmount += calc.total
    vatAmount += calc.vatAmount
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: Math.round((taxableAmount + vatAmount) * 100) / 100,
  }
}

/**
 * Calculate outstanding PO amount
 */
export function calculateOutstandingPO(
  totalAmount: number,
  receivedAmount: number,
  returnedAmount: number
): number {
  return Math.round((totalAmount - receivedAmount - returnedAmount) * 100) / 100
}

/**
 * Calculate vendor outstanding balance
 */
export function calculateVendorOutstanding(
  totalPurchases: number,
  totalPayments: number,
  totalCreditNotes: number
): number {
  return Math.round((totalPurchases - totalPayments - totalCreditNotes) * 100) / 100
}

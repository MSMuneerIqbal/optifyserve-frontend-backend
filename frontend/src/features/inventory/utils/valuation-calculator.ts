/**
 * Valuation Calculator Utilities
 * Phase 7: Inventory Module
 *
 * Stock valuation methods: FIFO, Weighted Average
 */

import type { StockBatch, StockValuation } from '../types/stock.types'
import type { Item } from '../types/item.types'

/**
 * FIFO (First In, First Out) Valuation
 *
 * Assumes oldest inventory is sold first
 * Good for: Perishable goods, items with expiry
 */
export function calculateFIFO(
  _item: Item,
  batches: StockBatch[],
  currentQuantity: number
): StockValuation {
  let remainingQuantity = currentQuantity
  let totalValue = 0

  // Sort batches by received date (oldest first)
  const sortedBatches = [...batches].sort((a, b) =>
    new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime()
  )

  for (const batch of sortedBatches) {
    if (remainingQuantity <= 0) break

    const quantityToTake = Math.min(remainingQuantity, batch.quantity)
    totalValue += quantityToTake * batch.unitCost
    remainingQuantity -= quantityToTake
  }

  const averageCost = currentQuantity > 0 ? totalValue / currentQuantity : 0

  return {
    itemId: _item.id,
    warehouseId: batches[0]?.warehouseId ?? '',
    method: 'fifo',
    totalValue,
    averageCost,
    totalQuantity: currentQuantity,
  }
}

/**
 * Weighted Average Cost Valuation
 *
 * Calculates average cost across all inventory
 * Good for: Homogeneous goods, stable pricing
 */
export function calculateWeightedAverage(
  _item: Item,
  batches: StockBatch[],
  currentQuantity: number
): StockValuation {
  if (currentQuantity === 0 || batches.length === 0) {
    return {
      itemId: _item.id,
      warehouseId: batches[0]?.warehouseId ?? '',
      method: 'weighted-average',
      totalValue: 0,
      averageCost: 0,
      totalQuantity: 0,
    }
  }

  let totalCost = 0
  let totalQuantity = 0

  for (const batch of batches) {
    totalCost += batch.unitCost * batch.quantity
    totalQuantity += batch.quantity
  }

  const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0
  const totalValue = averageCost * currentQuantity

  return {
    itemId: _item.id,
    warehouseId: batches[0]?.warehouseId ?? '',
    method: 'weighted-average',
    totalValue,
    averageCost,
    totalQuantity: currentQuantity,
  }
}

/**
 * Calculate stock aging for inventory reporting
 */
export function calculateStockAging(batches: StockBatch[]): {
  fastMoving: number // 0-30 days
  normalMoving: number // 31-90 days
  slowMoving: number // 91-180 days
  obsolete: number // 180+ days
} {
  const now = new Date()
  const oneDayMs = 24 * 60 * 60 * 1000

  return batches.reduce((acc, batch) => {
    const ageInDays = Math.floor((now.getTime() - new Date(batch.receivedDate).getTime()) / oneDayMs)

    if (ageInDays <= 30) {
      acc.fastMoving += batch.quantity
    } else if (ageInDays <= 90) {
      acc.normalMoving += batch.quantity
    } else if (ageInDays <= 180) {
      acc.slowMoving += batch.quantity
    } else {
      acc.obsolete += batch.quantity
    }

    return acc
  }, {
    fastMoving: 0,
    normalMoving: 0,
    slowMoving: 0,
    obsolete: 0,
  })
}

/**
 * Calculate total inventory value by valuation method
 */
export function calculateTotalInventoryValue(
  items: Item[],
  stockLevels: Array<{ itemId: string; quantity: number; batches?: StockBatch[] }>,
  method: 'fifo' | 'weighted-average' = 'fifo'
): {
  totalValue: number
  breakdown: Array<{ itemId: string; itemName: string; value: number; quantity: number }>
} {
  const breakdown = items.map((item) => {
    const stockLevel = stockLevels.find((s) => s.itemId === item.id)
    const quantity = stockLevel?.quantity || 0
    const batches = stockLevel?.batches || []

    let valuation: StockValuation

    switch (method) {
      case 'fifo':
        valuation = calculateFIFO(item, batches, quantity)
        break
      case 'weighted-average':
        valuation = calculateWeightedAverage(item, batches, quantity)
        break
    }

    return {
      itemId: item.id,
      itemName: item.name,
      value: valuation.totalValue,
      quantity,
    }
  })

  const totalValue = breakdown.reduce((sum, item) => sum + item.value, 0)

  return {
    totalValue,
    breakdown,
  }
}

/**
 * Calculate unrealized gains/losses on inventory
 * Difference between current valuation and purchase cost
 */
export function calculateUnrealizedGainsLosses(
  items: Item[],
  stockLevels: Array<{ itemId: string; quantity: number }>
): {
  totalUnrealizedGain: number
  totalUnrealizedLoss: number
  net: number
} {
  let totalUnrealizedGain = 0
  let totalUnrealizedLoss = 0

  items.forEach((item) => {
    const stockLevel = stockLevels.find((s) => s.itemId === item.id)
    const quantity = stockLevel?.quantity || 0

    const totalCost = quantity * item.costPrice
    const totalValue = quantity * item.sellingPrice
    const diff = totalValue - totalCost

    if (diff > 0) {
      totalUnrealizedGain += diff
    } else {
      totalUnrealizedLoss += Math.abs(diff)
    }
  })

  return {
    totalUnrealizedGain,
    totalUnrealizedLoss,
    net: totalUnrealizedGain - totalUnrealizedLoss,
  }
}

export default {
  calculateFIFO,
  calculateWeightedAverage,
  calculateStockAging,
  calculateTotalInventoryValue,
  calculateUnrealizedGainsLosses,
}

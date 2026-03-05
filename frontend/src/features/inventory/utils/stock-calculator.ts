/**
 * Stock Calculator Utilities
 * Phase 7: Inventory Module
 *
 * Utility functions for stock calculations
 */

import type { Item } from '../types/item.types'
import type { StockLevel } from '../types/stock.types'
import type { Warehouse } from '../types/warehouse.types'

/**
 * Calculate available stock for an item in a warehouse
 * In production, this would fetch from stock API
 */
export function calculateAvailableStock(
  item: Item,
  warehouse: Warehouse,
  currentLevels: StockLevel[]
): number {
  const stockLevel = currentLevels.find(
    (level) => level.itemId === item.id && level.warehouseId === warehouse.id
  )
  return stockLevel?.totalStock || 0
}

/**
 * Calculate if item is low stock
 */
export function isLowStock(item: Item, currentQuantity: number): boolean {
  return item.stockTracked && currentQuantity <= item.reorderPoint && currentQuantity > 0
}

/**
 * Calculate if item is out of stock
 */
export function isOutOfStock(item: Item, currentQuantity: number): boolean {
  return item.stockTracked && currentQuantity === 0
}

/**
 * Calculate stock status percentage
 */
export function getStockStatusPercent(item: Item, currentQuantity: number): number {
  if (!item.stockTracked || item.reorderPoint === 0) return 100
  return Math.min((currentQuantity / item.reorderPoint) * 100, 100)
}

/**
 * Calculate days of stock remaining based on average usage
 */
export function calculateDaysOfStockRemaining(
  currentQuantity: number,
  dailyUsage: number
): number {
  if (dailyUsage <= 0) return Infinity
  return Math.floor(currentQuantity / dailyUsage)
}

/**
 * Calculate reorder date based on current stock and lead time
 */
export function calculateReorderDate(
  item: Item,
  currentQuantity: number,
  dailyUsage: number
): Date | null {
  const daysRemaining = calculateDaysOfStockRemaining(currentQuantity, dailyUsage)
  if (daysRemaining === Infinity) return null

  // Order when stock reaches reorder point
  const quantityUntilReorder = currentQuantity - item.reorderPoint
  const daysUntilReorder = Math.floor(quantityUntilReorder / dailyUsage)

  const reorderDate = new Date()
  reorderDate.setDate(reorderDate.getDate() + daysUntilReorder)

  return reorderDate
}

/**
 * Calculate expected stockout date
 */
export function calculateStockoutDate(
  _item: Item,
  currentQuantity: number,
  dailyUsage: number
): Date | null {
  const daysRemaining = calculateDaysOfStockRemaining(currentQuantity, dailyUsage)
  if (daysRemaining === Infinity) return null

  const stockoutDate = new Date()
  stockoutDate.setDate(stockoutDate.getDate() + daysRemaining)

  return stockoutDate
}

/**
 * Calculate optimal reorder quantity
 * Factors in: lead time, daily usage, safety stock level
 */
export function calculateOptimalReorderQuantity(
  item: Item,
  dailyUsage: number,
  safetyStockDays: number = 7
): number {
  // Usage during lead time + safety stock - current stock
  const usageDuringLeadTime = dailyUsage * item.leadTimeDays
  const safetyStock = dailyUsage * safetyStockDays

  const optimalQuantity = usageDuringLeadTime + safetyStock

  // Round up to nearest pack size (if applicable)
  // For now, round to nearest 10
  return Math.ceil(optimalQuantity / 10) * 10
}

/**
 * Calculate total stock value across all warehouses
 */
export function calculateTotalStockValue(
  items: Item[],
  stockLevels: StockLevel[]
): number {
  return items.reduce((total, item) => {
    const itemStock = stockLevels.filter((level) => level.itemId === item.id)
    const quantity = itemStock.reduce((sum, level) => sum + level.totalStock, 0)
    return total + (quantity * item.costPrice)
  }, 0)
}

/**
 * Calculate potential revenue (selling price * stock)
 */
export function calculatePotentialRevenue(
  items: Item[],
  stockLevels: StockLevel[]
): number {
  return items.reduce((total, item) => {
    const itemStock = stockLevels.filter((level) => level.itemId === item.id)
    const quantity = itemStock.reduce((sum, level) => sum + level.totalStock, 0)
    return total + (quantity * item.sellingPrice)
  }, 0)
}

/**
 * Calculate stock turnover rate
 * (Cost of Goods Sold / Average Stock Value)
 */
export function calculateStockTurnoverRate(
  cogs: number,
  averageStockValue: number
): number {
  if (averageStockValue === 0) return 0
  return cogs / averageStockValue
}

/**
 * Calculate days sales of inventory
 * (365 / Stock Turnover Rate)
 */
export function calculateDaysSalesOfInventory(turnoverRate: number): number {
  if (turnoverRate === 0) return Infinity
  return 365 / turnoverRate
}

export default {
  calculateAvailableStock,
  isLowStock,
  isOutOfStock,
  getStockStatusPercent,
  calculateDaysOfStockRemaining,
  calculateReorderDate,
  calculateStockoutDate,
  calculateOptimalReorderQuantity,
  calculateTotalStockValue,
  calculatePotentialRevenue,
  calculateStockTurnoverRate,
  calculateDaysSalesOfInventory,
}

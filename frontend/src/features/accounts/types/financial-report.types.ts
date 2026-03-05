/**
 * Financial Report Types
 * Phase 9: Accounts/Finance Module
 *
 * P&L, Balance Sheet, Cash Flow, Trial Balance
 */

/**
 * Report period
 */
export interface ReportPeriod {
  from: string
  to: string
  label: string
}

/**
 * Report line item
 */
export interface ReportLineItem {
  accountCode: string
  accountName: string
  amount: number
  previousAmount?: number
  change?: number
  changePercent?: number
  isTotal?: boolean
  isSubtotal?: boolean
  indent?: number
  children?: ReportLineItem[]
}

/**
 * Profit & Loss Statement
 */
export interface ProfitLossStatement {
  period: ReportPeriod
  comparisonPeriod?: ReportPeriod

  // Revenue
  revenue: ReportLineItem[]
  totalRevenue: number
  previousTotalRevenue?: number

  // Cost of Goods Sold
  cogs: ReportLineItem[]
  totalCOGS: number
  previousTotalCOGS?: number

  // Gross Profit
  grossProfit: number
  previousGrossProfit?: number
  grossProfitMargin: number

  // Operating Expenses
  operatingExpenses: ReportLineItem[]
  totalOperatingExpenses: number
  previousTotalOperatingExpenses?: number

  // Operating Profit
  operatingProfit: number
  previousOperatingProfit?: number
  operatingProfitMargin: number

  // Other Income/Expenses
  otherIncome: ReportLineItem[]
  totalOtherIncome: number
  otherExpenses: ReportLineItem[]
  totalOtherExpenses: number

  // Net Profit
  netProfit: number
  previousNetProfit?: number
  netProfitMargin: number

  generatedAt: string
}

/**
 * Balance Sheet
 */
export interface BalanceSheet {
  asOfDate: string
  comparisonDate?: string

  // Assets
  currentAssets: ReportLineItem[]
  totalCurrentAssets: number
  fixedAssets: ReportLineItem[]
  totalFixedAssets: number
  totalAssets: number
  previousTotalAssets?: number

  // Liabilities
  currentLiabilities: ReportLineItem[]
  totalCurrentLiabilities: number
  longTermLiabilities: ReportLineItem[]
  totalLongTermLiabilities: number
  totalLiabilities: number
  previousTotalLiabilities?: number

  // Equity
  equity: ReportLineItem[]
  totalEquity: number
  previousTotalEquity?: number

  // Check: Assets = Liabilities + Equity
  isBalanced: boolean
  totalLiabilitiesAndEquity: number

  generatedAt: string
}

/**
 * Cash Flow Statement
 */
export interface CashFlowStatement {
  period: ReportPeriod

  // Operating Activities
  operatingActivities: ReportLineItem[]
  netCashFromOperating: number

  // Investing Activities
  investingActivities: ReportLineItem[]
  netCashFromInvesting: number

  // Financing Activities
  financingActivities: ReportLineItem[]
  netCashFromFinancing: number

  // Net Change
  netChangeInCash: number
  beginningCashBalance: number
  endingCashBalance: number

  generatedAt: string
}

/**
 * Trial Balance entry
 */
export interface TrialBalanceEntry {
  accountCode: string
  accountName: string
  accountType: string
  debit: number
  credit: number
}

/**
 * Trial Balance report
 */
export interface TrialBalance {
  asOfDate: string
  entries: TrialBalanceEntry[]
  totalDebits: number
  totalCredits: number
  isBalanced: boolean
  generatedAt: string
}

/**
 * Financial report filters
 */
export interface FinancialReportFilters {
  reportType: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'trial-balance' | 'kpis'
  dateFrom?: string
  dateTo?: string
  asOfDate?: string
  compareWith?: 'previous-period' | 'previous-year' | 'none'
  department?: string
  branch?: string
}

/**
 * Financial KPIs for dashboard
 */
export interface FinancialKPIs {
  totalRevenueMTD: number
  totalRevenueYTD: number
  totalExpensesMTD: number
  totalExpensesYTD: number
  netProfitMTD: number
  netProfitYTD: number
  profitMargin: number
  cashBalance: number
  arOutstanding: number
  apOutstanding: number
  vatPayable: number
  currentRatio: number

  // Trends
  revenueTrend: Array<{ month: string; revenue: number; expenses: number }>
  expenseBreakdown: Array<{ category: string; amount: number; percentage: number }>
  cashFlowTrend: Array<{ month: string; inflow: number; outflow: number; net: number }>
  topCustomersByRevenue: Array<{ name: string; revenue: number }>
  topExpenseCategories: Array<{ category: string; amount: number }>
}

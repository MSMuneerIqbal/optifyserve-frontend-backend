/**
 * End of Service Benefits (EOSB/Gratuity) Type Definitions
 * Phase 10: HR Module
 *
 * UAE Labor Law Article 132 compliant calculations
 */

/** Termination reason */
export type TerminationReason = 'employer_termination' | 'resignation' | 'contract_expiry' | 'retirement' | 'death'

/** EOSB calculation result */
export interface EOSBCalculation {
  employeeId: string
  employeeName: string
  joinDate: string
  terminationDate: string
  contractType: 'limited' | 'unlimited'
  terminationReason: TerminationReason
  lastBasicSalary: number
  dailySalary: number

  // Service period
  totalYears: number
  totalMonths: number
  totalDays: number
  yearsDisplay: string

  // Calculation breakdown
  first5YearsDays: number
  first5YearsAmount: number
  after5YearsDays: number
  after5YearsAmount: number
  partialYearDays: number
  partialYearAmount: number
  totalGratuityDays: number
  grossGratuity: number

  // Adjustments
  gratuityMultiplier: number
  multiplierReason: string
  netGratuity: number

  // Leave encashment
  pendingLeaveBalance: number
  leaveEncashmentAmount: number

  // Total settlement
  totalSettlement: number
}

/** EOSB calculator form data */
export interface EOSBFormData {
  employeeId: string
  terminationDate: string
  terminationReason: TerminationReason
  pendingLeaveBalance?: number
}

/** EOSB history record */
export interface EOSBRecord {
  id: string
  employeeId: string
  employeeName: string
  calculationDate: string
  joinDate: string
  terminationDate: string
  contractType: 'limited' | 'unlimited'
  terminationReason: TerminationReason
  yearsOfService: number
  lastBasicSalary: number
  grossGratuity: number
  netGratuity: number
  leaveEncashment: number
  totalSettlement: number
  status: 'calculated' | 'approved' | 'paid'
  createdAt: string
}

/** Termination reason labels */
export const TERMINATION_REASON_KEYS: Record<TerminationReason, string> = {
  employer_termination: 'status.terminationByEmployer',
  resignation: 'status.resignationByEmployee',
  contract_expiry: 'status.contractExpiry',
  retirement: 'status.retirement',
  death: 'status.deathOfEmployee',
}

/** Gratuity multiplier rules for unlimited contracts (resignation) */
export const UNLIMITED_RESIGNATION_MULTIPLIERS = [
  { minYears: 0, maxYears: 1, multiplier: 0, key: 'status.noGratuityLessThan1Year' },
  { minYears: 1, maxYears: 3, multiplier: 1 / 3, key: 'status.oneThirdGratuity1to3Years' },
  { minYears: 3, maxYears: 5, multiplier: 2 / 3, key: 'status.twoThirdsGratuity3to5Years' },
  { minYears: 5, maxYears: Infinity, multiplier: 1, key: 'status.fullGratuity5PlusYears' },
] as const

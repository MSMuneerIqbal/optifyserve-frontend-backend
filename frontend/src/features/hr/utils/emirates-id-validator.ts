/**
 * Emirates ID Validator
 * Phase 10: HR Module
 *
 * Validates Emirates ID format: 784-YYYY-NNNNNNN-N
 */

/**
 * Validates Emirates ID format
 * Format: 784-YYYY-NNNNNNN-N (15 digits total)
 * - 784: UAE country code
 * - YYYY: Year of birth
 * - NNNNNNN: Unique number
 * - N: Check digit
 */
export function isValidEmiratesId(value: string): boolean {
  const cleaned = value.replace(/[-\s]/g, '')
  if (cleaned.length !== 15) return false
  if (!/^\d{15}$/.test(cleaned)) return false
  if (!cleaned.startsWith('784')) return false

  const year = parseInt(cleaned.substring(3, 7), 10)
  if (year < 1900 || year > new Date().getFullYear() + 1) return false

  return true
}

/**
 * Format Emirates ID as 784-YYYY-NNNNNNN-N
 */
export function formatEmiratesId(value: string): string {
  const cleaned = value.replace(/[-\s]/g, '')
  if (cleaned.length !== 15) return value

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 14)}-${cleaned.slice(14)}`
}

/**
 * Clean Emirates ID input (remove dashes/spaces)
 */
export function cleanEmiratesId(value: string): string {
  return value.replace(/[-\s]/g, '')
}

/**
 * Validate UAE IBAN format
 * Format: AE + 2 check digits + 3 bank code + 16 account number = 23 chars
 */
export function isValidUAEIBAN(value: string): boolean {
  const cleaned = value.replace(/\s/g, '').toUpperCase()
  if (cleaned.length !== 23) return false
  if (!cleaned.startsWith('AE')) return false
  if (!/^AE\d{21}$/.test(cleaned)) return false
  return true
}

/**
 * Format UAE IBAN with spaces
 */
export function formatIBAN(value: string): string {
  const cleaned = value.replace(/\s/g, '').toUpperCase()
  return cleaned.replace(/(.{4})/g, '$1 ').trim()
}

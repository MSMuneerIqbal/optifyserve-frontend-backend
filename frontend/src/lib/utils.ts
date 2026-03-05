import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency as AED
export function formatCurrency(amount: number, showSymbol = true): string {
  const formatted = new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return showSymbol ? `AED ${formatted}` : formatted
}

// Format compact currency (e.g., 1.5K, 2.3M)
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `AED ${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `AED ${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

// Format date as DD/MM/YYYY (UAE format)
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return '-'

  return format(dateObj, 'dd/MM/yyyy')
}

// Format date with time
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return '-'

  return format(dateObj, 'dd/MM/yyyy hh:mm a')
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return '-'

  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Format UAE phone number
export function formatPhone(phone: string): string {
  if (!phone) return '-'

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  // Handle different formats
  if (digits.startsWith('971')) {
    // +971 50 123 4567
    const areaCode = digits.slice(3, 5)
    const firstPart = digits.slice(5, 8)
    const secondPart = digits.slice(8)
    return `+971 ${areaCode} ${firstPart} ${secondPart}`
  }

  if (digits.startsWith('0')) {
    // 050 123 4567
    const areaCode = digits.slice(0, 3)
    const firstPart = digits.slice(3, 6)
    const secondPart = digits.slice(6)
    return `${areaCode} ${firstPart} ${secondPart}`
  }

  // Return as-is if format is unknown
  return phone
}

// Format TRN (Tax Registration Number) as XXX-XXXXXX-XXXXX
export function formatTRN(trn: string): string {
  if (!trn) return '-'

  // Remove all non-digits
  const digits = trn.replace(/\D/g, '')

  if (digits.length !== 15) return trn

  return `${digits.slice(0, 3)}-${digits.slice(3, 9)}-${digits.slice(9)}`
}

// Validate UAE phone number
export function isValidUAEPhone(phone: string): boolean {
  const pattern = /^(\+971|00971|0)?[0-9]{9}$/
  const digits = phone.replace(/\D/g, '')
  return pattern.test(digits) || pattern.test(phone)
}

// Validate TRN (Tax Registration Number)
export function isValidTRN(trn: string): boolean {
  const digits = trn.replace(/\D/g, '')
  return digits.length === 15 && /^\d{15}$/.test(digits)
}

// Generate initials from name
export function getInitials(name: string): string {
  if (!name) return ''

  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// Capitalize first letter
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Title case
export function titleCase(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Check if object is empty
export function isEmpty(obj: object | null | undefined): boolean {
  if (!obj) return true
  return Object.keys(obj).length === 0
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Generate WhatsApp share URL
export function generateWhatsAppUrl(text: string, phone?: string): string {
  const encoded = encodeURIComponent(text)
  if (phone) {
    const digits = phone.replace(/\D/g, '')
    return `https://wa.me/${digits}?text=${encoded}`
  }
  return `https://wa.me/?text=${encoded}`
}

// Generate mailto URL
export function generateMailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Format currency with code (for multi-currency support)
export function formatCurrencyWithCode(amount: number, currencyCode: string, showSymbol = true): string {
  const formatted = new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return showSymbol ? `${currencyCode} ${formatted}` : formatted
}

// Percentage formatter
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Calculate percentage change
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

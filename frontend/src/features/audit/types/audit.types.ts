/**
 * Audit Log Types
 * Extracted from settings.types.ts for standalone audit module
 */

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: string
  module: string
  description: string
  details?: Record<string, unknown>
  ipAddress: string
  timestamp: string
  changes?: { field: string; oldValue: string; newValue: string }[]
}

export interface AuditLogFilters {
  userId?: string
  module?: string
  action?: string
  dateFrom?: string
  dateTo?: string
}

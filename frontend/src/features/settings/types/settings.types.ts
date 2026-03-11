/**
 * Settings Module Types - Multi-Tenant Architecture
 * Phase 13: Settings & Configuration
 */

// ============================================
// RE-EXPORTS FROM EXTRACTED MODULES
// ============================================

import type { SubscriptionPlan as _SubscriptionPlan } from '@/features/admin/types'
export type { SubscriptionPlan, TenantStatus, Tenant, TenantFormData, SubscriptionPlanConfig, ModuleConfig } from '@/features/admin/types'
export { AVAILABLE_MODULES, SUBSCRIPTION_PLANS } from '@/features/admin/types'
export type { AuditLogEntry, AuditLogFilters } from '@/features/audit/types'

// Local alias for use within this file
type SubscriptionPlan = _SubscriptionPlan

// ============================================
// COMPANY PROFILE
// ============================================

export interface CompanyProfile {
  id: string
  name: string
  nameAr?: string
  logo?: string
  email: string
  phone: string
  website?: string
  taxRegistrationNumber: string
  commercialLicense?: string
  businessType: 'service' | 'trading' | 'manufacturing'
  businessHours?: string
  address: {
    street: string
    area: string
    city: string
    emirate: string
    poBox?: string
    country: string
  }
  bankDetails: {
    bankName: string
    accountName: string
    accountNumber: string
    iban: string
    swiftCode: string
  }
  settings: {
    defaultCurrency: string
    fiscalYearStart: string
    timezone: string
    dateFormat: string
    vatRate: number
    invoicePrefix: string
    quotationPrefix: string
    jobPrefix: string
    poPrefix: string
  }
  createdAt: string
  updatedAt: string
}

export interface CompanyProfileFormData {
  name: string
  nameAr?: string
  email: string
  phone: string
  website?: string
  taxRegistrationNumber: string
  commercialLicense?: string
  businessType: 'service' | 'trading' | 'manufacturing'
  address: CompanyProfile['address']
  bankDetails: CompanyProfile['bankDetails']
  settings: CompanyProfile['settings']
}

// ============================================
// BRANCH MANAGEMENT
// ============================================

export interface Branch {
  id: string
  code: string
  name: string
  address: {
    street: string
    city: string
    emirate: string
  }
  contactPerson: string
  phone: string
  email?: string
  gpsCoordinates?: { lat: number; lng: number }
  isDefault: boolean
  isActive: boolean
  employeeCount: number
  createdAt: string
}

export interface BranchFormData {
  code: string
  name: string
  address: Branch['address']
  contactPerson: string
  phone: string
  email?: string
  isDefault: boolean
}

// ============================================
// USER MANAGEMENT (re-exported from user-management module)
// ============================================

import type { UserRole as _UserRole } from '@/features/user-management/types'
export type { UserRole, UserStatus, SystemUser, UserFormData, UserInvitation, Role, Permission, PermissionGroup } from '@/features/user-management/types'
export { MODULE_PERMISSIONS } from '@/features/user-management/types'

// Local alias for use within this file
type UserRole = _UserRole

// ============================================
// SUBSCRIPTION & BILLING
// ============================================

export interface Subscription {
  planId: SubscriptionPlan
  planName: string
  status: 'active' | 'trial' | 'expired' | 'cancelled'
  nextBillingDate: string
  autoRenew: boolean
  enabledModules: string[]
  usage: {
    users: { used: number; limit: number }
    branches: { used: number; limit: number }
    storageMB: { used: number; limit: number }
  }
}

export interface BillingInvoice {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  paymentMethod?: string
}

// ============================================
// NOTIFICATION SETTINGS
// ============================================

export interface NotificationSettings {
  email: {
    enabled: boolean
    invoiceCreated: boolean
    paymentReceived: boolean
    jobAssigned: boolean
    jobCompleted: boolean
    lowStock: boolean
    leaveRequest: boolean
    dailySummary: boolean
  }
  whatsapp: {
    enabled: boolean
    jobAssignment: boolean
    jobReminder: boolean
    paymentReminder: boolean
    customerFollowUp: boolean
  }
  system: {
    enabled: boolean
    showDesktop: boolean
    playSound: boolean
  }
}

// ============================================
// INTEGRATION SETTINGS
// ============================================

export type IntegrationCategory = 'communication' | 'payment' | 'accounting' | 'maps' | 'storage'
export type IntegrationStatus = 'connected' | 'disconnected' | 'error'

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: IntegrationCategory
  status: IntegrationStatus
  config: Record<string, string>
  lastSyncAt?: string
}

// ============================================
// SECURITY SETTINGS
// ============================================

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
    expiryDays: number
    historyCount: number
  }
  loginPolicy: {
    maxAttempts: number
    lockoutMinutes: number
    sessionTimeoutMinutes: number
    maxConcurrentSessions: number
    forceLogoutOnPasswordChange: boolean
  }
  twoFactor: {
    enabled: boolean
    enforceForAdmins: boolean
    methods: ('authenticator' | 'sms')[]
  }
}

export interface ActiveSession {
  id: string
  device: string
  browser: string
  ipAddress: string
  location?: string
  loginAt: string
  lastActiveAt: string
  isCurrent: boolean
}

// ============================================
// DATA MANAGEMENT
// ============================================

export interface BackupSettings {
  autoBackup: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  retentionDays: number
  lastBackupAt?: string
  lastBackupSize?: string
}

export interface ExportRequest {
  modules: string[]
  format: 'xlsx' | 'csv' | 'json'
  dateFrom?: string
  dateTo?: string
  includeAttachments: boolean
}

// ============================================
// PERSONAL SETTINGS
// ============================================

export interface PersonalProfile {
  name: string
  email: string
  phone: string
  avatar?: string
  department?: string
  designation?: string
  branch?: string
  employeeId?: string
  joinDate?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface SystemPreferences {
  language: 'en' | 'ar'
  theme: 'light' | 'dark' | 'system'
  compactMode: boolean
  sidebarCollapsed: boolean
  defaultPageSize: 25 | 50 | 100
}

// ============================================
// TAX CONFIGURATION
// ============================================

export interface TaxConfiguration {
  vatRate: number
  vatRegistered: boolean
  trn: string
  filingFrequency: 'monthly' | 'quarterly'
  nextFilingDate: string
  autoCalculateVAT: boolean
}

// ============================================
// SETTINGS NAVIGATION
// ============================================

export type SettingsCategory =
  | 'personal-profile'
  | 'personal-password'
  | 'personal-notifications'
  | 'personal-preferences'
  | 'company-profile'
  | 'company-branches'
  | 'company-departments'
  | 'company-customization'
  | 'subscription-plan'
  | 'subscription-billing'
  | 'integrations-whatsapp'
  | 'integrations-email'
  | 'integrations-maps'
  | 'integrations-payment'
  | 'integrations-api'
  | 'security-password'
  | 'security-2fa'
  | 'security-sessions'
  | 'notifications-channels'
  | 'notifications-templates'
  | 'data-export'
  | 'data-import'
  | 'data-backup'
  | 'tax-configuration'
  | 'appearance-theme'

export interface SettingsNavItem {
  id: SettingsCategory
  label: string
  icon: string
  requiredRole?: UserRole[]
  adminOnly?: boolean
  superAdminOnly?: boolean
}

export interface SettingsNavGroup {
  label: string
  icon: string
  items: SettingsNavItem[]
  requiredRole?: UserRole[]
  adminOnly?: boolean
  superAdminOnly?: boolean
}


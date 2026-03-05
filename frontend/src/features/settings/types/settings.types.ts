/**
 * Settings Module Types - Multi-Tenant Architecture
 * Phase 13: Settings & Configuration
 */

// ============================================
// TENANT / COMPANY TYPES
// ============================================

export type SubscriptionPlan = 'basic' | 'standard' | 'premium' | 'enterprise'
export type TenantStatus = 'active' | 'trial' | 'suspended' | 'cancelled'

export interface Tenant {
  id: string
  companyName: string
  companyNameAr?: string
  trn: string
  ownerName: string
  ownerEmail: string
  plan: SubscriptionPlan
  status: TenantStatus
  enabledModules: string[]
  userCount: number
  branchCount: number
  storageUsedMB: number
  monthlyRevenue: number
  trialEndsAt?: string
  createdAt: string
  lastLoginAt?: string
}

export interface TenantFormData {
  companyName: string
  trn: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  plan: SubscriptionPlan
  enabledModules: string[]
  trialDays: number
}

export interface SubscriptionPlanConfig {
  id: SubscriptionPlan
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  maxUsers: number
  maxBranches: number
  storageLimitMB: number
  includedModules: string[]
  features: string[]
}

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
// USER MANAGEMENT
// ============================================

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'technician'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'invited'

export interface SystemUser {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  department?: string
  branch?: string
  status: UserStatus
  avatar?: string
  lastLoginAt?: string
  createdAt: string
  permissions: string[]
}

export interface UserFormData {
  name: string
  email: string
  phone: string
  role: UserRole
  department?: string
  branch?: string
  permissions: string[]
  sendInvite: boolean
}

export interface UserInvitation {
  id: string
  email: string
  role: UserRole
  status: 'pending' | 'accepted' | 'expired'
  invitedBy: string
  createdAt: string
  expiresAt: string
}

// ============================================
// ROLES & PERMISSIONS
// ============================================

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
  createdAt: string
}

export interface Permission {
  id: string
  module: string
  action: string
  label: string
  description: string
}

export interface PermissionGroup {
  module: string
  label: string
  permissions: Permission[]
}

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
// AUDIT LOG
// ============================================

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
  | 'users-list'
  | 'users-roles'
  | 'users-invitations'
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
  | 'audit-logs'
  | 'super-admin-tenants'
  | 'super-admin-plans'
  | 'super-admin-modules'
  | 'super-admin-analytics'
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

// ============================================
// MODULE ACCESS CONTROL
// ============================================

export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: string
  plan: SubscriptionPlan
  isAddon: boolean
  monthlyPrice?: number
}

export const AVAILABLE_MODULES: ModuleConfig[] = [
  { id: 'crm', name: 'CRM', description: 'Customers & Leads', icon: 'Users', plan: 'basic', isAddon: false },
  { id: 'sales', name: 'Sales', description: 'Quotations & Invoices', icon: 'FileText', plan: 'basic', isAddon: false },
  { id: 'inventory', name: 'Inventory', description: 'Stock Management', icon: 'Package', plan: 'standard', isAddon: false },
  { id: 'purchase', name: 'Purchase', description: 'Vendors & POs', icon: 'ShoppingCart', plan: 'standard', isAddon: false },
  { id: 'accounts', name: 'Accounts', description: 'Finance & VAT', icon: 'DollarSign', plan: 'standard', isAddon: false },
  { id: 'hr', name: 'HR & Payroll', description: 'Employees & Payroll', icon: 'UserCircle', plan: 'premium', isAddon: false },
  { id: 'jobs', name: 'Jobs & Service', description: 'Service Management', icon: 'Briefcase', plan: 'premium', isAddon: false },
  { id: 'dispatcher', name: 'Dispatcher', description: 'Field Operations', icon: 'Radio', plan: 'premium', isAddon: false },
  { id: 'reports', name: 'Advanced Reports', description: 'Custom Analytics', icon: 'BarChart3', plan: 'enterprise', isAddon: true, monthlyPrice: 99 },
  { id: 'api', name: 'API Access', description: 'REST API Integration', icon: 'Code', plan: 'enterprise', isAddon: true, monthlyPrice: 149 },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business', icon: 'MessageCircle', plan: 'standard', isAddon: true, monthlyPrice: 49 },
]

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export const MODULE_PERMISSIONS: PermissionGroup[] = [
  {
    module: 'dashboard',
    label: 'Dashboard',
    permissions: [
      { id: 'dashboard.view', module: 'dashboard', action: 'view', label: 'View Dashboard', description: 'Access the main dashboard' },
    ],
  },
  {
    module: 'crm',
    label: 'CRM',
    permissions: [
      { id: 'crm.view', module: 'crm', action: 'view', label: 'View CRM', description: 'View customers and leads' },
      { id: 'crm.create', module: 'crm', action: 'create', label: 'Create Records', description: 'Create customers and leads' },
      { id: 'crm.edit', module: 'crm', action: 'edit', label: 'Edit Records', description: 'Edit customers and leads' },
      { id: 'crm.delete', module: 'crm', action: 'delete', label: 'Delete Records', description: 'Delete customers and leads' },
    ],
  },
  {
    module: 'sales',
    label: 'Sales',
    permissions: [
      { id: 'sales.view', module: 'sales', action: 'view', label: 'View Sales', description: 'View quotations and invoices' },
      { id: 'sales.create', module: 'sales', action: 'create', label: 'Create Sales', description: 'Create quotations and invoices' },
      { id: 'sales.edit', module: 'sales', action: 'edit', label: 'Edit Sales', description: 'Edit quotations and invoices' },
      { id: 'sales.delete', module: 'sales', action: 'delete', label: 'Delete Sales', description: 'Delete quotations and invoices' },
      { id: 'sales.approve', module: 'sales', action: 'approve', label: 'Approve Sales', description: 'Approve quotations and invoices' },
    ],
  },
  {
    module: 'inventory',
    label: 'Inventory',
    permissions: [
      { id: 'inventory.view', module: 'inventory', action: 'view', label: 'View Inventory', description: 'View items and stock' },
      { id: 'inventory.create', module: 'inventory', action: 'create', label: 'Create Items', description: 'Create inventory items' },
      { id: 'inventory.edit', module: 'inventory', action: 'edit', label: 'Edit Items', description: 'Edit inventory items' },
      { id: 'inventory.adjust', module: 'inventory', action: 'adjust', label: 'Adjust Stock', description: 'Make stock adjustments' },
    ],
  },
  {
    module: 'purchase',
    label: 'Purchase',
    permissions: [
      { id: 'purchase.view', module: 'purchase', action: 'view', label: 'View Purchase', description: 'View purchase orders' },
      { id: 'purchase.create', module: 'purchase', action: 'create', label: 'Create PO', description: 'Create purchase orders' },
      { id: 'purchase.approve', module: 'purchase', action: 'approve', label: 'Approve PO', description: 'Approve purchase orders' },
    ],
  },
  {
    module: 'accounts',
    label: 'Accounts',
    permissions: [
      { id: 'accounts.view', module: 'accounts', action: 'view', label: 'View Accounts', description: 'View financial data' },
      { id: 'accounts.create', module: 'accounts', action: 'create', label: 'Create Entries', description: 'Create journal entries' },
      { id: 'accounts.approve', module: 'accounts', action: 'approve', label: 'Approve', description: 'Approve entries' },
      { id: 'accounts.vat', module: 'accounts', action: 'vat', label: 'VAT Management', description: 'File VAT returns' },
    ],
  },
  {
    module: 'hr',
    label: 'HR',
    permissions: [
      { id: 'hr.view', module: 'hr', action: 'view', label: 'View HR', description: 'View HR data' },
      { id: 'hr.manage', module: 'hr', action: 'manage', label: 'Manage HR', description: 'Manage employees' },
      { id: 'hr.payroll', module: 'hr', action: 'payroll', label: 'Process Payroll', description: 'Process payroll' },
      { id: 'hr.leave', module: 'hr', action: 'leave', label: 'Manage Leave', description: 'Approve/reject leave' },
    ],
  },
  {
    module: 'jobs',
    label: 'Jobs',
    permissions: [
      { id: 'jobs.view', module: 'jobs', action: 'view', label: 'View Jobs', description: 'View jobs' },
      { id: 'jobs.create', module: 'jobs', action: 'create', label: 'Create Jobs', description: 'Create and assign jobs' },
      { id: 'jobs.dispatch', module: 'jobs', action: 'dispatch', label: 'Dispatch', description: 'Access dispatcher console' },
    ],
  },
  {
    module: 'settings',
    label: 'Settings',
    permissions: [
      { id: 'settings.view', module: 'settings', action: 'view', label: 'View Settings', description: 'View system settings' },
      { id: 'settings.manage', module: 'settings', action: 'manage', label: 'Manage Settings', description: 'Change settings' },
      { id: 'settings.users', module: 'settings', action: 'users', label: 'Manage Users', description: 'Add/remove users' },
      { id: 'settings.roles', module: 'settings', action: 'roles', label: 'Manage Roles', description: 'Configure roles' },
    ],
  },
]

// ============================================
// SUBSCRIPTION PLANS CONFIG
// ============================================

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential tools for small teams',
    priceMonthly: 199,
    priceYearly: 1990,
    maxUsers: 5,
    maxBranches: 1,
    storageLimitMB: 5120,
    includedModules: ['crm', 'sales'],
    features: ['Customer Management', 'Quotations & Invoices', 'Email Support', '5 Users'],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Complete operations management',
    priceMonthly: 499,
    priceYearly: 4990,
    maxUsers: 15,
    maxBranches: 3,
    storageLimitMB: 20480,
    includedModules: ['crm', 'sales', 'inventory', 'purchase', 'accounts'],
    features: ['Everything in Basic', 'Inventory & Purchase', 'Accounts & VAT', 'Multi-Branch (3)', '15 Users', 'Priority Support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Full enterprise solution',
    priceMonthly: 999,
    priceYearly: 9990,
    maxUsers: 50,
    maxBranches: 10,
    storageLimitMB: 102400,
    includedModules: ['crm', 'sales', 'inventory', 'purchase', 'accounts', 'hr', 'jobs', 'dispatcher'],
    features: ['Everything in Standard', 'HR & Payroll', 'Jobs & Dispatcher', 'GPS Tracking', '50 Users', '10 Branches', 'Dedicated Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solution for large organizations',
    priceMonthly: 0,
    priceYearly: 0,
    maxUsers: 999,
    maxBranches: 999,
    storageLimitMB: 512000,
    includedModules: ['crm', 'sales', 'inventory', 'purchase', 'accounts', 'hr', 'jobs', 'dispatcher', 'reports', 'api'],
    features: ['Everything in Premium', 'Advanced Reports', 'API Access', 'Unlimited Users', 'Unlimited Branches', 'Custom Integrations', '24/7 Support', 'SLA Guarantee'],
  },
]

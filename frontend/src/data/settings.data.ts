/**
 * Settings Sample Data
 * Extracted from settings mock API for standalone usage.
 * All data is UAE-specific with AED currency, TRN, trade licenses, and +971 phones.
 */

import type {
  CompanyProfile,
  Branch,
  SystemUser,
  Role,
  NotificationSettings,
  Integration,
  SystemPreferences,
  TaxConfiguration,
  BackupSettings,
  SecuritySettings,
  ActiveSession,
  PermissionGroup,
} from '@/features/settings/types'

// ============================================
// COMPANY PROFILE
// ============================================

export const sampleCompanyProfile: CompanyProfile = {
  id: 'comp-001',
  name: 'OptifyServe Technical Services LLC',
  nameAr: 'أوبتيفاي سيرف للخدمات التقنية ذ.م.م',
  logo: '/images/optifyserve-logo.png',
  email: 'info@optifyserve.com',
  phone: '+971 4 234 5678',
  website: 'https://www.optifyserve.com',
  taxRegistrationNumber: '100234567890003',
  commercialLicense: 'DED-2024-678901',
  businessType: 'service',
  address: {
    street: 'Office 1204, Latifa Tower',
    area: 'Sheikh Zayed Road',
    city: 'Dubai',
    emirate: 'Dubai',
    poBox: '45612',
    country: 'UAE',
  },
  bankDetails: {
    bankName: 'Emirates NBD',
    accountName: 'OptifyServe Technical Services LLC',
    accountNumber: '1012345678901',
    iban: 'AE070331234567890123456',
    swiftCode: 'EABORUMRXXX',
  },
  settings: {
    defaultCurrency: 'AED',
    fiscalYearStart: '01-01',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    vatRate: 5,
    invoicePrefix: 'INV',
    quotationPrefix: 'QTN',
    jobPrefix: 'JOB',
    poPrefix: 'PO',
  },
  createdAt: '2024-06-15T08:00:00Z',
  updatedAt: '2026-02-10T14:30:00Z',
}

// ============================================
// BRANCHES
// ============================================

export const sampleBranches: Branch[] = [
  {
    id: 'branch-001',
    code: 'DXB-HQ',
    name: 'Dubai Head Office',
    email: 'dubai@optifyserve.com',
    phone: '+971 4 234 5678',
    isDefault: true,
    isActive: true,
    employeeCount: 12,
    contactPerson: 'Fatima Al Zaabi',
    address: {
      street: 'Office 1204, Latifa Tower, Sheikh Zayed Road',
      city: 'Dubai',
      emirate: 'Dubai',
    },
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'branch-002',
    code: 'AUH-01',
    name: 'Abu Dhabi Branch',
    email: 'abudhabi@optifyserve.com',
    phone: '+971 2 678 9012',
    isDefault: false,
    isActive: true,
    employeeCount: 7,
    contactPerson: 'Noura Bin Rashid',
    address: {
      street: 'Unit 305, Al Reem Tower, Al Reem Island',
      city: 'Abu Dhabi',
      emirate: 'Abu Dhabi',
    },
    createdAt: '2025-02-01T09:00:00Z',
  },
  {
    id: 'branch-003',
    code: 'SHJ-01',
    name: 'Sharjah Branch',
    email: 'sharjah@optifyserve.com',
    phone: '+971 6 543 2100',
    isDefault: false,
    isActive: true,
    employeeCount: 4,
    contactPerson: 'Omar Saeed',
    address: {
      street: 'Shop 8, Al Majaz Business Centre, Al Majaz',
      city: 'Sharjah',
      emirate: 'Sharjah',
    },
    createdAt: '2025-08-15T10:00:00Z',
  },
]

// ============================================
// SYSTEM USERS
// ============================================

export const sampleUsers: SystemUser[] = [
  {
    id: 'user-001',
    name: 'Muneer Al Hammadi',
    email: 'muneer@optifyserve.com',
    phone: '+971 50 123 4567',
    role: 'admin',
    department: 'Management',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-20T08:15:00Z',
    createdAt: '2024-06-15T08:00:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit', 'crm.delete',
      'sales.view', 'sales.create', 'sales.edit', 'sales.delete', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'accounts.create', 'accounts.approve', 'accounts.vat',
      'hr.view', 'hr.manage', 'hr.payroll', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
      'settings.view', 'settings.manage', 'settings.users', 'settings.roles',
    ],
  },
  {
    id: 'user-002',
    name: 'Fatima Al Zaabi',
    email: 'fatima@optifyserve.com',
    phone: '+971 55 234 5678',
    role: 'admin',
    department: 'Operations',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-20T07:45:00Z',
    createdAt: '2024-07-01T09:00:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit', 'crm.delete',
      'sales.view', 'sales.create', 'sales.edit', 'sales.delete', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'accounts.create', 'accounts.approve', 'accounts.vat',
      'hr.view', 'hr.manage', 'hr.payroll', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
      'settings.view', 'settings.manage', 'settings.users', 'settings.roles',
    ],
  },
  {
    id: 'user-003',
    name: 'Ahmed Khalifa',
    email: 'ahmed.k@optifyserve.com',
    phone: '+971 56 345 6789',
    role: 'manager',
    department: 'Sales',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-19T16:30:00Z',
    createdAt: '2024-09-10T08:00:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'hr.view', 'hr.manage', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
    ],
  },
  {
    id: 'user-004',
    name: 'Noura Bin Rashid',
    email: 'noura@optifyserve.com',
    phone: '+971 52 456 7890',
    role: 'manager',
    department: 'Operations',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-20T09:00:00Z',
    createdAt: '2025-01-05T10:00:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'hr.view', 'hr.manage', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
    ],
  },
  {
    id: 'user-005',
    name: 'Omar Saeed',
    email: 'omar.s@optifyserve.com',
    phone: '+971 54 567 8901',
    role: 'staff',
    department: 'Accounts',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-19T17:00:00Z',
    createdAt: '2025-03-20T08:30:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit',
      'inventory.view', 'purchase.view',
      'jobs.view', 'jobs.create',
    ],
  },
  {
    id: 'user-006',
    name: 'Layla Hassan',
    email: 'layla@optifyserve.com',
    phone: '+971 58 678 9012',
    role: 'staff',
    department: 'CRM',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-18T14:20:00Z',
    createdAt: '2025-05-10T09:00:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit',
      'inventory.view', 'purchase.view',
      'jobs.view', 'jobs.create',
    ],
  },
  {
    id: 'user-007',
    name: 'Yousef Al Mansoori',
    email: 'yousef@optifyserve.com',
    phone: '+971 50 789 0123',
    role: 'staff',
    department: 'Inventory',
    status: 'inactive',
    avatar: undefined,
    lastLoginAt: '2026-01-05T11:00:00Z',
    createdAt: '2025-06-01T08:00:00Z',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit',
      'inventory.view', 'purchase.view',
      'jobs.view', 'jobs.create',
    ],
  },
  {
    id: 'user-008',
    name: 'Rashed Al Nuaimi',
    email: 'rashed@optifyserve.com',
    phone: '+971 55 890 1234',
    role: 'technician',
    department: 'Field Operations',
    status: 'active',
    avatar: undefined,
    lastLoginAt: '2026-02-20T06:30:00Z',
    createdAt: '2025-07-15T07:00:00Z',
    permissions: [
      'dashboard.view', 'jobs.view',
    ],
  },
]

// ============================================
// ROLES & PERMISSIONS
// ============================================

export const sampleRoles: Role[] = [
  {
    id: 'role-001',
    name: 'Super Admin',
    description: 'Full system access with tenant management and configuration capabilities',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit', 'crm.delete',
      'sales.view', 'sales.create', 'sales.edit', 'sales.delete', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'accounts.create', 'accounts.approve', 'accounts.vat',
      'hr.view', 'hr.manage', 'hr.payroll', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
      'settings.view', 'settings.manage', 'settings.users', 'settings.roles',
    ],
    userCount: 1,
    isSystem: true,
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'role-002',
    name: 'Administrator',
    description: 'Full system access across all modules',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit', 'crm.delete',
      'sales.view', 'sales.create', 'sales.edit', 'sales.delete', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'accounts.create', 'accounts.approve', 'accounts.vat',
      'hr.view', 'hr.manage', 'hr.payroll', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
      'settings.view', 'settings.manage', 'settings.users', 'settings.roles',
    ],
    userCount: 1,
    isSystem: true,
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'role-003',
    name: 'Manager',
    description: 'Department management with approval rights',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit', 'sales.approve',
      'inventory.view', 'inventory.create', 'inventory.edit',
      'purchase.view', 'purchase.create', 'purchase.approve',
      'accounts.view', 'hr.view', 'hr.manage', 'hr.leave',
      'jobs.view', 'jobs.create', 'jobs.dispatch',
    ],
    userCount: 2,
    isSystem: true,
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'role-004',
    name: 'Staff',
    description: 'Standard staff access for daily operations',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.create', 'crm.edit',
      'sales.view', 'sales.create', 'sales.edit',
      'inventory.view', 'purchase.view',
      'jobs.view', 'jobs.create',
    ],
    userCount: 3,
    isSystem: true,
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'role-005',
    name: 'Technician',
    description: 'Field technician with job-only access for mobile and on-site work',
    permissions: [
      'dashboard.view', 'jobs.view',
    ],
    userCount: 1,
    isSystem: false,
    createdAt: '2025-01-10T08:00:00Z',
  },
]

/**
 * Module-level permission definitions used for role configuration UI
 */
export const sampleModulePermissions: PermissionGroup[] = [
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
// NOTIFICATION SETTINGS
// ============================================

export const sampleNotificationSettings: NotificationSettings = {
  email: {
    enabled: true,
    invoiceCreated: true,
    paymentReceived: true,
    jobAssigned: true,
    jobCompleted: true,
    lowStock: true,
    leaveRequest: true,
    dailySummary: false,
  },
  whatsapp: {
    enabled: true,
    jobAssignment: true,
    jobReminder: true,
    paymentReminder: false,
    customerFollowUp: true,
  },
  system: {
    enabled: true,
    showDesktop: true,
    playSound: false,
  },
}

// ============================================
// INTEGRATIONS
// ============================================

export const sampleIntegrations: Integration[] = [
  {
    id: 'int-001',
    name: 'WhatsApp Business',
    description: 'Send job updates, invoices, and reminders via WhatsApp',
    icon: 'MessageCircle',
    category: 'communication',
    status: 'connected',
    config: {
      phoneNumberId: '1234567890',
      businessAccountId: 'WABA-OPT-001',
      apiVersion: 'v18.0',
    },
    lastSyncAt: '2026-02-20T07:00:00Z',
  },
  {
    id: 'int-002',
    name: 'Google Maps',
    description: 'Geocoding, directions, and dispatcher map services',
    icon: 'MapPin',
    category: 'maps',
    status: 'connected',
    config: {
      apiKey: '************XXXX',
      enabledAPIs: 'Maps JavaScript, Geocoding, Directions, Distance Matrix',
    },
    lastSyncAt: '2026-02-20T09:15:00Z',
  },
  {
    id: 'int-003',
    name: 'Stripe',
    description: 'Online payment processing for customer invoices',
    icon: 'CreditCard',
    category: 'payment',
    status: 'disconnected',
    config: {},
  },
  {
    id: 'int-004',
    name: 'QuickBooks Online',
    description: 'Sync financial data and chart of accounts with QuickBooks',
    icon: 'BookOpen',
    category: 'accounting',
    status: 'disconnected',
    config: {},
  },
  {
    id: 'int-005',
    name: 'AWS S3',
    description: 'Cloud storage for documents, images, and automated backups',
    icon: 'Cloud',
    category: 'storage',
    status: 'connected',
    config: {
      bucket: 'optifyserve-prod-documents',
      region: 'me-south-1',
    },
    lastSyncAt: '2026-02-20T03:00:00Z',
  },
  {
    id: 'int-006',
    name: 'Twilio',
    description: 'SMS notifications and voice call reminders for customers and staff',
    icon: 'Phone',
    category: 'communication',
    status: 'error',
    config: {
      accountSid: 'AC********************',
      fromNumber: '+971 4 234 0000',
      errorMessage: 'Authentication failed. Please update your API credentials.',
    },
    lastSyncAt: '2026-02-18T22:45:00Z',
  },
]

// ============================================
// SECURITY SETTINGS
// ============================================

export const sampleSecuritySettings: SecuritySettings = {
  passwordPolicy: {
    minLength: 10,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    expiryDays: 90,
    historyCount: 5,
  },
  loginPolicy: {
    maxAttempts: 5,
    lockoutMinutes: 15,
    sessionTimeoutMinutes: 30,
    maxConcurrentSessions: 3,
    forceLogoutOnPasswordChange: true,
  },
  twoFactor: {
    enabled: true,
    enforceForAdmins: true,
    methods: ['authenticator', 'sms'],
  },
}

// ============================================
// ACTIVE SESSIONS
// ============================================

export const sampleActiveSessions: ActiveSession[] = [
  {
    id: 'sess-001',
    device: 'Windows 11 - Desktop',
    browser: 'Chrome 121.0',
    ipAddress: '86.96.228.45',
    location: 'Dubai, UAE',
    lastActiveAt: '2026-02-20T09:30:00Z',
    isCurrent: true,
    loginAt: '2026-02-20T08:15:00Z',
  },
  {
    id: 'sess-002',
    device: 'iPhone 15 Pro - iOS 18',
    browser: 'Safari Mobile',
    ipAddress: '86.96.228.50',
    location: 'Dubai, UAE',
    lastActiveAt: '2026-02-20T07:45:00Z',
    isCurrent: false,
    loginAt: '2026-02-19T20:00:00Z',
  },
  {
    id: 'sess-003',
    device: 'macOS Sonoma - MacBook Pro',
    browser: 'Firefox 124.0',
    ipAddress: '94.200.77.12',
    location: 'Abu Dhabi, UAE',
    lastActiveAt: '2026-02-20T09:10:00Z',
    isCurrent: false,
    loginAt: '2026-02-20T07:30:00Z',
  },
]

// ============================================
// SYSTEM PREFERENCES
// ============================================

export const sampleSystemPreferences: SystemPreferences = {
  language: 'en',
  theme: 'light',
  compactMode: false,
  sidebarCollapsed: false,
  defaultPageSize: 25,
}

// ============================================
// TAX CONFIGURATION (UAE VAT)
// ============================================

export const sampleTaxConfiguration: TaxConfiguration = {
  vatRate: 5,
  vatRegistered: true,
  trn: '100234567890003',
  filingFrequency: 'quarterly',
  nextFilingDate: '2026-04-28',
  autoCalculateVAT: true,
}

// ============================================
// BACKUP SETTINGS
// ============================================

export const sampleBackupSettings: BackupSettings = {
  autoBackup: true,
  frequency: 'daily',
  retentionDays: 30,
  lastBackupAt: '2026-02-20T03:00:00Z',
  lastBackupSize: '2.4 GB',
}

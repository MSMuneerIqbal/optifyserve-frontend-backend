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
  AuditLogEntry,
  SystemPreferences,
  TaxConfiguration,
  BackupSettings,
  Tenant,
  SecuritySettings,
  ActiveSession,
  PermissionGroup,
} from '@/features/settings/types'

// ============================================
// TENANTS (Multi-Tenant SaaS)
// ============================================

export const sampleTenants: Tenant[] = [
  {
    id: 'tenant-001',
    companyName: 'OptiFy Technical Services LLC',
    companyNameAr: '\u0623\u0648\u0628\u062a\u064a\u0641\u0627\u064a \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u062a\u0642\u0646\u064a\u0629 \u0630.\u0645.\u0645',
    trn: '100234567890003',
    ownerName: 'Muneer Al Hammadi',
    ownerEmail: 'info@optifyservices.ae',
    plan: 'premium',
    status: 'active',
    enabledModules: ['CRM', 'Sales', 'Inventory', 'Purchase', 'Accounts', 'HR', 'Projects', 'Dispatcher'],
    userCount: 23,
    branchCount: 3,
    storageUsedMB: 35520,
    monthlyRevenue: 2499,
    createdAt: '2024-06-15T08:00:00Z',
    lastLoginAt: '2026-02-20T08:15:00Z',
  },
  {
    id: 'tenant-002',
    companyName: 'Gulf Star Maintenance Co.',
    companyNameAr: '\u0646\u062c\u0645\u0629 \u0627\u0644\u062e\u0644\u064a\u062c \u0644\u0644\u0635\u064a\u0627\u0646\u0629',
    trn: '100345678901234',
    ownerName: 'Abdullah Al Rashid',
    ownerEmail: 'admin@gulfstarmaint.ae',
    plan: 'standard',
    status: 'active',
    enabledModules: ['CRM', 'Sales', 'Inventory', 'Purchase', 'Accounts'],
    userCount: 14,
    branchCount: 2,
    storageUsedMB: 18432,
    monthlyRevenue: 499,
    createdAt: '2025-02-20T10:30:00Z',
    lastLoginAt: '2026-02-19T16:30:00Z',
  },
  {
    id: 'tenant-003',
    companyName: 'Al Noor Building Services',
    companyNameAr: '\u0627\u0644\u0646\u0648\u0631 \u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0628\u0627\u0646\u064a',
    trn: '100456789012345',
    ownerName: 'Khalid Al Noor',
    ownerEmail: 'support@alnoorbldg.ae',
    plan: 'basic',
    status: 'trial',
    enabledModules: ['CRM', 'Sales'],
    userCount: 4,
    branchCount: 1,
    storageUsedMB: 2048,
    monthlyRevenue: 0,
    trialEndsAt: '2026-02-14T23:59:59Z',
    createdAt: '2026-01-15T14:00:00Z',
    lastLoginAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'tenant-004',
    companyName: 'Emirates Facility Management',
    companyNameAr: '\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a \u0644\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0631\u0627\u0641\u0642',
    trn: '100567890123456',
    ownerName: 'Mariam Al Suwaidi',
    ownerEmail: 'ops@emiratesfm.ae',
    plan: 'premium',
    status: 'suspended',
    enabledModules: ['CRM', 'Sales', 'Inventory', 'Purchase', 'Accounts', 'HR', 'Projects', 'Dispatcher'],
    userCount: 31,
    branchCount: 5,
    storageUsedMB: 51200,
    monthlyRevenue: 0,
    createdAt: '2024-11-01T09:00:00Z',
    lastLoginAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'tenant-005',
    companyName: 'Sahara Cool HVAC Solutions',
    companyNameAr: '\u0635\u062d\u0627\u0631\u0649 \u0643\u0648\u0644 \u0644\u062d\u0644\u0648\u0644 \u0627\u0644\u062a\u0643\u064a\u064a\u0641',
    trn: '100678901234567',
    ownerName: 'Hassan Al Maktoum',
    ownerEmail: 'info@saharacool.ae',
    plan: 'standard',
    status: 'cancelled',
    enabledModules: ['CRM', 'Sales', 'Inventory'],
    userCount: 0,
    branchCount: 1,
    storageUsedMB: 5120,
    monthlyRevenue: 0,
    createdAt: '2025-03-20T07:45:00Z',
  },
]

// ============================================
// COMPANY PROFILE
// ============================================

export const sampleCompanyProfile: CompanyProfile = {
  id: 'comp-001',
  name: 'OptiFy Technical Services LLC',
  nameAr: '\u0623\u0648\u0628\u062a\u064a\u0641\u0627\u064a \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u062a\u0642\u0646\u064a\u0629 \u0630.\u0645.\u0645',
  logo: '/images/optify-logo.png',
  email: 'info@optifyservices.ae',
  phone: '+971 4 234 5678',
  website: 'https://www.optifyservices.ae',
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
    accountName: 'OptiFy Technical Services LLC',
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
    email: 'dubai@optifyservices.ae',
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
    email: 'abudhabi@optifyservices.ae',
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
    email: 'sharjah@optifyservices.ae',
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
    email: 'muneer@optifyservices.ae',
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
    email: 'fatima@optifyservices.ae',
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
    email: 'ahmed.k@optifyservices.ae',
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
    email: 'noura@optifyservices.ae',
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
    email: 'omar.s@optifyservices.ae',
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
    email: 'layla@optifyservices.ae',
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
    email: 'yousef@optifyservices.ae',
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
    email: 'rashed@optifyservices.ae',
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
      bucket: 'optify-prod-documents',
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
// AUDIT LOG
// ============================================

export const sampleAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-001',
    userId: 'user-001',
    userName: 'Muneer Al Hammadi',
    action: 'login',
    module: 'auth',
    description: 'User logged in successfully',
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-20T08:15:00Z',
  },
  {
    id: 'audit-002',
    userId: 'user-002',
    userName: 'Fatima Al Zaabi',
    action: 'create',
    module: 'sales',
    description: 'Created invoice INV-2026-0342 for AED 18,750.00',
    details: { invoiceId: 'inv-342', amount: 18750, customer: 'Al Futtaim Group' },
    ipAddress: '94.200.77.12',
    timestamp: '2026-02-20T07:50:00Z',
  },
  {
    id: 'audit-003',
    userId: 'user-003',
    userName: 'Ahmed Khalifa',
    action: 'update',
    module: 'crm',
    description: 'Updated customer record: Dubai Properties Group - changed status to Active',
    details: { customerId: 'cust-015', field: 'status', oldValue: 'inactive', newValue: 'active' },
    ipAddress: '185.170.214.88',
    timestamp: '2026-02-20T07:30:00Z',
  },
  {
    id: 'audit-004',
    userId: 'user-004',
    userName: 'Noura Bin Rashid',
    action: 'dispatch',
    module: 'jobs',
    description: 'Assigned job JOB-2026-0189 to technician Rashed Al Nuaimi',
    details: { jobId: 'job-189', technicianId: 'user-008' },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-20T07:15:00Z',
  },
  {
    id: 'audit-005',
    userId: 'user-005',
    userName: 'Omar Saeed',
    action: 'create',
    module: 'accounts',
    description: 'Recorded payment of AED 12,500.00 from Emaar Properties',
    details: { paymentId: 'pay-098', amount: 12500 },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-19T16:45:00Z',
  },
  {
    id: 'audit-006',
    userId: 'user-001',
    userName: 'Muneer Al Hammadi',
    action: 'approve',
    module: 'purchase',
    description: 'Approved purchase order PO-2026-0067 for AED 8,340.00',
    details: { poId: 'po-067', vendor: 'Gulf Industrial Supplies', amount: 8340 },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-19T15:20:00Z',
  },
  {
    id: 'audit-007',
    userId: 'user-006',
    userName: 'Layla Hassan',
    action: 'create',
    module: 'crm',
    description: 'Created new lead: Aldar Properties - estimated value AED 45,000',
    details: { leadId: 'lead-034', estimatedValue: 45000 },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-19T14:00:00Z',
  },
  {
    id: 'audit-008',
    userId: 'user-008',
    userName: 'Rashed Al Nuaimi',
    action: 'update',
    module: 'jobs',
    description: 'Completed job JOB-2026-0185 - AC maintenance at Dubai Marina',
    details: { jobId: 'job-185', status: 'completed' },
    ipAddress: '92.99.34.201',
    timestamp: '2026-02-19T13:30:00Z',
  },
  {
    id: 'audit-009',
    userId: 'user-002',
    userName: 'Fatima Al Zaabi',
    action: 'update',
    module: 'settings',
    description: 'Updated company VAT registration details',
    details: { section: 'taxConfiguration' },
    ipAddress: '94.200.77.12',
    timestamp: '2026-02-19T11:00:00Z',
  },
  {
    id: 'audit-010',
    userId: 'user-003',
    userName: 'Ahmed Khalifa',
    action: 'create',
    module: 'sales',
    description: 'Created quotation QTN-2026-0198 for AED 32,000.00',
    details: { quotationId: 'qtn-198', amount: 32000, customer: 'Nakheel Properties' },
    ipAddress: '185.170.214.88',
    timestamp: '2026-02-19T10:15:00Z',
  },
  {
    id: 'audit-011',
    userId: 'user-004',
    userName: 'Noura Bin Rashid',
    action: 'adjust',
    module: 'inventory',
    description: 'Stock adjustment: +50 units of AC Filter (SKU: ACF-001)',
    details: { itemId: 'item-012', sku: 'ACF-001', adjustment: 50, reason: 'Goods received from PO-2026-0065' },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-18T16:30:00Z',
  },
  {
    id: 'audit-012',
    userId: 'user-001',
    userName: 'Muneer Al Hammadi',
    action: 'manage',
    module: 'settings',
    description: 'Invited sara.almazrouei@gmail.com as Staff member',
    details: { invitationId: 'inv-001', email: 'sara.almazrouei@gmail.com', role: 'staff' },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-18T10:00:00Z',
  },
  {
    id: 'audit-013',
    userId: 'user-005',
    userName: 'Omar Saeed',
    action: 'create',
    module: 'accounts',
    description: 'Created journal entry JE-2026-0045 for monthly depreciation',
    details: { journalEntryId: 'je-045', amount: 4200 },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-17T15:00:00Z',
  },
  {
    id: 'audit-014',
    userId: 'user-002',
    userName: 'Fatima Al Zaabi',
    action: 'approve',
    module: 'hr',
    description: 'Approved annual leave request for Rashed Al Nuaimi (3 days)',
    details: { leaveId: 'leave-023', employeeId: 'user-008', days: 3 },
    ipAddress: '94.200.77.12',
    timestamp: '2026-02-17T09:30:00Z',
  },
  {
    id: 'audit-015',
    userId: 'user-001',
    userName: 'Muneer Al Hammadi',
    action: 'update',
    module: 'settings',
    description: 'Enabled two-factor authentication for all admin users',
    details: { setting: 'twoFactorEnabled', value: true },
    ipAddress: '86.96.228.45',
    timestamp: '2026-02-16T08:00:00Z',
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

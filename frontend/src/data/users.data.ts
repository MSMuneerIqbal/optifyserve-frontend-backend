/**
 * User Management Sample Data
 * Extracted from settings.data.ts for the standalone User Management module.
 */

import type { SystemUser, Role, PermissionGroup } from '@/features/user-management/types'

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

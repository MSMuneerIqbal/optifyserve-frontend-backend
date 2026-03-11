/**
 * User Management Module Types
 * Extracted from Settings Module
 */

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
